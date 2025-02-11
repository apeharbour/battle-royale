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
import { Hex, HexUtils, GridGenerator } from "react-hexgrid";
import ShipStatus from "./ShipStatus";
import Logs from "./Logs";
import GameInfo from "./GameInfo";
import GameAbi from "./abis/Gameyarts.json";

import MainBoardArea from "./MainBoardArea.jsx";
import Timer from "./Timer.jsx";
import CommitMoveButton from "./CommitMoveButton.jsx";
import GameStatus from "./GameStatus.jsx";
import GameStatuss from "./GameStatuss.jsx";
import LastRoundResults from "./LastRoundResults.jsx";

const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const GAME_ABI = GameAbi.abi;

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
        tokenId
        image
        killedInRound {
          round
        }
      }
    }
  }
`;

export default function Game(props) {
  const { pathname } = useLocation();
  const id = parseInt(pathname.split("/")[1]);
  const [contract, setContract] = useState(null);
  const [gamePlayer, setGamePlayer] = useState(null);
  const [playerStateDialogOpen, setPlayerStateDialogOpen] = useState(false);
  const [travelEndpoint, setTravelEndpoint] = useState(undefined);
  const [shotEndpoint, setShotEndpoint] = useState(undefined);
  const [showCoordinateField, setShowCoordinateField] = useState(false);
  const [tempTravelEndpoint, setTempTravelEndpoint] = useState(undefined);
  const [tempShotEndpoint, setTempShotEndpoint] = useState(undefined);
  // const [randomInt, setRandomInt] = useState(generateRandomInt());

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

  const enrichShip = (ship, movesLastRound, address, currentRound) => {
    const move = movesLastRound.find((m) => m.player.address === ship.address);
  
    let travel = {};
    let shot = {};
  
    // 1) Check if active
    const isActive = !ship.killedInRound && ship.state === "active";
    
    // 2) Determine final "state" for our front-end
    let shipState;
    if (isActive) {
      shipState = "active";
    } else if (ship.state === "won") {
      // If the subgraph says they've won, we want to preserve that
      shipState = "won";
    } else {
      // Otherwise, they're destroyed or some other final state
      shipState = "destroyed";
    }
  
    // If there's a travel move, set travel origin/destination
    if (move && move.travel) {
      travel.origin = new Hex(
        move.travel.originQ,
        move.travel.originR,
        -move.travel.originQ - move.travel.originR
      );
      travel.destination = new Hex(
        move.travel.destinationQ,
        move.travel.destinationR,
        -move.travel.destinationQ - move.travel.destinationR
      );
    }
  
    // If there's a shot move, set shot origin/destination
    if (move && move.shot) {
      shot.origin = new Hex(
        move.shot.originQ,
        move.shot.originR,
        -move.shot.originQ - move.shot.originR
      );
      shot.destination = new Hex(
        move.shot.destinationQ,
        move.shot.destinationR,
        -move.shot.destinationQ - move.shot.destinationR
      );
    }
  
    // Calculate the “s” cube coordinate
    const s = -ship.q - ship.r;
  
    // Determine if this is my ship
    const mine = address
      ? ship.address.toLowerCase() === address.toLowerCase()
      : false;
  
    // Return our enriched ship object
    return {
      ...ship,
      s,
      travel,
      shot,
      mine,
      state: shipState,
    };
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
      const currentRound = parseInt(data.games[0].currentRound.round);
      const gameState = data.games[0].state;
  
      // We'll figure out which round's "moves" we want to animate
      // Normal case: we animate the "previous round" if the game is still ongoing
      let roundToAnimate = currentRound > 1 ? currentRound - 1 : currentRound;
  
      // If the game is finished, we want to animate the final round itself
      if (gameState === "finished") {
        roundToAnimate = currentRound;
      }
  
      // Grab whichever round we decided to animate
      const theRound = data.games[0].rounds.find(
        (r) => parseInt(r.round) === roundToAnimate
      );
  
      let movesForAnimation = [];
      if (theRound) {
        movesForAnimation = theRound.moves;
      }
  
      return data.games[0].players
        .map((player) =>
          enrichShip(player, movesForAnimation, address, currentRound)
        )
        .filter((ship) => ship !== null);
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

  const useCells2 = () => useGameQuery((data) => data.games[0].cells);

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
  const { data: cells2 } = useCells2();

  // console.log("Game ID: ", id);
  // console.log("Subgraph URL: ", import.meta.env.VITE_SUBGRAPH_URL_GAME);
  // console.log("Current Round: ", currentRound);
  // console.log("Game Ships: ", ships);
  // console.log("My Ship: ", myShip);
  //console.log("Cells: ", cells);
  //console.log("Center: ", center);
  // console.log("Rounds: ", rounds);
  // console.log("Game Winner: ", winner);
  //console.log("Result: ", result);
  //console.log("Cells2: ", cells2);

  useEffect(() => {
    //console.log("Game State: ", gameState);
    if (gameState === "finished") {
      disableEventBridgeRule(gameId);
    }
  }, [gameState, gameId]);

  useEffect(() => {
    //console.log("Clearing endpoints for new round");
    setEndpoints({ travel: undefined, shot: undefined });
  }, [currentRound]);

  useEffect(() => {
    //console.log("Player State: ", playerState);
    if (
      playerState === "dropped" ||
      playerState === "beached" ||
      playerState === "crashed" ||
      playerState === "shot" ||
      playerState === "draw" ||
      playerState === "won"
    ) {
      setPlayerStateDialogOpen(true);
    }
  }, [playerState]);

  const clearTravelAndShotEndpoints = () => {
    setEndpoints({ travel: undefined, shot: undefined });
  };

  const disableEventBridgeRule = async (gameId) => {
    try {
      const response = await fetch(
        "https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/disableEventBridge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "battleroyale",
          },
          body: JSON.stringify({ gameId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error calling the API:", error.message);
    }
  };

  return (
    <Fragment>
      <Grid container spacing={2} p={4}>
        <Grid item xs={12} sm={4} md={2}>
          <Stack spacing={2}>
            <ShipStatus ship={myShip} />
            <Logs gameId={id} rounds={rounds} />
            <LastRoundResults rounds={rounds} />
          </Stack>
        </Grid>

        {cells && (
          <MainBoardArea
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
            gameState={gameState}
          />
        )}

        <Grid item xs={12} sm={4} md={2}>
          {/* <Timer gameId={id}/> */}
          <Stack spacing={2}>
            <CommitMoveButton
              gameId={gameId}
              myShip={myShip}
              travelEndpoint={endpoints.travel}
              shotEndpoint={endpoints.shot}
              clearTravelAndShotEndpoints={clearTravelAndShotEndpoints}
              round={currentRound}
              setTempTravelEndpoint={setTempTravelEndpoint}
              setTempShotEndpoint={setTempShotEndpoint}
            />
            {/* <PlayerStatus ships={ships} /> */}
            <FormControlLabel
              control={
                <Switch
                  checked={showCoordinateField}
                  onChange={() => setShowCoordinateField(!showCoordinateField)}
                />
              }
              label={
                <Typography style={{ fontSize: "1.25rem" }}>
                  {showCoordinateField
                    ? "Hide Coordinates"
                    : "Show Coordinates"}
                </Typography>
              }
            />
            <Timer gameId={gameId} gameState={gameState} />
            <GameInfo
              round={currentRound}
              gameId={gameId}
              mapShrink={mapShrink}
              gameState={gameState}
            />
            {playerStateDialogOpen && (
            <GameStatuss
              winner={winner}
              playerState={playerState}
              setPlayerStateDialogOpen={setPlayerStateDialogOpen}
              gameId={gameId}
            />
          )}
          </Stack>
        </Grid>
      </Grid>
       {/* {playerStateDialogOpen && (
        <GameStatus
          playerStateDialogOpen={playerStateDialogOpen}
          winner={winner}
          playerState={playerState}
          setPlayerStateDialogOpen={setPlayerStateDialogOpen}
        />
      )}  */}
    </Fragment>
  );
}
