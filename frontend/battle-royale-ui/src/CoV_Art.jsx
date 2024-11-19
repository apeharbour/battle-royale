import React, { useEffect, useRef, useState } from "react";
import { defineHex, Grid } from "honeycomb-grid";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.filter.js";
import { Typography } from "@mui/material";

export default function CoV_Art({ center, cells, ships, gameId, winner, cell2 }) {
  const svgRef = useRef(null);
  const [svgDataUrl, setSvgDataUrl] = useState(null);

  console.log("Cells:", cell2);

  // console.log("Here winner:", winner);

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
        .circle(0)
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

  //Idea 1 Simple grey for shoot and white for hit for loosers

  const drawStraightShipPathIdea1 = (draw, ships) => {
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

      // Check ship state and set stroke style
      if (ship.state === "won") {
        // Define a more prominent gradient for blue
        const gradient = draw.gradient("linear", (add) => {
          add.stop(0, "#0000FF"); // Dark blue
          add.stop(0.33, "#1E90FF"); // Dodger blue
          add.stop(0.66, "#87CEEB"); // Sky blue
          add.stop(1, "#E0FFFF"); // Light cyan
        });
        draw
          .path(pathStringStraight)
          .fill("none")
          .stroke({ color: gradient, width: 2 });
      } else {
        // Use solid grey for other states
        const strokeColor = "#808080";
        draw
          .path(pathStringStraight)
          .fill("none")
          .stroke({ color: strokeColor, width: 2 });
      }
    });
  };

  const drawSquigglyShipPathIdea1 = (draw, ships) => {
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

      // Check ship state and set stroke style
      if (ship.state === "won") {
        // Define a more prominent gradient for green
        const gradient = draw.gradient("linear", (add) => {
          add.stop(0, "#006400"); // Dark green
          add.stop(0.33, "#32CD32"); // Lime green
          add.stop(0.66, "#7FFF00"); // Chartreuse green
          add.stop(1, "#ADFF2F"); // Green yellow
        });
        draw
          .path(pathString)
          .fill("none")
          .stroke({ color: gradient, width: 5 });
      } else {
        // Use solid white for other states
        const strokeColor = "white";
        draw
          .path(pathString)
          .fill("none")
          .stroke({ color: strokeColor, width: 5 });
      }

      // Draw a circle at the control point
      draw
        .circle(0)
        .move(controlPoint.x - 2.5, controlPoint.y - 2.5)
        .fill("#ccc");
    });
  };

  const drawShipsIdea1 = (draw, ships) => {
    const baseSize = 20; // Starting size for ships killed in round 1
    const sizeIncrementPerRound = 10; // Size increment for each round survived
    const winnerExtraSize = 0; // Extra size for winners to ensure they are the largest

    // First, determine the maximum round number from the ships
    let maxRound = 0;
    ships.forEach((ship) => {
      if (ship.killedInRound && ship.killedInRound.round) {
        const roundKilled = parseInt(ship.killedInRound.round, 10);
        if (roundKilled > maxRound) {
          maxRound = roundKilled;
        }
      }
    });

    ships.forEach((ship) => {
      const hex = new CustomHex({ q: ship.q, r: ship.r });
      const { x, y } = hex;

      // Determine the size based on killedInRound data
      let size;
      if (ship.killedInRound && ship.killedInRound.round) {
        const roundKilled = parseInt(ship.killedInRound.round, 10);
        size = baseSize + (roundKilled - 1) * sizeIncrementPerRound;
      } else {
        size = baseSize + maxRound * sizeIncrementPerRound + winnerExtraSize; // Winners have the largest size
      }

      // Create the gradient based on state
      let gradient;
      switch (ship.state) {
        case "won":
          gradient = createGradient(draw, "lightblue", "blue");
          break;
        default:
          gradient = createGradient(draw, "lightgrey", "grey");
      }

      // Draw the circle with the radial gradient fill
      draw
        .circle(size)
        .move(x - size / 2, y - size / 2) // Center the circle
        .fill(gradient);
    });
  };

  //Idea 2 Simple grey for shoot and white for hit for loosers

  const drawStraightShipPathIdea2 = (draw, ships) => {
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

      const strokeColor = ship.state === "won" ? "blue" : "#808080";

      draw
        .path(pathStringStraight)
        .fill("none")
        .stroke({ color: strokeColor, width: 2 });
    });
  };

  const drawSquigglyShipPathIdea2 = (draw, ships) => {
    // Define 8 different gradient sets (feel free to tweak these colors)
    const gradients = [
      ["#FFD700", "#FFFF00", "#FFA500", "#FF0000"], // Gold -> Red
      ["#00FFFF", "#00FF80", "#00FF00", "#008000"], // Cyan -> Green
      ["#FF69B4", "#FF1493", "#FF4500", "#FF6347"], // Pink -> Orange-Red
      ["#8A2BE2", "#9370DB", "#BA55D3", "#FF00FF"], // Violet -> Magenta
      ["#00BFFF", "#1E90FF", "#4169E1", "#0000FF"], // Light Blue -> Blue
      ["#ADFF2F", "#7FFF00", "#32CD32", "#228B22"], // Lime -> Forest Green
      ["#FF8C00", "#FF7F50", "#FF6347", "#FF4500"], // Dark Orange -> Red-Orange
      ["#40E0D0", "#48D1CC", "#20B2AA", "#008B8B"], // Turquoise -> Teal
    ];

    ships.forEach((ship, index) => {
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

      // Assign the appropriate gradient based on the ship's index
      const gradientColors = gradients[index % gradients.length];

      // Create a gradient for each path
      const gradient = draw
        .gradient("linear", function (add) {
          add.stop(0, gradientColors[0]); // Start with first color
          add.stop(0.3, gradientColors[1]); // Transition to second color
          add.stop(0.6, gradientColors[2]); // Transition to third color
          add.stop(1, gradientColors[3]); // End with fourth color
        })
        .from(startPoint.x, startPoint.y)
        .to(endPoint.x, endPoint.y)
        .attr({ gradientUnits: "userSpaceOnUse" });

      // Apply the gradient to the path
      draw.path(pathString).fill("none").stroke({ color: gradient, width: 5 });

      // Draw a circle at the control point (optional)
      draw
        .circle(0)
        .move(controlPoint.x - 2.5, controlPoint.y - 2.5)
        .fill("#ccc");
    });
  };

  const drawShipsIdea2 = (draw, ships) => {
    const baseSize = 20; // Starting size for ships killed in round 1
    const sizeIncrementPerRound = 10; // Size increment for each round survived
    const winnerExtraSize = 0; // Extra size for winners to ensure they are the largest

    // First, determine the maximum round number from the ships
    let maxRound = 0;
    ships.forEach((ship) => {
      if (ship.killedInRound && ship.killedInRound.round) {
        const roundKilled = parseInt(ship.killedInRound.round, 10);
        if (roundKilled > maxRound) {
          maxRound = roundKilled;
        }
      }
    });

    ships.forEach((ship) => {
      const hex = new CustomHex({ q: ship.q, r: ship.r });
      const { x, y } = hex;

      // Determine the size based on killedInRound data
      let size;
      if (ship.killedInRound && ship.killedInRound.round) {
        const roundKilled = parseInt(ship.killedInRound.round, 10);
        size = baseSize + (roundKilled - 1) * sizeIncrementPerRound;
      } else {
        size = baseSize + maxRound * sizeIncrementPerRound + winnerExtraSize; // Winners have the largest size
      }

      // Create the gradient based on state
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

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.clear();
      svgRef.current.remove();
    }

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    cells.forEach((cell) => {
      const hex = new CustomHex({ q: cell.q, r: cell.r });
      hex.corners.forEach(({ x, y }) => {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      });
    });

    ships.forEach((ship) => {
      const hex = new CustomHex({ q: ship.q, r: ship.r });
      const { x, y } = hex;
      const size = ship.state === "won" ? 30 : 20;
      minX = Math.min(minX, x - size / 2);
      maxX = Math.max(maxX, x + size / 2);
      minY = Math.min(minY, y - size / 2);
      maxY = Math.max(maxY, y + size / 2);
    });

    const padding = 20;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const offsetX = (800 - contentWidth) / 2 - minX;
    const offsetY = (600 - contentHeight) / 2 - minY;

    // Create SVG with fixed size
    svgRef.current = SVG().addTo("#svgDrawing").size(800, 600).attr({
      style: "border: 5px solid #e5e8dc;",
      preserveAspectRatio: "xMidYMid meet",
    });

    const draw = svgRef.current;

    // Create a group and apply the translation
    const group = draw.group();
    group.translate(offsetX, offsetY);

    // Draw elements using the group
    //drawHexagons(group, cells);
    drawIslands(group, cells);
    drawStraightShipPathIdea1(group, ships);
    //drawStraightShipPath(group, ships);
    //drawSquigglyShipPathIdea1(group, ships);
    //drawShipsIdea1(group, ships);
    drawSquigglyShipPathIdea2(group, ships);
    drawShipsIdea2(group, ships);
    //drawShips(group, ships);



    // Get the SVG data as a string and create a downloadable link
    const svgString = svgRef.current.svg();
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    setSvgDataUrl(url); // Update the state to store the download link

    return () => {
      // Cleanup to revoke the object URL after the component is unmounted
      URL.revokeObjectURL(url);
    };
  }, [cells, ships, winner]);

  return (
    <>
      <div id="svgDrawing"></div>
      {svgDataUrl && (
        <a href={svgDataUrl} download="my-art.svg">
          Download SVG
        </a>
      )}
    </>
  );
}
