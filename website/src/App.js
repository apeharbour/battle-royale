import React from 'react'
import { ethers } from 'ethers'
import logo from './logo.svg'
import './App.css'
import { Container, Typography } from '@mui/material'
import HexGrid from './HexGrid'
import MapAbi from './abis/Map.json'

const CONTRACT_ADDRESS = '0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9'
const CONTRACT_ABI = MapAbi.abi

function App() {
  const [cells, setCells] = React.useState([])
  const [radius, setRadius] = React.useState(0)

  React.useEffect(() => {
    async function fetchData() {
      // Connect to the Ethereum network and get a reference to the contract
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider,
      )

      const radius = Number(await contract.size())
      setRadius(radius)

      const cell = await contract.getCell(radius, radius)
      const { 0: q, 1: r, 2: island, 3: exists } = await contract.getCell(
        radius,
        radius,
      )

      let tempCells = [{ q: Number(q), r: Number(r), island, exists }]

      for (let i = 1; i <= radius; i++) {
        const ringCoords = await contract.ring({ q: radius, r: radius }, i)
        for (let j = 0; j < ringCoords.length; j++) {
          const { 0: q, 1: r, 2: island, 3: exists } = await contract.getCell(
            ringCoords[j].q,
            ringCoords[j].r,
          )
          tempCells.push({ q: Number(q), r: Number(r), island, exists })
        }
      }

      setCells([...tempCells])

      console.log('radius', radius)
      console.log(tempCells[0])
    }
    fetchData()

    // eslint-disable-next-line
  }, [])

  return (
    <Container>
      <Typography variant="h1">Battle Royale</Typography>
      <HexGrid cells={cells} />
    </Container>
  )
}

export default App
