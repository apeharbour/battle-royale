import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'
import {
  Box,
  Button,
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
  Typography,
} from '@mui/material'
import HexGrid from './HexGrid'
import MapAbi from './abis/Map.json'
import GameAbi from './abis/Game.json'

const MAP_ADDRESS = '0x62e246444f8af3BB010d3d6D9E9b17D2330225ca'
const MAP_ABI = MapAbi.abi
const GAME_ADDRESS = '0xfA284531CD3d7b4c997E82a4cADE4Ff0717112ca'
const GAME_ABI = GameAbi.abi


const ariaLabel = { 'aria-label': 'description' }

function App() {
  const [cells, setCells] = useState([])
  const [ships, setShips] = useState([])
  const [path, setPath] = useState([])
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
  const [playerAddress, setPlayerAddress] = useState("")
  const [revealMovesData, setRevealMovesData] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState('')
  const [gameId, setGameId] = useState(1)
  const [toggleGameId, setToggleGameId] = useState(1)
  const [endGameId, setEndGameId] = useState(0)




  const getYachts = async () => {
    if(contract) {
      try {
        const metadata = await contract.getMetadata('0xCd9680dd8318b0df924f0bD47a407c05B300e36f');
        console.log("Metadata:", metadata);
        return metadata; // You can return the metadata if you need it elsewhere
      } catch (error) {
        console.error(error);
      }
    }
  }
  

  useEffect(() => {
    const fetchContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        GAME_ADDRESS,
        GAME_ABI,
        signer,
      )
      setContract(contract)
      setProvider(provider)
      setPlayer(signer.address)
    }

    fetchContract()
  }, [])

  useEffect(() => {
    const fetchPath = async () => {
      if (contract !== null) {
        // get my ship
        const origin = ships.filter(ship => ship.captain === player).map(s => ({ q: s.q, r: s.r}))[0]
        const pathCells = []
        
        if (origin !== undefined) {

          for (let i=1; i<=distance; i++) {
            const cell = await contract.move(origin, direction, i, gameId)
            pathCells.push({q: Number(cell.q), r: Number(cell.r)})
          }
          
          console.log(pathCells)
          
          setDestination(pathCells[pathCells.length-1])
          setPath([...pathCells])
        }
      }
    }

    fetchPath()
  }, [distance, direction, player])

  useEffect(() => {
    console.log('Game Id value: ', gameId)
  },[gameId])

  const startGame = async () => {
    if(contract){
      const tx = await contract.startNewGame(gameId).catch(console.error)
      await tx.wait()
    }
  }

  const endGame = async () => {
    if(contract) {
      const tx = await contract.endGame(endGameId).catch(console.error)
      await tx.wait()
    }
  }
  
  const toggleGameIdValue = () => {
    setGameId(toggleGameId)
    console.log('ToggleGameId:', toggleGameId)
    console.log('GameId:', gameId)
  }

  const initMap = async () => {
    console.log('Clicked init Map, using radius', radius)
    setShips([])
    console.log('Reset ships')

    if (contract) {
      console.log('pre init')
      const tx = await contract.initGame(radius, gameId).catch((e) => {console.error('horrible mistake:', e)})
      console.log(tx)
      await tx.wait()
      console.log(
        `Created map with radius ${Number(
          await contract.getRadius(gameId),
        )} in block ${await provider.getBlockNumber()}`,
      )
      fetchData()
    }
  }

  const commitMoves = async () => {
    if(contract){
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
    if(contract){
      const tx = await contract.revealMove(direction, distance, shotDirection, shotDistance, secret, gameId).catch(console.error)
      await tx.wait()

      console.log(tx)
      setDistance(0)
      setShotDistance(0)
      setSecret(0)
    }
  }

  const allowCommit = async () => {
    if(contract) {
      const tx = await contract.allowCommitMoves(gameId).catch(console.error)
      await tx.wait()
    }
  }

  const allowSubmit = async () => {
    if(contract) {
      const tx = await contract.allowSubmitMoves(gameId).catch(console.error)
      await tx.wait()
    }
  }



  const handleRevealMovesData = () => {
         fetchShips()
         setRevealMovesData(!revealMovesData)
 }

 const updateWorld = async () => {
  if(contract){

    // Define the filter for the events
    const filterWinner = contract.filters.GameWinner(null);

    const tx = await contract.updateWorld(gameId)
    const receipt = await tx.wait()  // receipt includes the block number where transaction is mined

    // Fetch the events from the mined block to the latest
    const eventWinnerList = await contract.queryFilter(filterWinner, receipt.blockNumber);

    // If there are GameWinner events
    if(eventWinnerList.length > 0) {
      const eventWinner = eventWinnerList[eventWinnerList.length - 1]; // Get the latest event
      const winner = eventWinner.args[0]; // Access the first argument
      console.log('Game Winner:', winner);
    }
    fetchShips()
    }
 }


  const move = async () => {
    // get my ship
    console.log('get my ship:', ships, player)
    const ship = ships.filter(ship => ship.captain === player).map(s => ({ q: s.q, r: s.r}))[0]
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

  const addShip = async () => {
    if (contract !== null) {
      console.log('Adding ship')
      const tx = await contract.addShip(gameId).catch(console.error)
      await tx.wait()
    }
    // const ship = { q: 3, r: 3 }
    // setShip(ship)
    console.log('Added ship')
    fetchShips()
  }

  async function fetchShips() {
    if (contract !== null) {
      const enumDirections = ['E', 'NE', 'NW', 'W', 'SW', 'SE', 'NO_MOVE'];
      const result = await contract.getShips(gameId).catch(console.error)
          let shipsTemp = await result.map((ship, index) => {
            const { 0: coordinate,
                    1: travelDirectionIndex,
                    2: travelDistanceUint,
                    3: shotDirectionIndex,
                    4: shotDistanceUint,
                    5: publishedMove,
                    6: captain} = ship

             const travelDirection = enumDirections[travelDirectionIndex];
             const travelDistance = Number(travelDistanceUint)
             const shotDirection = enumDirections[shotDirectionIndex];  
             const shotDistance = Number(shotDistanceUint)      
            console.log(`Ship ${index}: ${coordinate[0]}, ${coordinate[1]} for ${captain}`)
            return { q: Number(coordinate[0]),
                     r: Number(coordinate[1]),
                     travelDirection,
                     travelDistance,
                     shotDirection,
                     shotDistance,
                     publishedMove,
                     captain
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
      let tempCells = tempCoords.map((c) => {
        return contract.getCell({q: c.q, r: c.r}, gameId)
      })

      let resolvedTempCells = await Promise.all(tempCells)
      resolvedTempCells = resolvedTempCells.map((c) => ({ q: Number(c.q), r: Number(c.r), island: c.island, exists: c.exists }))

      console.log('Cells')
      console.log(resolvedTempCells)
      console.log(JSON.stringify(resolvedTempCells))

      Promise.all(tempCells).then((values) => {
        setCells([...values])
      }).catch(console.error)
    }
  }

  return (
    <Container>
      {gameOver ? (
        <Typography variant='h3'>
          Game Over. The winner is: {winner}
        </Typography>
      ) : (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h3">Battle Royale</Typography>
        </Grid>

        <Grid container mt={2}>
        <Grid item xs={4}>
        <Stack spacing={2} direction="row">
          <TextField variant='outlined' value={gameId} label="Start Game" onChange={(e) => {
            setGameId(parseInt(e.target.value))
          }} />
          <Button variant='outlined' onClick={startGame}>Start Game</Button>
          </Stack>
        </Grid>
        <Grid item xs={4} >
          <Stack spacing={2} direction="row">
          <TextField variant='outlined' value={gameId} label="Toggle Game ID" onChange={(e) => {
            setGameId(parseInt(e.target.value))
          }} />
          {/* <Button variant='outlined' onClick={toggleGameIdValue}>Toggle Game ID</Button> */}
            </Stack>       
           </Grid>
           <Grid item xs={4}>
            <Stack spacing={2} direction="row">
            <TextField variant='outlined' value={endGameId} label="End Game" onChange={(e) => {
            setEndGameId(parseInt(e.target.value))
          }} />
          <Button variant='outlined' onClick={endGame}>End Game</Button>
            </Stack>
           </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant='h4'>Game ID: {gameId}</Typography>
        </Grid>

        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={4}>
              <Typography variant="h5">Init</Typography>
              <Stack spacing={2} direction="row">
                <TextField
                  variant="outlined"
                  value={radius}
                  onChange={(e) => {
                  setRadius(parseInt(e.target.value))
                  }}
                />
                <Button variant="outlined" onClick={initMap}>
                  Init
                </Button>
              </Stack>
                <Typography variant="h5">Controls</Typography>
              <Button variant="outlined" onClick={getMap}>
                Get Map
              </Button>
              <Button variant="outlined" onClick={addShip}>
                Add Ship
              </Button>
              <Button variant="outlined" onClick={fetchShips}>
                Get Ships
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={4}>
              <Typography variant="h5">Movements</Typography>

              <Stack spacing={2} direction="row">
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label"> Direction </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={direction}
                    onChange={(event) => {
                      setDirection(event.target.value)
                    }}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="0" control={<Radio />} label="E" />
                    <FormControlLabel value="1" control={<Radio />} label="NE" />
                    <FormControlLabel value="2" control={<Radio />} label="NW" />
                    <FormControlLabel value="3" control={<Radio />} label="W" />
                    <FormControlLabel value="4" control={<Radio />} label="SW" />
                    <FormControlLabel value="5" control={<Radio />} label="SE" />
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">Shot Direction</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={shotDirection}
                    onChange={(event) => { setShotDirection(event.target.value) }}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="0" control={<Radio />} label="E" />
                    <FormControlLabel value="1" control={<Radio />} label="NE" />
                    <FormControlLabel value="2" control={<Radio />} label="NW" />
                    <FormControlLabel value="3" control={<Radio />} label="W" />
                    <FormControlLabel value="4" control={<Radio />} label="SW" />
                    <FormControlLabel value="5" control={<Radio />} label="SE" />
                  </RadioGroup>
                </FormControl>
              </Stack>

              <Stack spacing={2} direction="column">
              <TextField
                  required
                  id="outlined-required"
                  label="Move Distance"
                  type='number'
                  inputProps={{ min: "0", step: "1" }}
                  onChange={(event) => {
                    let newValue = event.target.value;
                    if (newValue === "" || newValue < 0) {
                      newValue = "0";
                    }
                    setDistance(newValue);
                  }}
                  value={distance} // set value to handle the label position
                />
                <TextField
                  required
                  id="outlined-required"
                  label="Shot Distance"
                  type='number'
                  inputProps={{ min: "0", step: "1" }}
                  onChange={(event) => {
                    let newValue = event.target.value;
                    if (newValue === "" || newValue < 0) {
                      newValue = "0";
                    }
                    setShotDistance(newValue);
                  }}
                  value={shotDistance} // set value to handle the label position
                />
                  <TextField
                  required
                  id="outlined-required"
                  label="Secret Value"
                  type='number'
                  inputProps={{ min: "0", step: "1" }}
                  onChange={(event) => {
                    let newValue = event.target.value;
                    if (newValue === "" || newValue < 0) {
                      newValue = "0";
                    }
                    setSecret(newValue);
                  }}
                  value={secret} // set value to handle the label position
                /> 

              </Stack>
              <Button variant="outlined" onClick={commitMoves}>
                Commit Move
              </Button>
              <Button variant="outlined" onClick={submitMoves}>
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
        <Button variant='contained' onClick={handleRevealMovesData} >Reveal all Moves</Button>
        <Button variant='contained' onClick={allowCommit}>Allow players to commit</Button>
        <Button variant='contained' onClick={allowSubmit}>Allow players to submit</Button>
        <Button variant='contained' onClick={updateWorld}>Update World</Button>
        <Button variant='contained' onClick={getYachts}>Pull Yachts</Button>
        </Stack>
        </Paper>
        </Grid>

        {/* <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={4}>
              <Typography variant="h5">Shot</Typography>

              <Stack spacing={2} direction="row">
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">Shot Direction</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={shotDirection}
                    onChange={(event) => { setShotDirection(event.target.value) }}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="0" control={<Radio />} label="E" />
                    <FormControlLabel value="1" control={<Radio />} label="NE" />
                    <FormControlLabel value="2" control={<Radio />} label="NW" />
                    <FormControlLabel value="3" control={<Radio />} label="W" />
                    <FormControlLabel value="4" control={<Radio />} label="SW" />
                    <FormControlLabel value="5" control={<Radio />} label="SE" />
                  </RadioGroup>
                </FormControl>

                <TextField
                  id="outlined-number"
                  label="Distance"
                  type="number"
                  value={shotDistance}
                  onChange={(e) => {
                    setShotDistance(parseInt(e.target.value))
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
              <Button variant="outlined" onClick={moveShoot}>
                Move & Shoot
              </Button>
            </Stack>
          </Paper>
        </Grid> */}

        <Grid container spacing={2} marginTop={10}>
        <Grid item xs={8}>
          <Paper sx={{ p: 2 }}>
            <HexGrid cells={cells} ships={ships} player={player} path={path} destination={destination}/>
          </Paper>
        </Grid>
        {/* <Grid item xs={3}>
          <Box marginTop={5}>
            <Typography variant='h5'> Submit your moves</Typography>
          </Box>
           <Box
             component="form"
             sx={{
                   '& > :not(style)': { m: 1 },
                 }}
             noValidate
             autoComplete="off"
             marginTop={5}
            >
            <TextField
          required
          id="outlined-required"
          label="Move Direction"
          helperText="E NE NW W SW SE" 
          onChange={(e) => setDirection(e.target.value)}         
        />
         <TextField
          required
          id="outlined-required"
          label="Move Distance"
          type='number'
          inputProps={{ min: "0", step: "1" }}
          onChange={(event) => {
            const newValue = event.target.value < 0 ? 0 : event.target.value;
            setDistance(newValue);
          }}
        />
         <TextField
          required
          id="outlined-required"
          label="Shot Direction"
          helperText="E NE NW W SW SE"
          onChange={(e) => setShotDirection(e.target.value)}
        />
         <TextField
          required
          id="outlined-required"
          label="Shot Distance"
          type='number'
          inputProps={{ min: "0", step: "1" }}
          onChange={(event) => {
            const newValue = event.target.value < 0 ? 0 : event.target.value;
            setShotDistance(newValue);
          }}
        />
            </Box>
            <Box marginTop={2} marginLeft={1}>     
            <Button variant='contained' size='large' onClick={submitMoves}>Submit move</Button>
            </Box>
            <Box>
            <Box marginTop={5}>
              <Typography variant='h5'>Reveal Moves</Typography>
            </Box>  
            <Box marginTop={2}>
              <TextField
          required
          id="outlined-required"
          label="Player Address" 
          onChange={(e) => setPlayerAddress(e.target.value)}       
        />
        </Box>
        <Box marginTop={2}>
        <Button variant='contained' size='large' onClick={revealMoves}>Reveal move</Button>
        </Box>
        </Box>
         </Grid> */}
         <Grid item xs={4}>
          

        {revealMovesData && ships.map((ship, index) => (
          <Box key={index}>
            <Typography variant='body1'>Captain: {ship.captain}</Typography>
            <Typography variant='body1'>Coordinates: {ship.q}, {ship.r}</Typography>
            <Typography variant='body1'>Travel Direction: {ship.travelDirection}</Typography>
            <Typography variant='body1'>Travel Distance: {ship.travelDistance}</Typography>
            <Typography variant='body1'>Shot Direction: {ship.shotDirection}</Typography>
            <Typography variant='body1'>Shot Distance: {ship.shotDistance}</Typography>
            { ship.publishedMove !== undefined &&
            <Typography variant='body1'>Published Move: {ship.publishedMove.toString()}</Typography>
            }
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
