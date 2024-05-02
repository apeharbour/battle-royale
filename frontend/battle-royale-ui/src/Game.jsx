import React, { useState, useEffect, Fragment } from "react";
import { Grid, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
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

const registrationQuery = gql`

`;

export default function Game(props) {
  const { pathname } = useLocation();
  const id = parseInt(pathname.split("/")[1]);
  const [contract, setContract] = useState(null);
  const [gamePlayer, setGamePlayer] = useState(null);
  // const [randomInt, setRandomInt] = useState(generateRandomInt());

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
      // delay(5000).then(() => {
      //   console.log('Invalidating query because of world update');
      //   queryClient.invalidateQueries(["game", id]);
      // });
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

  const { data: result } = useGameQuery();

  const { data: currentRound } = useCurrentRound();
  const { data: ships } = useShips();
  const { data: myShip } = useMyShip(address);
  const { data: cells } = useCells();
  const { data: rounds } = useRounds();

  // console.log("Game ID: ", id);
  // console.log("Subgraph URL: ", import.meta.env.VITE_SUBGRAPH_URL_GAME);
  // console.log("Current Round: ", currentRound);
  // console.log("Ships: ", ships);
  // console.log("My Ship: ", myShip);
  // console.log("Cells: ", cells);
  // console.log("Rounds: ", rounds);

  // //Helper Function to generate secret random number for hashing moves
  // function generateRandomInt() {
  //   return Math.floor(Math.random() * 99) + 1;
  // }

  const clearTravelAndShotEndpoints = () => {
    setTravelEndpoint(undefined);
    setShotEndpoint(undefined);
  };

  // const determineDirection = (deltaQ, deltaR) => {
  // const determineDirection = (origin, destination) => {
  //   const deltaQ = destination.q - origin.q;
  //   const deltaR = destination.r - origin.r;

  //   // Normalize the deltas to -1, 0, or 1
  //   const sign = (num) => (num === 0 ? 0 : num > 0 ? 1 : -1);
  //   const normDeltaQ = sign(deltaQ);
  //   const normDeltaR = sign(deltaR);

  //   if (normDeltaQ === 1 && normDeltaR === 0) return 0;
  //   if (normDeltaQ === 1 && normDeltaR === -1) return 1;
  //   if (normDeltaQ === 0 && normDeltaR === -1) return 2;
  //   if (normDeltaQ === -1 && normDeltaR === 0) return 3;
  //   if (normDeltaQ === -1 && normDeltaR === 1) return 4;
  //   if (normDeltaQ === 0 && normDeltaR === 1) return 5;
  //   return 6;
  // };

  // const commitMove = async () => {

  //   if (!account.address) {
  //     console.error("Player address is undefined or not set");
  //     return; // Exit the function if gamePlayer is not set
  //   }

  //   // calculate distances and directions
  //   const myShipHex = new Hex(myShip.q, myShip.r, (myShip.q + myShip.r) * -1);
  //   const travelDistance = HexUtils.distance(myShipHex, travelEndpoint);
  //   const shotDistance = HexUtils.distance(travelEndpoint, shotEndpoint);

  //   const travelDirection = determineDirection(myShipHex, travelEndpoint);
  //   const shotDirection = determineDirection(travelEndpoint, shotEndpoint);

  //   setTravelEndpoint(undefined);
  //   setShotEndpoint(undefined);

  //   // if (contract) {
  //   //   setRandomInt(generateRandomInt());
  //   const randomInt = generateRandomInt();
  //   const moveHash = ethers.solidityPackedKeccak256(
  //     ["uint8", "uint8", "uint8", "uint8", "uint8", "address"],
  //     [
  //       travelDirection,
  //       travelDistance,
  //       shotDirection,
  //       shotDistance,
  //       randomInt,
  //       account.address,
  //     ]
  //   );

  //   console.log("Move Hash: ", moveHash);

  //   try {

  //   writeContract({
  //     abi: GAME_ABI,
  //     address: GAME_ADDRESS,
  //     functionName: "commitMove",
  //     args: [moveHash, BigInt(gameId)],
  //   });

  //         await storePlayerMove({
  //         gameId,
  //          playerAddress: account.address,
  //          moveHash,
  //          secretValue: randomInt,
  //          travelDirection,
  //          travelDistance,
  //          shotDirection,
  //          shotDistance,
  //        });
  //      } catch (error) {
  //        console.error(
  //          "Error in submitting moves or storing in DynamoDB",
  //          error
  //        );
  //      }
  //     };
  //   //   try {
  //   //     const tx = await contract
  //   //       .commitMove(moveHash, gameId)
  //   //       .catch(console.error);
  //   //     await tx.wait();
  //   //     console.log(tx);
  //   //     console.log(moveHash);

  //   //     await storePlayerMove({
  //   //       gameId,
  //   //       playerAddress: gamePlayer,
  //   //       moveHash,
  //   //       secretValue: randomInt,
  //   //       travelDirection,
  //   //       travelDistance,
  //   //       shotDirection,
  //   //       shotDistance,
  //   //     });
  //   //   } catch (error) {
  //   //     console.error(
  //   //       "Error in submitting moves or storing in DynamoDB",
  //   //       error
  //   //     );
  //   //   }
  //   //   const updatedCells = cells
  //   //     .map(clearHighlights)
  //   //     .map((cell) => highlightReachableCells(cell, myShip, myShip.range));
  //   //   setTravelEndpoint(undefined);
  //   //   setShotEndpoint(undefined);
  //   //   setCells([...updatedCells]);
  //   // }


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
      // Handle success response
    } catch (error) {
      console.error("Error calling the API:", error.message);
      // Handle error response
    }
  };

  // if (isFetching) enqueueSnackbar("Loading...", { variant: "info" });
  // if (isError)
  //   enqueueSnackbar("Error: " + JSON.stringify(error), { variant: "error" });
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
            <ShipStatus ship={myShip} />
            <Logs gameId={id} rounds={rounds} />
          </Stack>
        </Grid>

        {cells && <MainBoardArea
          center={new Hex(5, 5, -5)}
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
          {/* <Timer gameId={id}/> */}
          {/* <Box mt={2} mb={2}> */}
          <Stack spacing={2}>
            <CommitMoveButton gameId={gameId} myShip={myShip} travelEndpoint={travelEndpoint} shotEndpoint={shotEndpoint} clearTravelAndShotEndpoints={clearTravelAndShotEndpoints} />
            {/* <Button
              variant="contained"
              onClick={commitMove}
              disabled={!shotEndpoint || !travelEndpoint}
            >
              Commit Moves
            </Button> */}
            {/* </Box> */}

            <PlayerStatus ships={ships} />
            <Timer gameId={gameId} />
          </Stack>
        </Grid>
      </Grid>
    </Fragment>
  );
}
