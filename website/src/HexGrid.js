import React from 'react';
import Hexagon from './Hexagon';
import Ship from './Ship';
import PathCell from './PathCell';


const HexGrid = ({ cells, ship, path }) => {

  const hexagons = cells.map(({ q, r, island }) => {
    return <Hexagon key={`${q},${r}`} q={q} r={r} island={island} />
  })

  const pathCells = path.map(({q, r}) => {
    return <PathCell key={`path${q},${r}`} q={q} r={r} />
  })

  return (
    <svg viewBox="0 -100 1000 800" width="100%" height="100%">
      {hexagons}
      {Object.keys(ship).length !== 0 && <Ship key={`ship${ship.q},${ship.r}`} q={ship.q} r={ship.r} /> }
      {pathCells}
    </svg>
  )

}

export default HexGrid;
