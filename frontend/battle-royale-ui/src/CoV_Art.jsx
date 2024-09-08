import React, { useEffect, useRef } from "react";
import { defineHex, Grid, } from "honeycomb-grid";
import { SVG } from "@svgdotjs/svg.js";

const shortenAddress = (address) => {
  return `${address.slice(2, 6)}\n${address.slice(-4)}`;
};

export default function CoV_Art({
  center,
  cells,
  ships,
  gameId,
  width,
  height,
}) {

  const svgRef = useRef(null);

  useEffect(() => {

    if (!svgRef.current) return; // Make sure svgRef is available

    console.log(svgRef);

    // Create a hexagonal grid using honeycomb
    const CustomHex = defineHex({
      dimensions: 30, // size of each hexagon
      origin: "topLeft",
    });

    // Reference to the SVG container
    const draw = SVG().addTo("body").size(800, 600); // adjust size of the drawing area

    // Draw each cell
    cells.forEach((cell) => {
      const hex = new CustomHex({ q: cell.q, r: cell.r, s: cell.s});

      // Get the pixel coordinates of the hexagon
      console.log(hex);
      const {x, y} = hex;
      
      // Draw the hexagon
      const hexagon = draw.polygon(hex.corners.map(({ x, y }) => `${x},${y}`)).fill("none").stroke({ color: '#ff0' });
      
      // If the cell is an island, draw a green dot in the center
      if (cell.island) {
        draw.circle(10).move(x - 5, y  - 5).fill('green');
      }
    });
  }, [cells]);

  return (
    <div ref={svgRef}></div>
  );  


}
