import React, { useState, useEffect, Fragment } from "react";
import { Grid, Stack } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount, useBlockNumber, useWatchContractEvent, useWriteContract } from "wagmi";
// import { getBuiltGraphSDK } from '../.graphclient'
import { useWebSocket } from "./contexts/WebSocketContext";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Hex, HexUtils } from "react-hexgrid";
import ShipStatus from "./ShipStatus";
import PlayerStatus from "./PlayerStatus";
import Logs from "./Logs";
import RegistrationPunkAbi from "./abis/RegistrationPunk.json";
import GameAbi from "./abis/GamePunk.json";
import PunkshipsAbi from "./abis/Punkships.json";

import MainBoardArea from "./MainBoardArea.jsx";
import Timer from "./Timer.jsx";
import CommitMoveButton from "./CommitMoveButton.jsx";
import GameStatus from "./GameStatus.jsx";

const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const PUNKSHIPS_ADDRESS = import.meta.env.VITE_PUNKSHIPS_ADDRESS;
const REGISTRATION_ABI = RegistrationPunkAbi.abi;
const GAME_ABI = GameAbi.abi;
const PUNKSHIPS_ABI = PunkshipsAbi.abi;

// const sdk = getBuiltGraphSDK()

const gameQuery = gql`
query getGame($gameId: BigInt!, $first: Int, $skip: Int) {
    games(where: { gameId: $gameId }) {
      gameId
      state
      radius
      centerQ
      centerR
      currentRound { round }
      cells(first: $first, skip: $skip) {
        q
        r
        island
        deletedInRound { round }
  		}
  		rounds {
        round
        radius
        shrunk
        deletedCells { q r }
        moves { 
          player {address }
          round { round }
          commitment
          travel {originQ, originR, destinationQ, destinationR}
          shot {originQ, originR, destinationQ, destinationR}
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

  const gameId = id;

  const { ws } = useWebSocket();
  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  const { address } = useAccount();
 

  const delay = ms => new Promise(res => setTimeout(res, ms));

  const {
    writeContract,
    hash: txHash,
    isPending: txIsPending,
    error: txError,
    isError: txIsError,
    status: txStatus,
  } = useWriteContract();

  const { data: blockNumber } = useBlockNumber({ watch: true })
  useEffect(() => {
    queryClient.invalidateQueries(["game", BigInt(id).toString()]);
  }, [blockNumber]);

  useWatchContractEvent({
    abi: GAME_ABI,
    address: GAME_ADDRESS,
    eventName: "MoveCommitted",
    onLogs: async (logs) => {
      const { gameId, player, moveHash } = logs[0].args;
      console.log("MoveCommitted, GameId: ", gameId, "Player: ", player, "MoveHash: ", moveHash);
    }
  });

  useWatchContractEvent({
    abi: GAME_ABI,
    address: GAME_ADDRESS,
    eventName: "WorldUpdated",
    onLogs: async (logs) => {
      console.log("World Updated: ", logs);
      const { gameId } = logs[0].args;
      console.log("World updated for game: ", gameId);
    }
  });

  // useWatchBlockNumber( async (blockNumber) => {
  //   console.log("New block: ", blockNumber, "invalidating game query");
  //   queryClient.invalidateQueries(["game", BigInt(id).toString()]);
  // });

  useEffect(() => {
    if (ws && gameId) {
      const message = {
        action: 'setGameId',
        gameId: gameId,
      };
      ws.send(JSON.stringify(message));
    }
  }, [ws, gameId]);

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
    const move = movesLastRound.filter((m) => m.player.address === ship.address)[0];

    const travel = {}
    const shot = {}

    if (move && move.travel) {
      travel.origin = new Hex(move.travel.originQ, move.travel.originR, (move.travel.originQ + move.travel.originR) * -1);
      travel.destination = new Hex(move.travel.destinationQ, move.travel.destinationR, (move.travel.destinationQ + move.travel.destinationR) * -1);
    }

    if (move && move.shot) {
      shot.origin = new Hex(move.shot.originQ, move.shot.originR, (move.shot.originQ + move.shot.originR) * -1);
      shot.destination = new Hex(move.shot.destinationQ, move.shot.destinationR, (move.shot.destinationQ + move.shot.destinationR) * -1);
    }

    const s = (ship.q + ship.r) * -1;
    const mine = !!address ? ship.address.toLowerCase() === address.toLowerCase() : false;
    const newCell = { ...ship, s, travel, shot, mine };
    // const newCell = { ...ship, s, travel, shot };
    return newCell;
  };

  const useGameQuery = (select) => useQuery({
    queryKey: ["game", BigInt(id).toString()],
    queryFn: async () => request(import.meta.env.VITE_SUBGRAPH_URL_GAME, gameQuery, {
      gameId: id,
      first: 500,
      skip: 0,
    }),
    select,
  });

  const useCurrentRound = () => useGameQuery((data) => parseInt(data.games[0].currentRound.round))

  const useShips = () => useGameQuery((data) => {
    let movesLastRound = [];
    const currentRound = parseInt(data.games[0].currentRound.round)
    if (currentRound > 1) {
      movesLastRound = data.games[0].rounds.filter(r => parseInt(r.round) === currentRound - 1)[0].moves;
    }
    return data.games[0].players.map(s => enrichShip(s, movesLastRound));
  });

  const useMyShip = (address) => useGameQuery((data) => data.games[0].players.filter((s) => s.address.toLowerCase() === address.toLowerCase())[0]);

  const useCells = () => useGameQuery((data) => data.games[0].cells.map((c) => enrichCell(c, data.games[0].cells, parseInt(data.games[0].currentRound.round))));

  const useRounds = () => useGameQuery((data) => data.games[0].rounds);

  const useGameState = () => useGameQuery((data) => data.games[0].state);

  const usePlayerState = (address) => useGameQuery((data) => {
    const player = data.games[0].players.find((p) => p.address.toLowerCase() === address.toLowerCase());
    return player ? player.state : null;
  });
  const useCenter = () => useGameQuery((data) => new Hex(data.games[0].centerQ, data.games[0].centerR, (data.games[0].centerQ + data.games[0].centerR) * -1));

  const useWinner = () => useGameQuery((data) => data.games[0].players.find((p) => p.state === 'won'));

  const { data: result } = useGameQuery();

  const { data: currentRound } = useCurrentRound();
  const { data: ships } = useShips();
  const { data: myShip } = useMyShip(address);
  const { data: cells } = useCells();
  const { data: rounds } = useRounds();
  const { data: gameState } = useGameState();
  const { data: playerState } = usePlayerState(address);
  const { data: winner } = useWinner();
  const { data: center } = useCenter();

  // console.log("Game ID: ", id);
  // console.log("Subgraph URL: ", import.meta.env.VITE_SUBGRAPH_URL_GAME);
  // console.log("Current Round: ", currentRound);
  // console.log("Ships: ", ships);
  // console.log("My Ship: ", myShip);
  // console.log("Cells: ", cells);
  // console.log("Rounds: ", rounds);
  // console.log("Game Winner: ", winner);

  useEffect(() => {
    console.log("Game State: ", gameState);
    if (gameState === 'finished') {
      disableEventBridgeRule(gameId);
    }
  }, [gameState, gameId]);

  useEffect(() => {
    console.log("Player State: ", playerState);
    if (playerState === 'dropped' || playerState === 'beached' || playerState === 'crashed' || playerState === 'shot' || playerState === 'draw' || playerState === 'won') {
      setPlayerStateDialogOpen(true);
    }
  }, [playerState]);

  const clearTravelAndShotEndpoints = () => {
    setTravelEndpoint(undefined);
    setShotEndpoint(undefined);
  };

  const disableEventBridgeRule = async (gameId) => {
    try {
      const response = await fetch(
        "https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/disableEventBridge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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

  if (txIsPending)
    enqueueSnackbar("Transaction pending...", { variant: "info" });
  if (txIsError) {
    console.error("Error: ", JSON.stringify(txError))
    enqueueSnackbar("Error with tx.", { variant: "error" });
  }

  if (txStatus === "success")
    enqueueSnackbar("Transaction successful!", { variant: "success" });

  return (
    <Fragment>
      <Grid container spacing={2} p={4}>
        <Grid item xs={12} sm={4} md={2}>
          <Stack spacing={2}>
            <ShipStatus ship={myShip} gameId={id} state={gameState} round={currentRound}/>
            <Logs gameId={id} rounds={rounds}/>
          </Stack>
        </Grid>

        {cells && <MainBoardArea
          center={center}
          cells={cells}
          ships={ships}
          myShip={myShip}
          travelEndpoint={travelEndpoint}
          setTravelEndpoint={setTravelEndpoint}
          shotEndpoint={shotEndpoint}
          setShotEndpoint={setShotEndpoint}
        />
        }

        <Grid item xs={12} sm={4} md={2}>
          <Stack spacing={2}>
            <CommitMoveButton gameId={gameId} myShip={myShip} travelEndpoint={travelEndpoint} shotEndpoint={shotEndpoint} clearTravelAndShotEndpoints={clearTravelAndShotEndpoints} />
            <PlayerStatus ships={ships} />
            <Timer gameId={gameId} />
          </Stack>
        </Grid>
      </Grid>
      {playerStateDialogOpen && (
       <GameStatus playerStateDialogOpen={playerStateDialogOpen} winner={winner} playerState={playerState} />
      )}
    </Fragment>
  );
}
