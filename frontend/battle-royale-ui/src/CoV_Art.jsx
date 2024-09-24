import React, { useEffect, useRef } from "react";
import { defineHex, Grid } from "honeycomb-grid";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.filter.js";
import { Typography } from "@mui/material";

export default function CoV_Art({ center, cells, ships, gameId, winner }) {
  const svgRef = useRef(null);

  console.log("Here winner:", winner);

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

  const createGradient = (draw, colorStart, colorEnd) => {
    return draw
      .gradient("radial", (add) => {
        add.stop(0, colorStart); // Center color
        add.stop(1, colorEnd); // Edge color
      })
      .attr({
        cx: 0.5, // Center X at 50% of the bounding box
        cy: 0.5, // Center Y at 50% of the bounding box
        r: 0.5, // Radius at 50% of the bounding box
      });
  };

  const drawShips = (draw, ships) => {
    ships.forEach((ship) => {
      const hex = new CustomHex({ q: ship.q, r: ship.r });
      const { x, y } = hex;

      // Determine the size based on the ship's state
      const size = ship.state === "won" ? 30 : 20;

      // Create the gradient based on state without passing x, y, size
      let gradient;
      switch (ship.state) {
        case "won":
          gradient = createGradient(draw, "lightblue", "blue");
          break;
        case "shot":
          gradient = createGradient(draw, "lightcoral", "red");
          break;
        case "dropped":
          gradient = createGradient(draw, "lightyellow", "yellow");
          break;
        case "beached":
          gradient = createGradient(draw, "lightpurple", "purple");
          break;
        default:
          gradient = createGradient(draw, "lightpink", "pink");
      }

      // Draw the circle with the radial gradient fill
      draw
        .circle(size)
        .move(x - size / 2, y - size / 2) // Center the circle
        .fill(gradient);
    });
  };

  const drawSquigglyShipPath = (draw, ships) => {
    ships.forEach((ship) => {
      const hexes = ship.travelLong.map(
        (cell) => new CustomHex({ q: cell.q, r: cell.r })
      );

      const controlPoint = new CustomHex({
        q: hexes[1].q - 0.25,
        r: hexes[1].r - 0.25,
      });

      const pathString = hexes
        .map((hex, index) => {
          const { x, y } = hex;
          const prefix =
            index === 0
              ? "M"
              : index === 1
              ? `Q${controlPoint.x} ${controlPoint.y}`
              : "T";
          return `${prefix} ${x} ${y}`;
        })
        .join(" ");

      const startPoint = hexes[0];
      const endPoint = hexes[hexes.length - 1];

      // Create a gradient that ends with red
      const gradient = draw
        .gradient("linear", function (add) {
          add.stop(0, "#FFD700"); // Gold
          add.stop(0.3, "#FFFF00"); // Yellow
          add.stop(0.6, "#FFA500"); // Orange
          add.stop(1, "#FF0000"); // Red
        })
        .from(startPoint.x, startPoint.y)
        .to(endPoint.x, endPoint.y)
        .attr({ gradientUnits: "userSpaceOnUse" });

      draw.path(pathString).fill("none").stroke({ color: gradient, width: 5 });

      draw
        .circle(5)
        .move(controlPoint.x - 2.5, controlPoint.y - 2.5)
        .fill("#ccc");
    });
  };

  const drawStraightShipPath = (draw, ships) => {
    ships.forEach((ship) => {
      const hexes = ship.travelLong.map(
        (cell) => new CustomHex({ q: cell.q, r: cell.r })
      );

      const pathStringStraight = hexes
        .map((hex, index) => {
          const { x, y } = hex;
          const prefix = index === 0 ? "M" : "L";
          return `${prefix} ${x} ${y}`;
        })
        .join(" ");

      draw
        .path(pathStringStraight)
        .fill("none")
        .stroke({ color: "#0f0", width: 4 });
    });
  };

  const drawStraightShipShotPath = (draw, ships) => {
    ships.forEach((ship) => {
      const hexes = ship.shotLong.map(
        (cell) => new CustomHex({ q: cell.q, r: cell.r })
      );

      const pathStringStraight = hexes
        .map((hex, index) => {
          const { x, y } = hex;
          const prefix = index === 0 ? "M" : "L";
          return `${prefix} ${x} ${y}`;
        })
        .join(" ");

      // Calculate gradient direction based on the path's orientation
      const startPoint = hexes[0];
      const endPoint = hexes[hexes.length - 1];

      // Create a gradient representing the shot
      const gradient = draw
        .gradient("linear", function (add) {
          add.stop(0, "#00BFFF"); // DeepSkyBlue
          add.stop(0.5, "#1E90FF"); // DodgerBlue
          add.stop(1, "#FFFFFF"); // White
        })
        .from(startPoint.x, startPoint.y)
        .to(endPoint.x, endPoint.y)
        .attr({ gradientUnits: "userSpaceOnUse" });

      // Draw the path
      const path = draw
        .path(pathStringStraight)
        .fill("none")
        .stroke({ color: gradient, width: 2 }); // Increased width for visibility
    });
  };

  const drawHexagons = (draw, cells) => {
    cells.forEach((cell) => {
      const hex = new CustomHex({ q: cell.q, r: cell.r });

      // Draw the hexagon
      draw
        .polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
        .fill("none")
        .stroke({ color: "lightgray" });
    });
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
          .fill("#FFEFC2");
      }
    });
  };

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.clear();
      svgRef.current.remove();
    }

    svgRef.current = SVG().addTo("#svgDrawing").size(800, 600);
    const draw = svgRef.current;

    // Draw elements
    //drawHexagons(draw, cells);
    drawIslands(draw, cells);
    drawSquigglyShipPath(draw, ships);
    drawStraightShipShotPath(draw, ships);
    drawShips(draw, ships); // Gradients are created within drawShips
  }, [cells, ships, winner]); // Ensure all dependencies are included

  return (
    <>
      <div id="svgDrawing"></div>
    </>
  );
}
