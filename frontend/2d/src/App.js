import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Input,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import HexGrid from './HexGrid'
import MapAbi from './abis/Map.json'
import GameAbi from './abis/Game.json'
import GenesisYachts from './GenesisYachts'
import axios from 'axios'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const MAP_ADDRESS = '0xEDBe6b86B6D2be6C1ac08b43321bc33263436b93'
const MAP_ABI = MapAbi.abi
const GAME_ADDRESS = '0xBd0a4F7fc74f4AC5165694469Cd5246390f1974b'
const GAME_ABI = GameAbi.abi

const ariaLabel = { 'aria-label': 'description' }

function App() {
  const [cells, setCells] = useState([])
  const [ships, setShips] = useState([])
  const [path, setPath] = useState([])
  const [pathShots, setPathShots] = useState([])
  const [travelCell, setTravelCell] = useState()
  const [radius, setRadius] = useState(4)
  const [contract, setContract] = useState(null)
  const [provider, setProvider] = useState(null)
  const [direction, setDirection] = useState(0)
  const [distance, setDistance] = useState(0)
  const [secret, setSecret] = useState(0)
  const [shotDirection, setShotDirection] = useState(0)
  const [shotDistance, setShotDistance] = useState(0)
  const [destination, setDestination] = useState({})
  const [player, setPlayer] = useState(null)
  const [playerAddress, setPlayerAddress] = useState('')
  const [revealMovesData, setRevealMovesData] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState('')
  const [gameId, setGameId] = useState(1)
  const [toggleGameId, setToggleGameId] = useState(1)
  const [endGameId, setEndGameId] = useState(0)
  const [playerData, setPlayerData] = useState(null)
  const [yachts, setYachts] = useState([])
  const [selectedYacht, setSelectedYacht] = useState(null)
  const [showYachtSelectError, setShowYachtSelectError] = useState(false)

  useEffect(() => {
    axios
      .get('https://m59jtciqre.execute-api.us-east-1.amazonaws.com/getGenesisNfts', {
        params: { address: player }
      })
      .then(({ data }) => {
        // Handle the response data
        setYachts(data)
        console.log('Genesis Data:', data)
      })
      .catch(error => {
        // Handle errors
        console.error(error)
      })
  }, [player])

  useEffect(() => {
    const fetchContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(GAME_ADDRESS, GAME_ABI, signer)
      setContract(contract)
      setProvider(provider)
      setPlayer(signer.address)
      const data = {
        playerAddress: signer.address,
        contractInstance: contract
      }
      setPlayerData(data)
    }

    fetchContract()
  }, [])

  useEffect(() => {
    const fetchPath = async () => {
      if (contract !== null) {
        // get my ship
        const origin = ships.filter(ship => ship.captain === player).map(s => ({ q: s.q, r: s.r }))[0]
        const pathCells = []

        if (origin !== undefined) {
          for (let i = 1; i <= distance; i++) {
            const cell = await contract.move(origin, direction, i, gameId)
            console.log('Travel destination Cell:', cell)
            console.log('Ship Origin:', origin)
            pathCells.push({ q: Number(cell.q), r: Number(cell.r) })
          }

          console.log('PathCells', pathCells)

          //setDestination(pathCells[pathCells.length-1])
          setPath([...pathCells])

          if (pathCells.length > 0) {
            setTravelCell(pathCells[pathCells.length - 1])
          }
        }
      }
    }

    fetchPath()
  }, [distance, direction, player])

  useEffect(() => {
    const fetchShotPath = async () => {
      if (contract !== null) {
        // If travelCell is not defined, use the ship's current position as the starting point
        const startingPoint = travelCell || ships.filter(ship => ship.captain === player).map(s => ({ q: s.q, r: s.r }))[0];
        if (startingPoint) {
          const pathShotCells = [];
          for (let i = 1; i <= shotDistance; i++) {
            const cell = await contract.move(startingPoint, shotDirection, i, gameId);
            console.log('Combat destination Cell:', cell);
            pathShotCells.push({ q: Number(cell.q), r: Number(cell.r) });
          }
  
          console.log('PathShotCells', pathShotCells);
          setPathShots([...pathShotCells]);
        }
      }
    }
    fetchShotPath();
  }, [travelCell, shotDistance, shotDirection, player, ships, contract, gameId]);
  

  useEffect(() => {
    console.log('Game Id value: ', gameId)
  }, [gameId])

  const startGame = async () => {
    if (contract) {
      const tx = await contract.startNewGame(gameId).catch(console.error)
      await tx.wait()
      console.log('Start Game:', tx)
    }
  }

  const endGame = async () => {
    if (contract) {
      const tx = await contract.endGame(endGameId).catch(console.error)
      await tx.wait()
      console.log('End Game:', tx)
    }
  }

  const initMap = async () => {
    console.log('Clicked init Map, using radius', radius)
    setShips([])
    console.log('Reset ships')

    if (contract) {
      console.log('pre init')
      const tx = await contract.initGame(radius, gameId).catch(e => {
        console.error('horrible mistake:', e)
      })
      console.log(tx)
      await tx.wait()
      console.log(
        `Created map with radius ${Number(
          await contract.getRadius(gameId)
        )} in block ${await provider.getBlockNumber()}`
      )
      fetchData()
    }
  }

  const commitMoves = async () => {
    if (contract) {
      const moveHash = ethers.solidityPackedKeccak256(
        ['uint8', 'uint8', 'uint8', 'uint8', 'uint256'],
        [direction, distance, shotDirection, shotDistance, secret]
      )

      const tx = await contract.commitMove(moveHash, gameId).catch(console.error)
      await tx.wait()

      console.log(tx)
      console.log(moveHash)
    }
  }

  const submitMoves = async () => {
    if (contract) {
      const tx = await contract.revealMove(direction, shotDirection, gameId).catch(console.error)
      await tx.wait()

      console.log(tx)
      setDistance(0)
      setShotDistance(0)
      setSecret(0)
    }
  }

  const allowCommit = async () => {
    if (contract) {
      const tx = await contract.allowCommitMoves(gameId).catch(console.error)
      await tx.wait()
    }
  }

  const allowSubmit = async () => {
    if (contract) {
      const tx = await contract.allowSubmitMoves(gameId).catch(console.error)
      await tx.wait()
    }
  }

  const handleRevealMovesData = () => {
    fetchShips()
    setRevealMovesData(!revealMovesData)
  }

  const updateWorld = async () => {
    if (contract) {
      // Define the filter for the events
      const filterWinner = contract.filters.GameWinner(null)

      const tx = await contract.updateWorld(gameId)
      const receipt = await tx.wait() // receipt includes the block number where transaction is mined

      // Fetch the events from the mined block to the latest
      const eventWinnerList = await contract.queryFilter(filterWinner, receipt.blockNumber)

      // If there are GameWinner events
      if (eventWinnerList.length > 0) {
        const eventWinner = eventWinnerList[eventWinnerList.length - 1] // Get the latest event
        const winner = eventWinner.args[0] // Access the first argument
        console.log('Game Winner:', winner)
      }
      fetchShips()
    }
  }

  const move = async () => {
    // get my ship
    console.log('get my ship:', ships, player)
    const ship = ships.filter(ship => ship.captain === player).map(s => ({ q: s.q, r: s.r }))[0]
    console.log('ship', ship)
    if (ship !== undefined && contract != null) {
      console.log(ship, direction, distance)
      const tx = await contract.travel(ship, direction, distance, gameId)
      await tx.wait()

      fetchShips()
      setDistance(0)
      setDirection(0)
      // const {0: dies, 1: cell} = result
      // if (!dies) {

      //   setShip({q: Number(cell.q), r: Number(cell.r)})
      //   console.log(`Move ship to ${Number(cell.q)},${Number(cell.r)}`)
      //   setDistance(0)
      // } else {
      //   console.log('ship sinks')
      //   setDistance(0)
      // }
    }
  }

  const moveShoot = async () => {
    console.log('Clicked moveShoot')
  }

  const getContractRadius = async () => {
    if (contract !== null) {
      const rad = Number(await contract.getRadius(gameId))
      console.log('Radius:', rad)
    }
  }

  const getMap = async () => {
    if (contract !== null) {
      fetchData()
    }
  }

  const addShip = async (speed, range) => {
    if (contract !== null) {
      console.log('Adding ship')
      const tx = await contract.addShip(gameId, speed, range).catch(console.error)
      await tx.wait()
    }
    // const ship = { q: 3, r: 3 }
    // setShip(ship)
    console.log('Added ship')
    fetchShips()
  }

  const addShipWoYacht = async () => {
    if (contract !== null) {
      console.log('Adding Ship w/o yacht')
      const tx = await contract.addShip(gameId, 50, 50).catch(console.error)
      await tx.wait()
    }
    console.log('Added ship')
    fetchShips()
  }

  async function fetchShips() {
    if (contract !== null) {
      const enumDirections = ['E', 'NE', 'NW', 'W', 'SW', 'SE', 'NO_MOVE']
      const result = await contract.getShips(gameId).catch(console.error)
      let shipsTemp = await result.map((ship, index) => {
        const {
          0: coordinate,
          1: travelDirectionIndex,
          2: travelDistanceUint,
          3: shotDirectionIndex,
          4: shotDistanceUint,
          5: publishedMove,
          6: captain,
          7: speedUint,
          8: rangeUint
        } = ship

        const travelDirection = enumDirections[travelDirectionIndex]
        const travelDistance = Number(travelDistanceUint)
        const shotDirection = enumDirections[shotDirectionIndex]
        const shotDistance = Number(shotDistanceUint)
        const speed = Number(speedUint)
        const range = Number(rangeUint)
        console.log(`Ship ${index}: ${coordinate[0]}, ${coordinate[1]} for ${captain}`)
        return {
          q: Number(coordinate[0]),
          r: Number(coordinate[1]),
          travelDirection,
          travelDistance,
          shotDirection,
          shotDistance,
          publishedMove,
          captain,
          speed,
          range
        }
      })

      console.log('Ships')
      console.log(shipsTemp)
      console.log(JSON.stringify(shipsTemp))

      setShips([...shipsTemp])
    }
  }

  async function fetchData() {
    if (contract !== null) {
      const center = { q: radius, r: radius }
      const cell = await contract.getCell(center, gameId)

      if (!cell.exists) {
        console.error('Map not initialized yet.')
        return
      }

      console.log(cell)

      let tempCoords = await contract.getCells(gameId)
      console.log('Coords', tempCoords)
      let tempCells = tempCoords.map(c => {
        return contract.getCell({ q: c.q, r: c.r }, gameId)
      })

      let resolvedTempCells = await Promise.all(tempCells)
      resolvedTempCells = resolvedTempCells.map(c => ({
        q: Number(c.q),
        r: Number(c.r),
        island: c.island,
        exists: c.exists
      }))

      console.log('Cells')
      console.log(resolvedTempCells)
      console.log(JSON.stringify(resolvedTempCells))

      Promise.all(tempCells)
        .then(values => {
          setCells([...values])
        })
        .catch(console.error)
    }
  }

  return (
    <Container>
      {gameOver ? (
        <Typography variant='h3'>Game Over. The winner is: {winner}</Typography>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant='h3'>Battle Royale</Typography>
          </Grid>

          <Grid container mt={2}>
            <Grid item xs={4}>
              <Stack spacing={2} direction='row'>
                <TextField
                  variant='outlined'
                  value={gameId}
                  label='Start Game'
                  onChange={e => {
                    setGameId(parseInt(e.target.value))
                  }}
                />
                <Button variant='outlined' onClick={startGame}>
                  Start Game
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack spacing={2} direction='row'>
                <TextField
                  variant='outlined'
                  value={gameId}
                  label='Toggle Game ID'
                  onChange={e => {
                    setGameId(parseInt(e.target.value))
                  }}
                />
                {/* <Button variant='outlined' onClick={toggleGameIdValue}>Toggle Game ID</Button> */}
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack spacing={2} direction='row'>
                <TextField
                  variant='outlined'
                  value={endGameId}
                  label='End Game'
                  onChange={e => {
                    setEndGameId(parseInt(e.target.value))
                  }}
                />
                <Button variant='outlined' onClick={endGame}>
                  End Game
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant='h4'>Game ID: {gameId}</Typography>
          </Grid>

          <Grid item xs={4}>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={4}>
                <Typography variant='h5'>Init</Typography>
                <Stack spacing={2} direction='row'>
                  <TextField
                    variant='outlined'
                    value={radius}
                    onChange={e => {
                      setRadius(parseInt(e.target.value))
                    }}
                  />
                  <Button variant='outlined' onClick={initMap}>
                    Init
                  </Button>
                </Stack>
                <Typography variant='h5'>Controls</Typography>
                <Button variant='outlined' onClick={getMap}>
                  Get Map
                </Button>
                {yachts &&
                  yachts.map((yacht, index) => {
                    const ipfsUrl = yacht.metadata && yacht.metadata.image
                    const httpUrl = ipfsUrl
                      ? ipfsUrl.replace('ipfs://', 'https://apeharbour.mypinata.cloud/ipfs/') +
                        '?pinataGatewayToken=DpUkFkY4XM34Nwun1APLX8jozT9nY5J-DAxq5tK141A-BczLnktEeq7GaPAbwTDF'
                      : null

                    return (
                      <Card
                        key={yacht.tokenId}
                        sx={{
                          display: 'flex',
                          border: selectedYacht === yacht.tokenId ? '2px solid blue' : 'none'
                        }}
                        onClick={() => {
                          if (selectedYacht === yacht.tokenId) {
                            setSelectedYacht(null) // deselect the yacht
                          } else {
                            setSelectedYacht(yacht.tokenId) // select the yacht
                          }
                        }}
                      >
                        <CardMedia component='img' sx={{ width: 151 }} image={httpUrl} alt={yacht.tokenId} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component='div' variant='h5'>
                              {yacht.metadata.name}
                            </Typography>
                            <Typography variant='subtitle1' color='text.secondary' component='div'>
                              {yacht.tokenId}
                            </Typography>
                            {selectedYacht === yacht.tokenId && <CheckCircleIcon color='#0000FF' />}
                          </CardContent>
                        </Box>
                      </Card>
                    )
                  })}
                <Button
                  variant='outlined'
                  onClick={() => {
                    if (selectedYacht) {
                      // Extract speed and range from the selected yacht's metadata
                      const yachtMetadata = yachts.find(yacht => yacht.tokenId === selectedYacht).metadata
                      const speed = yachtMetadata.attributes.find(attr => attr.trait_type === 'Speed').value
                      const range = yachtMetadata.attributes.find(attr => attr.trait_type === 'Range').value

                      addShip(speed, range) // Pass speed and range to the addShip function
                      setShowYachtSelectError(false)
                    } else {
                      setShowYachtSelectError(true)
                    }
                  }}
                  disabled={!selectedYacht}
                >
                  Add Ship
                </Button>
                {showYachtSelectError && (
                  <Typography variant='body1' style={{ color: 'red' }}>
                    Please select a yacht first!
                  </Typography>
                )}

                {yachts.length === 0 && (
                  <Button variant='outlined' onClick={addShipWoYacht}>
                    Add Ship w/o Yacht
                  </Button>
                )}

                <Button variant='outlined' onClick={fetchShips}>
                  Get Ships
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={4}>
                <Typography variant='h5'>Movements</Typography>

                <Stack spacing={2} direction='row'>
                  <FormControl>
                    <FormLabel id='demo-radio-buttons-group-label'> Direction </FormLabel>
                    <RadioGroup
                      aria-labelledby='demo-radio-buttons-group-label'
                      value={direction}
                      onChange={event => {
                        setDirection(event.target.value)
                      }}
                      name='radio-buttons-group'
                    >
                      <FormControlLabel value='0' control={<Radio />} label='E' />
                      <FormControlLabel value='1' control={<Radio />} label='NE' />
                      <FormControlLabel value='2' control={<Radio />} label='NW' />
                      <FormControlLabel value='3' control={<Radio />} label='W' />
                      <FormControlLabel value='4' control={<Radio />} label='SW' />
                      <FormControlLabel value='5' control={<Radio />} label='SE' />
                    </RadioGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel id='demo-radio-buttons-group-label'>Shot Direction</FormLabel>
                    <RadioGroup
                      aria-labelledby='demo-radio-buttons-group-label'
                      value={shotDirection}
                      onChange={event => {
                        setShotDirection(event.target.value)
                      }}
                      name='radio-buttons-group'
                    >
                      <FormControlLabel value='0' control={<Radio />} label='E' />
                      <FormControlLabel value='1' control={<Radio />} label='NE' />
                      <FormControlLabel value='2' control={<Radio />} label='NW' />
                      <FormControlLabel value='3' control={<Radio />} label='W' />
                      <FormControlLabel value='4' control={<Radio />} label='SW' />
                      <FormControlLabel value='5' control={<Radio />} label='SE' />
                    </RadioGroup>
                  </FormControl>
                </Stack>

                <Stack spacing={2} direction='column'>
                  <TextField
                    required
                    id='outlined-required'
                    label='Move Distance'
                    type='number'
                    inputProps={{ min: '0', step: '1' }}
                    onChange={event => {
                      let newValue = event.target.value
                      if (newValue === '' || newValue < 0) {
                        newValue = '0'
                      }
                      setDistance(newValue)
                    }}
                    value={distance} // set value to handle the label position
                  />
                  <TextField
                    required
                    id='outlined-required'
                    label='Shot Distance'
                    type='number'
                    inputProps={{ min: '0', step: '1' }}
                    onChange={event => {
                      let newValue = event.target.value
                      if (newValue === '' || newValue < 0) {
                        newValue = '0'
                      }
                      setShotDistance(newValue)
                    }}
                    value={shotDistance} // set value to handle the label position
                  />
                  {/* <TextField
                    required
                    id='outlined-required'
                    label='Secret Value'
                    type='number'
                    inputProps={{ min: '0', step: '1' }}
                    onChange={event => {
                      let newValue = event.target.value
                      if (newValue === '' || newValue < 0) {
                        newValue = '0'
                      }
                      setSecret(newValue)
                    }}
                    value={secret} // set value to handle the label position
                  /> */}
                </Stack>
                {/* <Button variant="outlined" onClick={commitMoves}>
                Commit Move
              </Button> */}
                <Button variant='outlined' onClick={submitMoves}>
                  Submit Move
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant='h5'>Reveal Moves</Typography>
                </Box>
                <Button variant='contained' onClick={handleRevealMovesData}>
                  Reveal all Moves
                </Button>
                {/* <Button variant='contained' onClick={allowCommit}>
                  Allow players to commit
                </Button> */}
                <Button variant='contained' onClick={allowSubmit}>
                  Allow players to submit
                </Button>
                <Button variant='contained' onClick={updateWorld}>
                  Update World
                </Button>
                {/* {player && contract && (
        <GenesisYachts playerData={playerData} />
        )} */}
              </Stack>
            </Paper>
          </Grid>

          <Grid container spacing={2} marginTop={10}>
            <Grid item xs={8}>
              <Paper sx={{ p: 2 }}>
                <HexGrid
                  cells={cells}
                  ships={ships}
                  player={player}
                  path={path}
                  pathShots={pathShots}
                  destination={destination}
                  travelCell={travelCell}
                />
              </Paper>
            </Grid>
            <Grid item xs={4}>
              {revealMovesData &&
                ships.map((ship, index) => (
                  <Box key={index}>
                    <Typography variant='body1'>Captain: {ship.captain}</Typography>
                    <Typography variant='body1'>
                      Coordinates: {ship.q}, {ship.r}
                    </Typography>
                    <Typography variant='body1'>Travel Direction: {ship.travelDirection}</Typography>
                    <Typography variant='body1'>Travel Distance: {ship.travelDistance}</Typography>
                    <Typography variant='body1'>Shot Direction: {ship.shotDirection}</Typography>
                    <Typography variant='body1'>Shot Distance: {ship.shotDistance}</Typography>
                    <Typography variant='body1'>Speed: {ship.speed}</Typography>
                    <Typography variant='body1'>Range: {ship.range}</Typography>
                    {ship.publishedMove !== undefined && (
                      <Typography variant='body1'>Published Move: {ship.publishedMove.toString()}</Typography>
                    )}
                    <br />
                  </Box>
                ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  )
}

export default App
