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

const CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const CONTRACT_ABI = MapAbi.abi

function App() {
  const [cells, setCells] = React.useState([])
  const [ship, setShip] = React.useState({})
  const [path, setPath] = React.useState([])
  const [radius, setRadius] = React.useState(5)
  const [contract, setContract] = React.useState(null)
  const [provider, setProvider] = React.useState(null)
  const [direction, setDirection] = React.useState(0)
  const [distance, setDistance] = React.useState(0)

  React.useEffect(() => {
    const fetchContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
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

        setPath([...pathCells])

      }

    }

    fetchPath()

  }, [distance, direction])

  const initMap = async () => {
    console.log('Clicked init Map, using radius', radius)

    if (contract !== null) {
      const tx = await contract.initMap(radius)
      const receipt = await tx.wait()
      console.log(
        `Created map with radius ${Number(
          await contract.radius(),
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

  const getContractRadius = async () => {
    if (contract !== null) {
      const rad = Number(await contract.radius())
      console.log('Radius:', rad)
    }
  }

  const createIslands = async () => {
    if (contract !== null) {
      const tx = await contract.createIslands()
      await tx.wait()

      fetchData()
    }
  }

  const addShip = async () => {
    const ship = { q: 3, r: 3 }
    setShip(ship)
    console.log('Added ship')
  }

  async function fetchData() {
    if (contract !== null) {
      const center = { q: radius, r: radius }
      const cell = await contract.getCell(center)

      let tempCells = [
        {
          q: Number(cell.q),
          r: Number(cell.r),
          island: cell.island,
          exists: cell.exists,
        },
      ]

      for (let i = 1; i <= radius; i++) {
        const ringCoords = await contract.ring(center, i)
        for (let j = 0; j < ringCoords.length; j++) {
          const cellCoord = { q: ringCoords[j].q, r: ringCoords[j].r }
          const { q, r, island, exists } = await contract.getCell(cellCoord)
          tempCells.push({ q: Number(q), r: Number(r), island, exists })
        }
      }

      setCells([...tempCells])
      console.log(tempCells[0])
    }
  }

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h1">Battle Royale</Typography>
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
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={4}>
              <Typography variant="h5">Controls</Typography>
              <Button variant="outlined" onClick={createIslands}>
                Create Islands
              </Button>
              <Button variant="outlined" onClick={addShip}>
                Add Ship
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
                  <FormLabel id="demo-radio-buttons-group-label">
                    Direction
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={direction}
                    onChange={(event) => {
                      setDirection(event.target.value)
                    }}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="0" control={<Radio />} label="E" />
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="NE"
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="NW"
                    />
                    <FormControlLabel value="3" control={<Radio />} label="W" />
                    <FormControlLabel
                      value="4"
                      control={<Radio />}
                      label="SW"
                    />
                    <FormControlLabel
                      value="5"
                      control={<Radio />}
                      label="SE"
                    />
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

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <HexGrid cells={cells} ship={ship} path={path}/>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
