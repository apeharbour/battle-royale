import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { GraphQLClient, gql } from "graphql-request";
import fetch from "cross-fetch";
import { defineHex } from "honeycomb-grid";
import { createSVGWindow } from "svgdom";
import { SVG, registerWindow } from "@svgdotjs/svg.js";

const region = "eu-north-1";
const secretName = "SubgraphGame";
const secretsClient = new SecretsManagerClient({ region });

// Simple Hex class to mimic react-hexgrid's Hex
class Hex {
  constructor(q, r, s) {
    this.q = parseInt(q);
    this.r = parseInt(r);
    this.s = s !== undefined ? parseInt(s) : -this.q - this.r;
  }
}

// GraphQL query
const gameQuery = gql`
  query getGame($gameId: BigInt!, $first: Int) {
    games(where: { gameId: $gameId }) {
      gameId
      state
      radius
      centerQ
      centerR
      currentRound {
        round
      }
      cells(first: $first) {
        q
        r
        island
        deletedInRound {
          round
        }
      }
      rounds {
        round
        radius
        shrunk
        deletedCells {
          q
          r
        }
        moves {
          player {
            address
            state
            killedInRound {
              round
            }
          }
          round {
            round
          }
          travel {
            originQ
            originR
            destinationQ
            destinationR
          }
          shot {
            originQ
            originR
            destinationQ
            destinationR
          }
        }
      }
      players {
        address
        q
        r
        range
        shotRange
        state
        kills
        image
        killedInRound {
          round
        }
      }
    }
  }
`;

// Main Lambda handler function
export const handler = async function (event) {
  const { gameId } = JSON.parse(event.body);
  let subgraphURL;

  try {
    // Fetch the secret from AWS Secrets Manager
    const response = await secretsClient.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT",
      })
    );
    const secret = JSON.parse(response.SecretString);
    subgraphURL = secret.GameSubgraphUrl;

    // Create GraphQL client
    const graphQLClient = new GraphQLClient(subgraphURL, {
      headers: {
        "Content-Type": "application/json",
      },
      fetch, // Ensure fetch is used
    });

    const variables = {
      gameId: parseInt(gameId),
      first: 1000,
    };
    const data = await graphQLClient.request(gameQuery, variables);

    const game = data.games[0];
    const cells = game.cells;
    const winner = game.players.find((player) => player.state === "won");

    const playersMoves = getPlayersMoves(game);

    const enrichedShips = game.players.map((player) =>
      enrichShip(player, playersMoves)
    );

    console.log("Game data:", game);
    console.log("Cells:", cells);
    console.log("Winner:", winner);
    console.log("Enriched Ships:", enrichedShips);

    const svgContent = generateSVG(cells, enrichedShips, winner);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: svgContent,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
    };
  }
};

// Function to get player moves
const getPlayersMoves = (game) => {
  const playerMoves = {};

  game.rounds.forEach((round) => {
    round.moves.forEach((move) => {
      const playerAddress = move.player.address;

      // Initialize player moves, travels, shots, and shotLong for the first time
      if (!playerMoves[playerAddress]) {
        playerMoves[playerAddress] = {
          address: playerAddress,
          travels: [],
          travelLong: [],
          shots: [],
          shotLong: [],
        };

        // Initialize travelLong and shotLong with origin hexes
        if (move.travel) {
          const originHex = new Hex(
            move.travel.originQ,
            move.travel.originR
          );
          playerMoves[playerAddress].travelLong.push(originHex);
        }
        if (move.shot) {
          const originHex = new Hex(move.shot.originQ, move.shot.originR);
          playerMoves[playerAddress].shotLong.push(originHex);
        }
      }

      // Add travel information
      if (move.travel) {
        const originHex = new Hex(move.travel.originQ, move.travel.originR);
        const destinationHex = new Hex(
          move.travel.destinationQ,
          move.travel.destinationR
        );

        // Append destination to travelLong
        playerMoves[playerAddress].travelLong.push(destinationHex);
        playerMoves[playerAddress].travels.push({
          round: round.round,
          from: originHex,
          to: destinationHex,
        });
      }

      // Add shot information
      if (move.shot) {
        const originHex = new Hex(move.shot.originQ, move.shot.originR);
        const destinationHex = new Hex(
          move.shot.destinationQ,
          move.shot.destinationR
        );

        // Append destination to shotLong
        playerMoves[playerAddress].shotLong.push(destinationHex);
        playerMoves[playerAddress].shots.push({
          round: round.round,
          from: originHex,
          to: destinationHex,
        });
      }
    });
  });

  return Object.values(playerMoves);
};

// Function to enrich ship data
const enrichShip = (ship, moves) => {
  const move = moves.find(
    (m) => m.address.toLowerCase() === ship.address.toLowerCase()
  );

  const s = (ship.q + ship.r) * -1;
  const killed = !!ship.killedInRound;

  return {
    ...ship,
    killed,
    s,
    travels: move ? move.travels : [],
    shots: move ? move.shots : [],
    travelLong: move ? move.travelLong : [],
    shotLong: move ? move.shotLong : [],
  };
};

// Function to generate the SVG
const generateSVG = (cells, ships, winner) => {
  // Create window and document for SVG.js
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  // Create canvas
  const draw = SVG(document.documentElement)
    .size(800, 600)
    .attr({
      style: "border: 5px solid #e5e8dc;",
      preserveAspectRatio: "xMidYMid meet",
    });

  // Create a group and apply translation if needed
  const group = draw.group();

  // Define CustomHex
  const CustomHex = defineHex({
    dimensions: 30, // size of each hexagon
    origin: "topLeft",
  });

  // Compute minX, minY, maxX, maxY for the content
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

  // Apply translation to the group
  group.translate(offsetX, offsetY);

  // Define drawing functions
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

  const drawIslands = (draw, cells) => {
    cells.forEach((cell) => {
      const hex = new CustomHex({ q: cell.q, r: cell.r });

      // Get the pixel coordinates of the hexagon
      const { x, y } = hex;

      // If the cell is an island, draw a green dot in the center
      if (cell.island) {
        draw.circle(10).move(x - 5, y - 5).fill("#FFEFC2");
      }
    });
  };

  const drawStraightShipPathIdea1 = (draw, ships) => {
    ships.forEach((ship) => {
      const hexes = ship.shotLong.map(
        (cell) => new CustomHex({ q: cell.q, r: cell.r })
      );

      if (hexes.length < 2) return;

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

  const drawSquigglyShipPathIdea2 = (draw, ships) => {
    // Define 8 different gradient sets
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

      if (hexes.length < 2) return;

      const controlPoint = new CustomHex({
        q: hexes[1].q - 0.25,
        r: hexes[1].r - 0.25,
      });

      const pathString = hexes
        .map((hex, idx) => {
          const { x, y } = hex;
          const prefix =
            idx === 0
              ? "M"
              : idx === 1
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
      // draw
      //   .circle(0)
      //   .move(controlPoint.x - 2.5, controlPoint.y - 2.5)
      //   .fill("#ccc");
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
      draw.circle(size).move(x - size / 2, y - size / 2).fill(gradient);
    });
  };

  // Now call the drawing functions
  drawIslands(group, cells);
  drawStraightShipPathIdea1(group, ships);
  drawSquigglyShipPathIdea2(group, ships);
  drawShipsIdea2(group, ships);

  // Get the SVG content as a string
  const svgString = draw.svg();

  return svgString;
};
