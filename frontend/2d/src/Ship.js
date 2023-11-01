import React from 'react';

const HEX_SIZE = 20; // Size of each hexagon

const pointy_hex_to_pixel = (q, r) => {
    const x = HEX_SIZE * (Math.sqrt(3) * q  + Math.sqrt(3)/2 * r)
    const y = HEX_SIZE * (3/2 * r)

    return {x, y}
}


const Ship = React.memo(({ q, r, captain, player }) => {
  const {x, y} = pointy_hex_to_pixel(q, r)
  const color = captain === player ? 'green' : 'red'

  return (
    <g>
      <circle cx={x} cy={y} r='10' fill={color} opacity='0.5' />
    </g>
    );
})

export default Ship;
