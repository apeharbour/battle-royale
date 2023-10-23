import React from 'react'
import Hexagon from './Hexagon'
import Ship from './Ship'
import PathCell from './PathCell'

const HEX_SIZE = 20 // Size of each hexagon

const pointy_hex_to_pixel = (q, r) => {
  const x = HEX_SIZE * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r)
  const y = HEX_SIZE * ((3 / 2) * r)

  // console.log(q, r, x, y)

  return { x, y }
}

const HexGrid = ({ cells, ships, player, path, pathShots, destination, travelCell, shouldShowMovement, pathsData }) => {

  let pathWay = ''
  let pathShotWay = ''
  let renderPath = ''
  let renderShots = ''
  let renderShotPath = ''

  const hexagons = cells.map(({ q, r, island }) => {
    return <Hexagon key={`${q},${r}`} q={Number(q)} r={Number(r)} island={island} />
  })

  const shipsElements = ships.map(ship => {
    return <Ship key={`ship${ship.q},${ship.r}`} q={ship.q} r={ship.r} captain={ship.captain} player={player} />
  })

  const myShip = ships.filter(s => s.captain === player)[0]

  // console.log('myShip:', myShip)
  // console.log('ships', ships)
  // console.log('TravelCell', travelCell)

  const pathCells = path.map(({ q, r }) => {
    return <PathCell key={`path${q},${r}`} q={q} r={r} />
  })

  
  if (myShip !== undefined) {
    const { x: myShipX, y: myShipY } = pointy_hex_to_pixel(myShip.q, myShip.r)

    pathWay = `${myShipX}, ${myShipY} ${path
      .map(({ q, r }) => {
        const { x, y } = pointy_hex_to_pixel(q, r)
        return `${x}, ${y}`
      })
      .join(' ')}`
  }

  
  const startingPointForShot = travelCell || ships.filter(s => s.captain === player)[0]
  if (startingPointForShot !== undefined) {
    const { x: startingX, y: startingY } = pointy_hex_to_pixel(startingPointForShot.q, startingPointForShot.r)

    pathShotWay = `${startingX}, ${startingY} ${pathShots
      .map(({ q, r }) => {
        const { x, y } = pointy_hex_to_pixel(q, r)
        return `${x}, ${y}`
      })
      .join(' ')}`
  }

   // Render path
   if(shouldShowMovement === true){
    renderPath = pathWay && (
    <polyline 
      points={`${pointy_hex_to_pixel(myShip.q, myShip.r).x}, ${pointy_hex_to_pixel(myShip.q, myShip.r).y} ${pathWay}`} 
      stroke='black' 
      strokeWidth={2} 
      markerEnd='url(#arrowheadMove)'
    />
  )

  // Render shot path and shots
   renderShotPath = pathShotWay && (
    <polyline 
      points={`${pointy_hex_to_pixel(travelCell.q, travelCell.r).x}, ${pointy_hex_to_pixel(travelCell.q, travelCell.r).y} ${pathShotWay}`} 
      stroke='red' 
      strokeWidth={2} 
      markerEnd='url(#arrowheadShoot)'
    />
  )

   renderShots = shouldShowMovement && pathShots.map(({ q, r }, index) => (
    <circle 
      key={`shot${index}`} 
      cx={pointy_hex_to_pixel(q, r).x} 
      cy={pointy_hex_to_pixel(q, r).y} 
      r='5' 
      fill='black' 
    />
  ))
   }

  return (
    <svg viewBox='0 -100 1000 800' width='100%' height='100%'>
      <defs>
        <marker id='arrowheadMove' markerWidth='6' markerHeight='6' refX='3' refY='3' orient='auto'>
          <polyline points='0 0, 3 3, 0 6' fill='none' strokeWidth={1} stroke='black' />
        </marker>
        <marker id='arrowheadShoot' markerWidth='6' markerHeight='6' refX='3' refY='3' orient='auto'>
          <polyline points='0 0, 3 3, 0 6' fill='none' strokeWidth={1} stroke='red' />
        </marker>
        <pattern id='wavePattern' width='20' height='20' patternUnits='userSpaceOnUse'>
          <rect width='20' height='20' fill='#1E90FF' />
          <path d='M10 10 Q 15 0, 20 10 T 30 10' stroke='#ADD8E6' strokeWidth='2' fill='none'>
            <animateTransform
              attributeName='transform'
              type='translate'
              from='0'
              to='20'
              dur='8s'
              repeatCount='indefinite'
            />
          </path>
          <path d='M10 10 Q 5 20, 0 10 T -10 10' stroke='#ADD8E6' strokeWidth='2' fill='none'>
            <animateTransform
              attributeName='transform'
              type='translate'
              from='0'
              to='-20'
              dur='10s'
              repeatCount='indefinite'
            />
          </path>
        </pattern>
      </defs>
      {hexagons}
      {/* {Object.keys(ship).length !== 0 && (
        <Ship key={`ship${ship.q},${ship.r}`} q={ship.q} r={ship.r} />
      )} */}
      {shipsElements}
      {/* {pathCells} */}

      {shouldShowMovement && renderPath}
      {shouldShowMovement && renderShotPath}
      {shouldShowMovement && renderShots}

      {path.length > 0 && <polyline points={pathWay} stroke='black' strokeWidth={2} markerEnd='url(#arrowheadMove)' />}
      {pathShots.length > 0 && (
        <polyline points={pathShotWay} stroke='red' strokeWidth={2} markerEnd='url(#arrowheadShoot)' />
      )}
    </svg>
  )
}

export default HexGrid
