import React from 'react';

const HEX_SIZE = 20; // Size of each hexagon
const HEX_RATIO = 0.866; // Ratio of height to width for hexagon

const HEX_POINTS = [
  [0, -1], [HEX_RATIO, -0.5], [HEX_RATIO, 0.5],
  [0, 1], [-HEX_RATIO, 0.5], [-HEX_RATIO, -0.5],
]; // Points for hexagon shape

const pointy_hex_to_pixel = (q, r) => {
    const x = HEX_SIZE * (Math.sqrt(3) * q  + Math.sqrt(3)/2 * r)
    const y = HEX_SIZE * (3/2 * r)
    return {x, y}
}


const Hexagon = ({ x, y, island }) => {
  const fillColor = island ? 'chocolate' : 'lightSkyBlue';
  const points = HEX_POINTS.map(([px, py]) => [
    x + HEX_SIZE * px,
    y + HEX_SIZE * py,
  ]).join(' ');
  return <polygon points={points} fill={fillColor} stroke='black' strokeWidth='0.5'/>;
};

const HexGrid = ({ cells }) => {
  const hexagons = cells.map(({ q, r, island }) => {

    // const x = HEX_SIZE * 3/2 * q;
    // const y = HEX_SIZE * HEX_RATIO * (r + q/2);
    const {x, y} = pointy_hex_to_pixel(q, r)
    return <Hexagon key={`${q},${r}`} x={x} y={y} island={island} />;
  });
  return (
    <svg viewBox="0 -100 1000 800" width="100%" height="100%">
      {hexagons}
    </svg>
  );
};

export default HexGrid;
