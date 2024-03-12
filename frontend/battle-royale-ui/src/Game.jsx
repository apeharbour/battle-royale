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
import {
  Hex,
  HexGrid,
  HexUtils,
  Hexagon,
  Layout,
  Path,
  Pattern,
} from "react-hexgrid";
import Coordinates from "./Coordinates";
import { useLayoutContext } from "react-hexgrid/lib/Layout";
import GameAbi from "./abis/GamePunk.json";
import Timer from "./Timer";
import log from "./images/log.png";
import timer from "./images/Timer.png";
import ShipStatus from "./ShipStatus";
import PlayerStatus from "./PlayerStatus";
import Logs from "./Logs";
import Coordinates from "./Coordinates.jsx"


import RegistrationPunkAbi from "./abis/RegistrationPunk.json";
import GameAbi from "./abis/GamePunk.json";
import PunkshipsAbi from "./abis/Punkships.json";

import * as imagesClean from "./assets/tiles/clean/index.js";
import * as imagesPixel from "./assets/tiles/pixel/index.js";

import island99 from "./assets/tiles/clean/island99.png";
import Ship from "./Ship.jsx";
import Board from "./Board.jsx";

const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const PUNKSHIPS_ADDRESS = import.meta.env.VITE_PUNKSHIPS_ADDRESS;
const REGISTRATION_ABI = RegistrationPunkAbi.abi;
const GAME_ABI = GameAbi.abi;
const PUNKSHIPS_ABI = PunkshipsAbi.abi;

// const hexagonSize = { x: 5, y: 5 };
// const waterSize = { x: 4.33, y: 5 };
// const islandSize = { x: 4.33, y: 5 };
const hexagonSize = { x: 10, y: 10 };
const waterSize = { x: 8.67, y: 10 };
const islandSize = { x: 8.67, y: 10 };

const TRAVELLING = 0;
const SHOOTING = 1;
const DONE = 2;

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
    gameWinners {
      winner
      gameId
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
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const gameId = id;

  const account = useAccount();

  const enrichCell = (cell, allCells) => {
    const s = (cell.q + cell.r) * -1;
    const state = cell.island ? "island" : "water";
    const highlighted = false;

    // check if there are islands as neighbors, set island=false for non-existant cells
    const hex = new Hex(cell.q, cell.r, s);
    const neighbors = HexUtils.neighbors(hex).map((n) => {
        const sameCell = allCells.filter((c) => c.q === n.q && c.r === n.r)
        const isIsland = sameCell.length === 0 ? false : sameCell[0].island;
        return {...n, island: isIsland}
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
    const updatedCells = cells.map((c) =>
      highlightReachableCells(c, myShip1, myShip1.range)
    );
    console.log("Updated Cells: ", updatedCells);
    setCells([...updatedCells]);

    //set Game Round
    const lastGameRoundIndex = game.rounds.length - 1;
    const gameRound = game.rounds[lastGameRoundIndex].round;
    setCurrentGameRound(gameRound);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["game"],
    queryFn: async () =>
      request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_GAME, {
        gameId: id,
        first: 1000,
        skip: 0,
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

  const commitMoves = async (travelDirection, travelDistance, shotDirection, shotDistance) => {

    // calculate distances and directions
    // const travelDistance = HexUtils.distance(myShip, travelEndpoint);
    // const shotDistance = HexUtils.distance(travelEndpoint, shotEndpoint);

    // let qTravel = travelEndpoint.q - myShip.q;
    // let rTravel = travelEndpoint.r - myShip.r;
    // let travelDirection = determineDirection(qTravel, rTravel);

    // let qShot = shotEndpoint.q - travelEndpoint.q;
    // let rShot = shotEndpoint.r - travelEndpoint.r;
    // let shotDirection = determineDirection(qShot, rShot);

    console.log("Travel Direction: ", travelDirection);
    console.log("Travel Distance: ", travelDistance);
    console.log("Shot Direction: ", shotDirection);
    console.log("Shot Distance: ", shotDistance);

    if (contract) {
      setRandomInt(generateRandomInt());
      const moveHash = ethers.solidityPackedKeccak256(
        ["uint8", "uint8", "uint8", "uint8", "uint256"],
        [
          travelDirection,
          travelDistance,
          shotDirection,
          shotDistance,
          randomInt,
        ]
      );

      try {
        const tx = await contract
          .commitMove(moveHash, gameId)
          .catch(console.error);
        await tx.wait();
        console.log(tx);
        console.log(moveHash);

        await storePlayerMove({
          gameId,
          playerAddress: gamePlayer,
          moveHash,
          secretValue: randomInt,
          travelDirection,
          travelDistance,
          shotDirection,
          shotDistance,
        });
      } catch (error) {
        console.error(
          "Error in submitting moves or storing in DynamoDB",
          error
        );
      }
      const updatedCells = cells
        .map(clearHighlights)
        .map((cell) => highlightReachableCells(cell, myShip, myShip.range));
      setTravelEndpoint(undefined);
      setShotEndpoint(undefined);
      setCells([...updatedCells]);
      setState(TRAVELLING);
      setShowSubmitButton(false);
    }
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Fragment>
      <Grid container spacing={2}>


        <Grid item xs={3}>
          {myShip && myShip.range && <ShipStatus ship={myShip} />}
          <Logs gameData={data} gameId={id} />
        </Grid>

        <Grid item xs={6} sx={{border: "1px solid yellow"}}>
          <Board design={props.design} center={new Hex(5, 5, -5)} cells={cells} ships={ships} myShip={myShip} canSubmit={showSubmitButton} setCanSubmit={setShowSubmitButton}/>
Ì        </Grid>
        <Grid item xs={3}>
          <Timer gameId={id}/>
          <Box mt={2} mb={2}>
            <CustomButton
              variant="contained"
              onClick={commitMoves}
              disabled={!showSubmitButton}
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
