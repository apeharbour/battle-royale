import React, { useEffect, useRef } from "react";
import { defineHex, Grid } from "honeycomb-grid";
import { SVG } from "@svgdotjs/svg.js";
import { Typography } from "@mui/material";

const shortenAddress = (address) => {
  return `${address.slice(2, 6)}\n${address.slice(-4)}`;
};

export default function CoV_Art({
  center,
  cells,
  ships,
  gameId,
}) {
  // const svgRef = useRef(null);

  // Create a hexagonal grid using honeycomb
  const CustomHex = defineHex({
    dimensions: 30, // size of each hexagon
    origin: "topLeft",
  });

  const shortenAddress = (address) => {
    return (
      address.substring(0, 6) +
      "..." +
      address.substring(address.length - 4, address.length)
    );
  };

  const drawShips = (draw, ships) => {
    ships.forEach((ship) => {
      const hex = new CustomHex({ q: ship.q, r: ship.r });
      const { x, y } = hex;
      draw
        .circle(10)
        .move(x - 5, y - 5)
        .fill("red");
    });
  };

  const drawSquigglyShipPath = (draw, ships) => {
    ships.forEach((ship) => {
      const hexes = ship.travelLong.map(
        (cell) => new CustomHex({ q: cell.q, r: cell.r})
      );

      const controlPoint = new CustomHex({
        q: hexes[1].q - 0.25,
        r: hexes[1].r - 0.25,
      });

      const pathString = hexes
        .map((hex, index) => {
          const { x, y } = hex;
          const prefix = index === 0 ? "M" : index === 1 ? `Q${controlPoint.x} ${controlPoint.y}` : "T";
          // const prefix = index === 0 ? `M ${x} ${y}` : "L";
          return `${prefix} ${x} ${y}`;
        })
        .join(" ");

      draw.path(pathString).fill("none").stroke({ color: "#ff0", width: 2 });
      draw.circle(5).move(controlPoint.x - 2.5, controlPoint.y - 2.5).fill("#ccc");
    });
  };

  const drawStraightShipPath = (draw, ships) => {
    ships.forEach((ship) => {
      const hexes = ship.travelLong.map(
        (cell) => new CustomHex({ q: cell.q, r: cell.r})
      );

      const pathStringStraight = hexes
        .map((hex, index) => {
          const { x, y } = hex;
          const prefix = index === 0 ? "M" : "L";
          return `${prefix} ${x} ${y}`;
        })
        .join(" ");

        draw.path(pathStringStraight).fill("none").stroke({ color: "#0f0", width: 2 });
    });
  };

  const drawHexagons = (draw, cells) => {
    cells.forEach((cell) => {
      const hex = new CustomHex({ q: cell.q, r: cell.r});

      // Draw the hexagon
      draw
        .polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
        .fill("none")
        .stroke({ color: "lightgray" });
    })
  };

  const drawIslands = (draw, cells) => {
    cells.forEach((cell) => {
      const hex = new CustomHex({ q: cell.q, r: cell.r, s: cell.s });

      // Get the pixel coordinates of the hexagon
      const { x, y } = hex;

      // If the cell is an island, draw a green dot in the center
      if (cell.island) {
        draw
          .circle(10)
          .move(x - 5, y - 5)
          .fill("green");
      }
    });
  }


  useEffect(() => {
    // if (!svgRef.current) return; // Make sure svgRef is available

    // Reference to the SVG container
    const draw = SVG().addTo("#svgDrawing").size(800, 600); // adjust size of the drawing area


    // drawHexagons(draw, cells);
    drawIslands(draw, cells);
    drawSquigglyShipPath(draw, ships);
    drawStraightShipPath(draw, ships);
    drawShips(draw, ships);
  }, [cells]);

  return (
    <>
    <div></div>
    </>
  );
}
