import React from 'react'
import { ethers } from 'ethers'
import logo from './logo.svg'
import './App.css'
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
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

const MAP_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const MAP_ABI = MapAbi.abi
const GAME_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
const GAME_ABI = GameAbi.abi

function App() {
  const [cells, setCells] = React.useState([])
  const [ships, setShips] = React.useState([])
  const [path, setPath] = React.useState([])
  const [radius, setRadius] = React.useState(5)
  const [contract, setContract] = React.useState(null)
  const [provider, setProvider] = React.useState(null)
  const [direction, setDirection] = React.useState(0)
  const [distance, setDistance] = React.useState(0)
  const [shotDirection, setShotDirection] = React.useState(0)
  const [shotDistance, setShotDistance] = React.useState(0)
  const [destination, setDestination] = React.useState({})
  const [player, setPlayer] = React.useState(null)

  React.useEffect(() => {
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

  React.useEffect(() => {
    const fetchPath = async () => {
      if (contract !== null) {
        // get my ship
        const origin = ships.filter(ship => ship.captain === player).map(s => ({ q: s.q, r: s.r}))[0]
        const pathCells = []
        
        if (origin !== undefined) {

          for (let i=1; i<=distance; i++) {
            const cell = await contract.move(origin, direction, i)
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

  const initMap = async () => {
    console.log('Clicked init Map, using radius', radius)
    setShips([])
    console.log('Reset ships')

    if (contract) {
      console.log('pre init')
      const tx = await contract.initGame(radius).catch((e) => {console.error('horrible mistake:', e)})
      console.log(tx)
      await tx.wait()
      console.log(
        `Created map with radius ${Number(
          await contract.getRadius(),
        )} in block ${await provider.getBlockNumber()}`,
      )
      fetchData()
    }
  }

  const move = async () => {
    // get my ship
    console.log('get my ship:', ships, player)
    const ship = ships.filter(ship => ship.captain === player).map(s => ({ q: s.q, r: s.r}))[0]
    console.log('ship', ship)
    if (ship !== undefined && contract != null) {
      console.log(ship, direction, distance)
      const tx = await contract.travel(ship, direction, distance)
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
      const rad = Number(await contract.getRadius())
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
      const tx = await contract.addShip().catch(console.error)
      await tx.wait()
    }
    // const ship = { q: 3, r: 3 }
    // setShip(ship)
    console.log('Added ship')
    fetchShips()
  }

  async function fetchShips() {
    if (contract !== null) {
      const result = await contract.getShips().catch(console.error)
          let shipsTemp = await result.map((ship, index) => {
            const {0: coordinate, 6: captain} = ship
            console.log(`Ship ${index}: ${coordinate[0]}, ${coordinate[1]} for ${captain}`)
            return { q: Number(coordinate[0]), r: Number(coordinate[1]), captain}
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
      const cell = await contract.getCell(center)

      if (!cell.exists) {
        console.error('Map not initialized yet.')
        return
      }

      console.log(cell)


      let tempCoords = await contract.getCells()
      console.log('Coords', tempCoords)
      let tempCells = tempCoords.map((c) => {
        return contract.getCell({q: c.q, r: c.r})
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
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h3">Battle Royale</Typography>
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

                <TextField
                  id="outlined-number"
                  label="Distance"
                  type="number"
                  value={distance}
                  onChange={(e) => {
                    setDistance(parseInt(e.target.value))
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
              <Button variant="outlined" onClick={move}>
                Move
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={4}>
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
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <HexGrid cells={cells} ships={ships} player={player} path={path} destination={destination}/>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
