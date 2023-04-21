import React from 'react'
import Hexagon from './Hexagon'
import Ship from './Ship'
import PathCell from './PathCell'

const HEX_SIZE = 20 // Size of each hexagon

const pointy_hex_to_pixel = (q, r) => {
  const x = HEX_SIZE * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r)
  const y = HEX_SIZE * ((3 / 2) * r)

  console.log(q, r, x, y)

  return { x, y }
}

const HexGrid = ({ cells, ship, path, destination }) => {
  const hexagons = cells.map(({ q, r, island }) => {
    return <Hexagon key={`${q},${r}`} q={Number(q)} r={Number(r)} island={island} />
  })

  const pathCells = path.map(({ q, r }) => {
    return <PathCell key={`path${q},${r}`} q={q} r={r} />
  })

  let pathWay = ''
  if (Object.keys(ship).length !== 0) {
    const { x: shipX, y: shipY } = pointy_hex_to_pixel(ship.q, ship.r)

    pathWay = `${shipX}, ${shipY} ${path
      .map(({ q, r }) => {
        const { x, y } = pointy_hex_to_pixel(q, r)
        return `${x}, ${y}`
      })
      .join(' ')}`
  }

  return (
    <svg viewBox="0 -100 1000 800" width="100%" height="100%">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <polyline points="0 0, 3 3, 0 6" fill='none' strokeWidth={1} stroke='red' />
        </marker>
      </defs>
      {hexagons}
      {Object.keys(ship).length !== 0 && (
        <Ship key={`ship${ship.q},${ship.r}`} q={ship.q} r={ship.r} />
      )}
      {/* {pathCells} */}
      {path.length > 0 && 
      <polyline
        points={pathWay}
        stroke="red"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
      />}
    </svg>
  )
}

export default HexGrid
