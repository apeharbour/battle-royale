import React, { useState, useEffect, Fragment } from "react";
import { ethers } from "ethers";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
// import { useQuery, gql } from "@apollo/client";
import { useQuery } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount } from "wagmi";

import { useLocation } from "react-router-dom";
import { Hex, HexUtils } from "react-hexgrid";
import timer from "./images/Timer.png";
import ShipStatus from "./ShipStatus";
import PlayerStatus from "./PlayerStatus";
import Logs from "./Logs";

import RegistrationPunkAbi from "./abis/RegistrationPunk.json";
import GameAbi from "./abis/GamePunk.json";
import PunkshipsAbi from "./abis/Punkships.json";

import Board from "./Board.jsx";
import MainBoardArea from "./MainBoardArea.jsx";
import Timer from "./Timer.jsx";

const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const PUNKSHIPS_ADDRESS = import.meta.env.VITE_PUNKSHIPS_ADDRESS;
const REGISTRATION_ABI = RegistrationPunkAbi.abi;
const GAME_ABI = GameAbi.abi;
const PUNKSHIPS_ABI = PunkshipsAbi.abi;

const CustomButton = styled(Button)({
  backgroundColor: "rgba(215, 227, 249, 0.5)",
  borderRadius: "20px",
  padding: "20px 70px",
  fontSize: "700",
  color: "black",
  "&:hover": {
    backgroundColor: "rgba(195, 208, 243, 0.5)",
  },
  "&.Mui-disabled": {
    cursor: "not-allowed",
  },
});

