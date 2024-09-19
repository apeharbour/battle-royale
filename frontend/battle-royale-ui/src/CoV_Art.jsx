import React, { useEffect, useRef } from "react";
import { defineHex, Grid } from "honeycomb-grid";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.filter.js";
import { Typography } from "@mui/material";

const shortenAddress = (address) => {
  return `${address.slice(2, 6)}\n${address.slice(-4)}`;
};

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

  const drawShips = (draw, ships) => {
    ships.forEach((ship) => {
      const hex = new CustomHex({ q: ship.q, r: ship.r });
      const { x, y } = hex;

      // Determine the color based on the ship's state
      let color;
      if (ship.state === "won") {
        color = "blue";
      } else if (ship.state === "shot") {
        color = "red";
      } else if (ship.state === "dropped") {
        color = "yellow";
      } else {
        color = "pink"; // For any other state
      }

      let size;
      if (ship.state === "won") {
        size = 30;
      } else {
        size = 20;
      }

      draw
        .circle(size)
        .move(x - 5, y - 5)
        .fill(color);
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
          add.stop(1, "#FF0000"); // Red (changed to pure red)
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

  // const drawStraightShipShotPath = (draw, ships) => {
  //   ships.forEach((ship) => {
  //     const hexes = ship.shotLong.map(
  //       (cell) => new CustomHex({ q: cell.q, r: cell.r })
  //     );

  //     const pathStringStraight = hexes
  //       .map((hex, index) => {
  //         const { x, y } = hex;
  //         const prefix = index === 0 ? "M" : "L";
  //         return `${prefix} ${x} ${y}`;
  //       })
  //       .join(" ");

  //     draw
  //       .path(pathStringStraight)
  //       .fill("none")
  //       .stroke({ color: "#a7a7a7", width: 2 });
  //   });
  // };

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

  // const drawIslands = (draw, cells) => {
  //   // Define the gradient
  //   const gradient = draw.gradient("radial", function (add) {
  //     add.stop(0, "#00ffff"); // Cyan
  //     add.stop(0.5, "#ff00ff"); // Magenta
  //     add.stop(1, "#0000ff"); // Blue
  //   });

  //   // Animate the gradient colors (optional)
  //   gradient.stop(0).animate(3000).attr({ color: "#ff1493" }).loop(true);
  //   gradient.stop(1).animate(3000).attr({ color: "#ffa500" }).loop(true);

  //   // Animate the gradient rotation
  //   gradient.from(0.5, 0.5).to(0.5, 0.5);
  //   gradient.animate(5000).ease("<>").rotate(360).loop();

  //   // Define the glow filter inside drawIslands
  //   const glowFilter = draw.filter(function (add) {
  //     add.gaussianBlur(4); // Adjust for desired glow intensity
  //     add.blend(add.sourceAlpha, add.source, "normal");
  //   });

  //   cells.forEach((cell) => {
  //     const hex = new CustomHex({ q: cell.q, r: cell.r, s: cell.s });
  //     const { x, y } = hex;

  //     if (cell.island) {
  //       draw
  //         .circle(10)
  //         .move(x - 5, y - 5)
  //         .fill(gradient)
  //         .filterWith(glowFilter);
  //     }
  //   });
  // };


  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.clear();
      svgRef.current.remove();
    }

    svgRef.current = SVG().addTo("#svgDrawing").size(800, 600);
    const draw = svgRef.current;

    //drawHexagons(draw, cells);
    drawIslands(draw, cells);
    drawSquigglyShipPath(draw, ships);
    //drawStraightShipPath(draw, ships);
    drawStraightShipShotPath(draw, ships);
    drawShips(draw, ships, winner);
  }, [cells]);

  return (
    <>
      <div id="svgDrawing"></div>
    </>
  );
}
