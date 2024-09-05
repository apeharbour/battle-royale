import React, { useState, useEffect, Fragment } from "react";
import {
  Grid,
  Stack,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount, useBlockNumber, useWatchContractEvent } from "wagmi";
import { useWebSocket } from "./contexts/WebSocketContext";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Hex, HexUtils, GridGenerator } from "react-hexgrid";
import Logs from "./Logs";
import GameInfo from "./GameInfo";
import GameAbi from "./abis/GamePunk.json";

import SpectateMainBoard from "./SpectateMainBoard.jsx";
import Timer from "./Timer.jsx";
import LastRoundResults from "./LastRoundResults.jsx";
import SpectatePlayers from "./SpectatePlayers.jsx";
import SpectateLeaderBoard from "./SpectateLeaderBoard.jsx";

const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const GAME_ABI = GameAbi.abi;

// const sdk = getBuiltGraphSDK()

const gameQuery = gql`
  query getGame($gameId: BigInt!, $first: Int) {
    games(where: { gameId: $gameId }) {
      gameId
      state
      radius
      mapShrink
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

export default function SpectateGame() {
  const { pathname } = useLocation();
  const id = parseInt(pathname.split("/")[2]);
  const [showCoordinateField, setShowCoordinateField] = useState(false);
  const [tempTravelEndpoint, setTempTravelEndpoint] = useState(undefined);
  const [tempShotEndpoint, setTempShotEndpoint] = useState(undefined);

  const [endpoints, setEndpoints] = useState({
    travel: undefined,
    shot: undefined,
  });

  const gameId = id;

  const { ws } = useWebSocket();
  const queryClient = useQueryClient();

  const { address } = useAccount();

  const { data: blockNumber } = useBlockNumber({ watch: true });
  useEffect(() => {
    queryClient.invalidateQueries(["game", BigInt(id).toString()]);
  }, [blockNumber]);

  useWatchContractEvent({
    abi: GAME_ABI,
    address: GAME_ADDRESS,
    eventName: "MoveCommitted",
    onLogs: async (logs) => {
      const { gameId, player, moveHash } = logs[0].args;
      console.log(
        "MoveCommitted, GameId: ",
        gameId,
        "Player: ",
        player,
        "MoveHash: ",
        moveHash
      );
    },
  });

  useWatchContractEvent({
    abi: GAME_ABI,
    address: GAME_ADDRESS,
    eventName: "WorldUpdated",
    onLogs: async (logs) => {
      console.log("World Updated: ", logs);
      const { gameId } = logs[0].args;
      console.log("World updated for game: ", gameId);
    },
  });

  useEffect(() => {
    if (ws && gameId) {
      const message = {
        action: "setGameId",
        gameId: gameId,
      };
      ws.send(JSON.stringify(message));
    }
  }, [ws, gameId]);

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
  const enrichCell = (cell, allCells, currentRound) => {
    const s = (cell.q + cell.r) * -1;
    const state = cell.island ? "island" : "water";
    const highlighted = false;
    const deletedThisRound =
      cell.deletedInRound &&
      parseInt(cell.deletedInRound.round) === currentRound - 1;
    const deletedPreviously =
      cell.deletedInRound &&
      parseInt(cell.deletedInRound.round) < currentRound - 1;

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
      highlighted,
      deletedThisRound,
      deletedPreviously,
      neighborCode,
    };
  };

  const enrichShip = (ship, movesLastRound) => {
    const move = movesLastRound.filter(
      (m) => m.player.address === ship.address
    )[0];

    let travel = {};
    let shot = {};

    // Only populate travel and shot if the ship is active
    if (ship.state === "active") {
      if (move && move.travel) {
        travel.origin = new Hex(
          move.travel.originQ,
          move.travel.originR,
          (move.travel.originQ + move.travel.originR) * -1
        );
        travel.destination = new Hex(
          move.travel.destinationQ,
          move.travel.destinationR,
          (move.travel.destinationQ + move.travel.destinationR) * -1
        );
      }

      if (move && move.shot) {
        shot.origin = new Hex(
          move.shot.originQ,
          move.shot.originR,
          (move.shot.originQ + move.shot.originR) * -1
        );
        shot.destination = new Hex(
          move.shot.destinationQ,
          move.shot.destinationR,
          (move.shot.destinationQ + move.shot.destinationR) * -1
        );
      }
    } else {
      // If the ship is not active, set travel and shot to null or empty objects
      travel = null;
      shot = null;
    }

    const s = (ship.q + ship.r) * -1;
    const mine = !!address
      ? ship.address.toLowerCase() === address.toLowerCase()
      : false;
    const newCell = { ...ship, s, travel, shot, mine };

    return newCell;
  };

  const useGameQuery = (select) =>
    useQuery({
      queryKey: ["game", BigInt(id).toString()],
      queryFn: async () =>
        request(import.meta.env.VITE_SUBGRAPH_URL_GAME, gameQuery, {
          gameId: id,
          first: 1000,
        }),
      select,
    });

  const useCurrentRound = () =>
    useGameQuery((data) => parseInt(data.games[0].currentRound.round));

  const useShips = () =>
    useGameQuery((data) => {
      let movesLastRound = [];
      const currentRound = parseInt(data.games[0].currentRound.round);
      if (currentRound > 1) {
        movesLastRound = data.games[0].rounds.filter(
          (r) => parseInt(r.round) === currentRound - 1
        )[0].moves;
      }
      return data.games[0].players.map((s) => enrichShip(s, movesLastRound));
    });

  const useMyShip = (address) =>
    useGameQuery(
      (data) =>
        data.games[0].players.filter(
          (s) => s.address.toLowerCase() === address.toLowerCase()
        )[0]
    );

  // const useCells = () => useGameQuery((data) => addWaterCells(data.games[0].cells, data.games[0].centerQ).map((c) => enrichCell(c, data.games[0].cells, parseInt(data.games[0].currentRound.round))));
  const useCells = () =>
    useGameQuery((data) =>
      data.games[0].cells.map((c) =>
        enrichCell(
          c,
          data.games[0].cells,
          parseInt(data.games[0].currentRound.round)
        )
      )
    );

  const useRounds = () => useGameQuery((data) => data.games[0].rounds);

  const useMapShrink = () => useGameQuery((data) => data.games[0].mapShrink);

  const useGameState = () => useGameQuery((data) => data.games[0].state);

  const usePlayerState = (address) =>
    useGameQuery((data) => {
      const player = data.games[0].players.find(
        (p) => p.address.toLowerCase() === address.toLowerCase()
      );
      return player ? player.state : null;
    });
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

  const { data: currentRound } = useCurrentRound();
  const { data: ships } = useShips();
  const { data: myShip } = useMyShip(address);
  const { data: cells } = useCells();
  const { data: rounds } = useRounds();
  const { data: mapShrink } = useMapShrink();
  const { data: gameState } = useGameState();
  const { data: playerState } = usePlayerState(address);
  const { data: winner } = useWinner();
  const { data: center } = useCenter();

  useEffect(() => {
    //console.log("Clearing endpoints for new round");
    setEndpoints({ travel: undefined, shot: undefined });
  }, [currentRound]);

  const clearTravelAndShotEndpoints = () => {
    setEndpoints({ travel: undefined, shot: undefined });
  };

  return (
    <Fragment>
      <Grid mt={1}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Spectator Mode
        </Typography>
      </Grid>
      <Grid container spacing={2} p={4}>
        <Grid item xs={12} sm={4} md={2}>
          <Stack spacing={2}>
            <SpectatePlayers ships={ships} />
            <Logs gameId={id} rounds={rounds} />
            <LastRoundResults rounds={rounds} />
          </Stack>
        </Grid>

        {cells && (
          <SpectateMainBoard
            center={center}
            cells={cells}
            ships={ships}
            myShip={myShip}
            endpoints={endpoints}
            setEndpoints={setEndpoints}
            showCoordinateField={showCoordinateField}
            setTempTravelEndpoint={setTempTravelEndpoint}
            setTempShotEndpoint={setTempShotEndpoint}
            tempShotEndpoint={tempShotEndpoint}
            tempTravelEndpoint={tempTravelEndpoint}
            round={currentRound}
          />
        )}

        <Grid item xs={12} sm={4} md={2}>
          <Stack spacing={2}>
            <Timer gameId={gameId} />
            <GameInfo
              round={currentRound}
              gameId={gameId}
              mapShrink={mapShrink}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showCoordinateField}
                  onChange={() => setShowCoordinateField(!showCoordinateField)}
                />
              }
              label={
                showCoordinateField ? "Hide Coordinates" : "Show Coordinates"
              }
            />
          </Stack>
        </Grid>
      </Grid>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={8} ml={5} mr={5} mb={5}>
        <SpectateLeaderBoard ships={ships} />
        </Grid>
      </Grid>
    </Fragment>
  );
}
