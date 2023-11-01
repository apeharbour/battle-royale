import React, { useEffect, useState } from 'react'
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

const HexGrid = ({ cells, ships, player, path, pathShots, destination, travelCell, shouldShowMovements, pathsData }) => {

  let pathWay = ''
  let pathShotWay = ''
  const [tempPaths, setTempPaths] = useState([])
  const [tempShots, setTempShots] = useState([])


  console.log(shouldShowMovements)
  useEffect(() => {
      if (shouldShowMovements) {
        const newTempPaths = [];
        const newTempShots = [];
    
        // Loop through all players' path data
        Object.keys(pathsData).forEach((playerAddress) => {
          const playerData = pathsData[playerAddress];
          
          // If the player has path data, process it
          if (playerData.path && playerData.path.length > 0) {
            const pathWithStartingPoint = [
              ...playerData.path.map(({ q, r }) => pointy_hex_to_pixel(q, r)),
            ];
            newTempPaths.push(pathWithStartingPoint);
          }
    
          // If the player has shot data, process it
          if (playerData.pathShots && playerData.pathShots.length > 0) {
            const shotsWithStartingPoint = [
              ...playerData.pathShots.map(({ q, r }) => pointy_hex_to_pixel(q, r)),
            ];
            newTempShots.push(shotsWithStartingPoint);
          }
        });
    
        setTempPaths(newTempPaths);
        setTempShots(newTempShots);
  
      // Set a timeout to hide the temporary paths and shots after 10 seconds
      const timeoutId = setTimeout(() => {
        setTempPaths([]);
        setTempShots([]);
      }, 10000); // 10000ms = 10s
  
      // Cleanup function to clear the timeout if the component unmounts before the timeout completes
      return () => clearTimeout(timeoutId);
    }
  }, [shouldShowMovements, pathsData, ships]);
  
  const pointsToString = points => points.map(point => {
    if (typeof point === 'object') {
      return `${point.x},${point.y}`;
    } else {
      return point; // for shipX and shipY, which are strings
    }
  }).join(' ');
  


  const hexagons = cells.map(({ q, r, island }) => {
    return <Hexagon key={`${q},${r}`} q={Number(q)} r={Number(r)} island={island} />
  })

  const shipsElements = ships.map(ship => {
    return <Ship key={`ship${ship.q},${ship.r}`} q={ship.q} r={ship.r} captain={ship.captain} player={player} />
  })

  const myShip = ships.filter(s => s.captain === player)[0]

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
      {shipsElements}
        {/* Render the temporary paths */}
{tempPaths.length > 0 &&
  tempPaths.map((path, index) => (
    <polyline
      key={index}
      points={pointsToString(path)}
      stroke="black" // same color as pathWay
      strokeWidth={2}
      markerEnd="url(#arrowheadMove)" // Reuse the existing arrowhead for movement paths
      fill="none"
    />
  ))}

{/* Render the temporary shots */}
{tempShots.length > 0 &&
  tempShots.map((shots, index) => (
    <polyline
      key={index}
      points={pointsToString(shots)}
      stroke="red" // same color as pathShotWay
      strokeWidth={2}
      markerEnd="url(#arrowheadShoot)" // Reuse the existing arrowhead for shot paths
      fill="none"
    />
  ))}
    
      {path.length > 0 && <polyline points={pathWay} stroke='black' strokeWidth={2} markerEnd='url(#arrowheadMove)' />}
      {pathShots.length > 0 && (
        <polyline points={pathShotWay} stroke='red' strokeWidth={2} markerEnd='url(#arrowheadShoot)' />
      )}
    </svg>
  )
}

export default HexGrid