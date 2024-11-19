import React, { useState, useEffect, Fragment } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import {
  useAccount,
  useBlockNumber,
  useWatchContractEvent,
  useWatchBlockNumber,
} from "wagmi";
import { useLocation, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Hex, HexUtils, GridGenerator } from "react-hexgrid";
import CoV_Art from "./CoV_Art";

import { useElementSize } from "@mantine/hooks";
import FinalArtSvg from "./FinalArtSvg";

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
          commitment
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

export default function CoV_Data(props) {
  const { gameId } = useParams();

  const queryClient = useQueryClient();

  /** Add water cells to the array
   * @param {Array} islands - Array of islands (coming from the subgraph)
   * @param {Number} radius - The radius of the game board
   * @returns {Array} - Array of cells
   * This function is currently not used. It's here for reference and will be useful
   * when we change the smart contract to track islands only. In that case, we will need
   * to generate the game board with water cells on the front end, based on radius and islands.
   */
  const addWaterCells = (islands, radius) => {
    const center = new Hex(radius, radius, -2 * radius);
    const generator = GridGenerator.getGenerator("ring");

    // generate the map with water only
    const waterCells = [center];
    for (let i = 1; i <= radius; i++) {
      const cells = generator(center, i);
      waterCells.push(...cells);
    }

    // check if a cell is an island and set the island property
    const cells = waterCells.map((cell) => {
      const island = islands.find((i) => i.q === cell.q && i.r === cell.r);
      const isIsland = !!island && island.island;
      return { ...cell, island: isIsland ? true : false };
    });
    return cells;
  };

  /* Enrich the cell data with additional properties:
   * s: the cube coordinate s
   * state: the state of the cell (water, island)
   * highlighted: whether the cell is highlighted
   * neighborCode: a 6 bit number where each bit represents a neighbor cell
   */
  const enrichCell = (cell, allCells) => {
    const s = (cell.q + cell.r) * -1;
    const state = cell.island ? "island" : "water";

    // check if there are islands as neighbors, set island=false for non-existant cells
    const hex = new Hex(cell.q, cell.r, s);
    const neighbors = HexUtils.neighbors(hex).map((n) => {
      const sameCell = allCells.filter((c) => c.q === n.q && c.r === n.r);
      const isIsland = sameCell.length === 0 ? false : sameCell[0].island;
      return { ...n, island: isIsland };
    });

    /* neigbor code is a 6 bit number where each bit represents a neighbor cell
     * The cells start at north east and then run counter clockwise
     * The codes are as follows:
     * 0b000001: East
     * 0b000010: North East
     * 0b000100: North West
     * 0b001000: West
     * 0b010000: South West
     * 0b100000: South East
     */
    const neighborCode = neighbors.reduce(
      (acc, c, i) => acc + (c.island ? Math.pow(2, i) : 0),
      0
    );

    return {
      ...cell,
      s,
      state,
      neighborCode,
    };
  };

  const enrichShip = (ship, moves) => {
    // const move = movesLastRound.filter((m) => m.player.address === ship.address)[0];

    // const travel = {}
    // const shot = {}

    // if (move && move.travel) {
    //   travel.origin = new Hex(move.travel.originQ, move.travel.originR, (move.travel.originQ + move.travel.originR) * -1);
    //   travel.destination = new Hex(move.travel.destinationQ, move.travel.destinationR, (move.travel.destinationQ + move.travel.destinationR) * -1);
    // }

    // if (move && move.shot) {
    //   shot.origin = new Hex(move.shot.originQ, move.shot.originR, (move.shot.originQ + move.shot.originR) * -1);
    //   shot.destination = new Hex(move.shot.destinationQ, move.shot.destinationR, (move.shot.destinationQ + move.shot.destinationR) * -1);
    // }

    const move = moves.filter(
      (m) => m.address.toLowerCase() === ship.address.toLowerCase()
    )[0];
    const { travels, shots, travelLong, shotLong } = move;

    const s = (ship.q + ship.r) * -1;
    const killed = !!ship.killedInRound;

    // const mine = !!address ? ship.address.toLowerCase() === address.toLowerCase() : false;
    // const newCell = { ...ship, s, travel, shot, mine };
    return { ...ship, killed, s, travels, shots, travelLong, shotLong };
  };

  const getPlayersMoves = (data) => {
    const playerMoves = {};

    data.games.forEach((game) => {
      game.rounds.forEach((round) => {
        round.moves.forEach((move) => {
          const playerAddress = move.player.address;

          // Initialize player moves, travels, shots, and shotLong for the first time
          if (!playerMoves[playerAddress]) {
            playerMoves[playerAddress] = {
              address: playerAddress,
              travels: [],
              travelLong: [
                new Hex(
                  move.travel.originQ,
                  move.travel.originR,
                  (move.travel.originQ + move.travel.originR) * -1
                ),
              ],
              shots: [],
              shotLong: [
                new Hex(
                  move.shot.originQ,
                  move.shot.originR,
                  (move.shot.originQ + move.shot.originR) * -1
                ),
              ],
            };
          }

          // Add travel information
          playerMoves[playerAddress].travelLong.push(
            new Hex(
              move.travel.destinationQ,
              move.travel.destinationR,
              (move.travel.destinationQ + move.travel.destinationR) * -1
            )
          );
          playerMoves[playerAddress].travels.push({
            round: round.round,
            from: new Hex(
              move.travel.originQ,
              move.travel.originR,
              (move.travel.originQ + move.travel.originR) * -1
            ),
            to: new Hex(
              move.travel.destinationQ,
              move.travel.destinationR,
              (move.travel.destinationQ + move.travel.destinationR) * -1
            ),
          });

          // Add shot information
          playerMoves[playerAddress].shotLong.push(
            new Hex(
              move.shot.destinationQ,
              move.shot.destinationR,
              (move.shot.destinationQ + move.shot.destinationR) * -1
            )
          );
          playerMoves[playerAddress].shots.push({
            round: round.round,
            from: new Hex(
              move.shot.originQ,
              move.shot.originR,
              (move.shot.originQ + move.shot.originR) * -1
            ),
            to: new Hex(
              move.shot.destinationQ,
              move.shot.destinationR,
              (move.shot.destinationQ + move.shot.destinationR) * -1
            ),
          });
        });
      });
    });

    return Object.values(playerMoves);
  };

  const useGameQuery = (select) =>
    useQuery({
      queryKey: ["game", BigInt(gameId).toString()],
      queryFn: async () =>
        request(import.meta.env.VITE_SUBGRAPH_URL_GAME, gameQuery, {
          gameId: gameId,
          first: 1000,
        }),
      select,
    });

  // const useCurrentRound = () => useGameQuery((data) => parseInt(data.games[0].currentRound.round))

  const useShips = () =>
    useGameQuery((data) => {
      // let movesLastRound = [];
      // const currentRound = parseInt(data.games[0].currentRound.round)
      // if (currentRound > 1) {
      //   movesLastRound = data.games[0].rounds.filter(r => parseInt(r.round) === currentRound - 1)[0].moves;
      // }
      const playersMoves = getPlayersMoves(data);
      return data.games[0].players.map((s) => enrichShip(s, playersMoves));
    });

  // const useMyShip = (address) => useGameQuery((data) => data.games[0].players.filter((s) => s.address.toLowerCase() === address.toLowerCase())[0]);

  const useCells = () =>
    useGameQuery((data) =>
      data.games[0].cells.map((c) => enrichCell(c, data.games[0].cells))
    );

  const useCell2 = () => useGameQuery((data) => data.games[0].cells);

  const useRounds = () => useGameQuery((data) => data.games[0].rounds);

  const useGameState = () => useGameQuery((data) => data.games[0].state);

  // const usePlayerState = (address) => useGameQuery((data) => {
  //   const player = data.games[0].players.find((p) => p.address.toLowerCase() === address.toLowerCase());
  //   return player ? player.state : null;
  // });
  const useCenter = () =>
    useGameQuery(
      (data) =>
        new Hex(
          data.games[0].centerQ,
          data.games[0].centerR,
          (data.games[0].centerQ + data.games[0].centerR) * -1
        )
    );

  const useWinner = () =>
    useGameQuery((data) =>
      data.games[0].players.find((p) => p.state === "won")
    );

  const { data: result } = useGameQuery();

  // const { data: currentRound } = useCurrentRound();
  const { data: ships } = useShips();
  // const { data: myShip } = useMyShip(address);
  const { data: cells } = useCells();
  const { data: cell2 } = useCell2();
  const { data: rounds } = useRounds();
  const { data: gameState } = useGameState();
  // const { data: playerState } = usePlayerState(address);
  const { data: winner } = useWinner();
  const { data: center } = useCenter();

  //console.log("Game ID: ", gameId);
  // console.log("Subgraph URL: ", import.meta.env.VITE_SUBGRAPH_URL_GAME);
  // console.log("Current Round: ", currentRound);
  // console.log("Ships: ", ships);
  // console.log("My Ship: ", myShip);
  //console.log("Cells: ", cells);
  //console.log("Ships: ", ships);
  // console.log("Rounds: ", rounds);
  // console.log("Game Winner: ", winner);
  // console.log("Center: ", center);
  //console.log("Result: ", result);

  const { ref, width, height } = useElementSize();
  //console.log("Width: ", width);
  //console.log("Height: ", height);
  //console.log("Ships", ships);

  return (
    <Fragment>
      <Grid container spacing={2} p={4}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Canvas Of Victory for Game #{gameId}
          </Typography>
          {/* <Typography variant="body" align="center">width: {width}, height: {height} </Typography> */}
        </Grid>
        <Grid
          item
          xs={12}
          ref={ref}
          id="svgDrawing"
          container
          justifyContent="center"
        >
          {cells && (
            <CoV_Art
              gameId={gameId}
              cells={cells}
              center={center}
              ships={ships}
              winner={winner}
              cell2={cell2}
            />
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
}
