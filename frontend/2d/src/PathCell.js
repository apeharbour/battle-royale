import { yellow } from '@mui/material/colors';
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


const PathCell = ({ q, r }) => {

  const {x, y} = pointy_hex_to_pixel(q, r)

  const points = HEX_POINTS.map(([px, py]) => [
    x + HEX_SIZE * px,
    y + HEX_SIZE * py,
  ]).join(' ');

  return (
      <polygon points={points} fill='yellow' opacity='0.5' stroke='none'/>
    );
}

export default PathCell