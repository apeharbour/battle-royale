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
  const [ship, setShip] = React.useState({})
  const [path, setPath] = React.useState([])
  const [radius, setRadius] = React.useState(5)
  const [contract, setContract] = React.useState(null)
  const [provider, setProvider] = React.useState(null)
  const [direction, setDirection] = React.useState(0)
  const [distance, setDistance] = React.useState(0)
  const [shotDirection, setShotDirection] = React.useState(0)
  const [shotDistance, setShotDistance] = React.useState(0)
  const [destination, setDestination] = React.useState({})

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
    }

    fetchContract()
  }, [])

  React.useEffect(() => {
    const fetchPath = async () => {
      if (contract !== null) {
        const pathCells = []
        
        for (let i=1; i<=distance; i++) {
          const cell = await contract.move(ship, direction, i)
          pathCells.push({q: Number(cell.q), r: Number(cell.r)})
        }

        setDestination(pathCells[pathCells.length-1])
        setPath([...pathCells])
      }
    }

    fetchPath()
  }, [distance, direction])

  const initMap = async () => {
    console.log('Clicked init Map, using radius', radius)
    setShip({})

    if (contract !== null) {
      const tx = await contract.initGame(radius)
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
    if (contract != null) {
      const result = await contract.travel(ship, direction, distance)
      const {0: dies, 1: cell} = result
      if (!dies) {
        setShip({q: Number(cell.q), r: Number(cell.r)})
        console.log(`Move ship to ${Number(cell.q)},${Number(cell.r)}`)
        setDistance(0)
      } else {
        console.log('ship sinks')
        setDistance(0)
      }
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
      await contract.addShip().catch(console.error)
    }
    // const ship = { q: 3, r: 3 }
    // setShip(ship)
    console.log('Added ship')
    fetchShips()
  }

  async function fetchShips() {
    if (contract !== null) {
      const result = await contract.getShips()
      console.log(result)
    }
  }

  async function fetchData() {
    setCells([{q: 5, r: 5, island: true}, {q: 4, r: 4, island: false}])
    // if (contract !== null) {
    //   const center = { q: radius, r: radius }
    //   const cell = await contract.getCell(center)


    //   let tempCoords = await contract.getCells()
    //   let tempCells = tempCoords.map((c) => {
    //     return contract.getCell({q: Number(c.q), r: Number(c.r)})
    //   })

    //   Promise.all(tempCells).then((values) => {
    //     setCells([...values])
    //   }).catch(console.error)
    // }
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
            <HexGrid cells={cells} ship={ship} path={path} destination={destination}/>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