const GET_GAME = gql`
  query getGame($gameId: Int!, $first: Int, $skip: Int) {
    games(where: { gameId: $gameId }) {
      gameId
      state
      cells(first: $first, skip: $skip) {
        id
        q
        r
        island
      }
      players {
        address
        q
        r
        state
        kills
        range
        shotRange
        image
      }
      currentRound {
        round
      }
      rounds {
        round
        shrunk
        moves {
          player {
            address
          }
          originQ
          originR
          destinationQ
          destinationR
        }
        shots {
          player {
            address
          }
          originQ
          originR
          destinationQ
          destinationR
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
  const [cells, setCells] = useState([]);
  const [ships, setShips] = useState([]);
  const [myShip, setMyShip] = useState(undefined);
  const [randomInt, setRandomInt] = useState(generateRandomInt());

  const [travelEndpoint, setTravelEndpoint] = useState(undefined);
  const [shotEndpoint, setShotEndpoint] = useState(undefined);

  const gameId = id;

  const account = useAccount();

  const enrichCell = (cell, allCells) => {
    const s = (cell.q + cell.r) * -1;
    const state = cell.island ? "island" : "water";
    const highlighted = false;

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

    return { ...cell, s, state, highlighted, neighborCode };
  };

  const enrichShip = (ship) => {
    const s = (ship.q + ship.r) * -1;
    const mine = ship.address.toLowerCase() === account.address.toLowerCase();
    const newCell = { ...ship, s, mine };
    return newCell;
  };

  const updateData = (data) => {
    const { games } = data;
    const game = games[0];
    console.log("Ships: ", game.players);

    // process ships
    const ships = game.players.map(enrichShip);
    const myShip1 = ships.filter((s) => s.mine)[0];
    setMyShip(myShip1);
    setShips([...ships]);
    console.log("My Ship: ", myShip1);

    // process cells
    const cells = game.cells.map((c) => {
      return enrichCell(c, game.cells);
    });

    setCells([...cells]);
  };

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["game", id],
    queryFn: async () =>
      request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_GAME, {
        gameId: id,
      }),
  });

  useEffect(() => {
    console.log("Account: ", account.address, ", Data: ", data);
    if (!!account.address && data) {
      updateData(data);
    }
  }, [account.address, data]);

  //Helper Function to generate secret random number for hashing moves
  function generateRandomInt() {
    return Math.floor(Math.random() * 99) + 1;
  }

  //To store players moves in the dynamoDB
  const storePlayerMove = async ({
    gameId,
    playerAddress,
    moveHash,
    secretValue,
    travelDirection,
    travelDistance,
    shotDirection,
    shotDistance,
  }) => {
    const apiEndpoint =
      "https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/storePlayerMoves";
    const moveData = {
      gameId,
      playerAddress,
      moveHash,
      secretValue,
      travelDirection,
      travelDistance,
      shotDirection,
      shotDistance,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(moveData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Move stored successfully via API");
    } catch (error) {
      console.error("Error storing move via API", error);
    }
  };

  // const determineDirection = (deltaQ, deltaR) => {
  const determineDirection = (origin, destination) => {
    const deltaQ = destination.q - origin.q;
    const deltaR = destination.r - origin.r;

    // Normalize the deltas to -1, 0, or 1
    const sign = (num) => (num === 0 ? 0 : num > 0 ? 1 : -1);
    const normDeltaQ = sign(deltaQ);
    const normDeltaR = sign(deltaR);

    if (normDeltaQ === 1 && normDeltaR === 0) return 0;
    if (normDeltaQ === 1 && normDeltaR === -1) return 1;
    if (normDeltaQ === 0 && normDeltaR === -1) return 2;
    if (normDeltaQ === -1 && normDeltaR === 0) return 3;
    if (normDeltaQ === -1 && normDeltaR === 1) return 4;
    if (normDeltaQ === 0 && normDeltaR === 1) return 5;
    return 6;
  };

  const commitMoves = async () => {
    // calculate distances and directions
    const travelDistance = HexUtils.distance(myShip, travelEndpoint);
    const shotDistance = HexUtils.distance(travelEndpoint, shotEndpoint);

    const travelDirection = determineDirection(myShip, travelEndpoint);
    const shotDirection = determineDirection(travelEndpoint, shotEndpoint);

    console.log("Travel Direction: ", travelDirection);
    console.log("Travel Distance: ", travelDistance);
    console.log("Shot Direction: ", shotDirection);
    console.log("Shot Distance: ", shotDistance);

    setTravelEndpoint(undefined);
    setShotEndpoint(undefined);

    // if (contract) {
    //   setRandomInt(generateRandomInt());
    //   const moveHash = ethers.solidityPackedKeccak256(
    //     ["uint8", "uint8", "uint8", "uint8", "uint256"],
    //     [
    //       travelDirection,
    //       travelDistance,
    //       shotDirection,
    //       shotDistance,
    //       randomInt,
    //     ]
    //   );

    //   try {
    //     const tx = await contract
    //       .commitMove(moveHash, gameId)
    //       .catch(console.error);
    //     await tx.wait();
    //     console.log(tx);
    //     console.log(moveHash);

    //     await storePlayerMove({
    //       gameId,
    //       playerAddress: gamePlayer,
    //       moveHash,
    //       secretValue: randomInt,
    //       travelDirection,
    //       travelDistance,
    //       shotDirection,
    //       shotDistance,
    //     });
    //   } catch (error) {
    //     console.error(
    //       "Error in submitting moves or storing in DynamoDB",
    //       error
    //     );
    //   }
    //   const updatedCells = cells
    //     .map(clearHighlights)
    //     .map((cell) => highlightReachableCells(cell, myShip, myShip.range));
    //   setTravelEndpoint(undefined);
    //   setShotEndpoint(undefined);
    //   setCells([...updatedCells]);
    // }
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
      // Handle success response
    } catch (error) {
      console.error("Error calling the API:", error.message);
      // Handle error response
    }
  };

  // if (isFetching) return <p>Loading...</p>;
  if (isError) return <p>Error : {error.message}</p>;

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          {myShip && myShip.range && <ShipStatus ship={myShip} />}
          {data && <Logs gameData={data} gameId={id} /> } 
        </Grid>

        <MainBoardArea
          design={props.design}
          center={new Hex(5, 5, -5)}
          cells={cells}
          ships={ships}
          myShip={myShip}
          travelEndpoint={travelEndpoint}
          setTravelEndpoint={setTravelEndpoint}
          shotEndpoint={shotEndpoint}
          setShotEndpoint={setShotEndpoint}
        />

        <Grid item xs={3}>
          <Timer gameId={id}/>
          <Box mt={2} mb={2}>
            <CustomButton
              variant="contained"
              onClick={commitMoves}
              disabled={!shotEndpoint || !travelEndpoint}
            >
              Commit Moves
            </CustomButton>
          </Box>

          <PlayerStatus ships={ships} />
        </Grid>
      </Grid>

    </Fragment>
  );
}
