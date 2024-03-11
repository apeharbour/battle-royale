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

const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const PUNKSHIPS_ADDRESS = import.meta.env.VITE_PUNKSHIPS_ADDRESS;
const REGISTRATION_ABI = RegistrationPunkAbi.abi;
const GAME_ABI = GameAbi.abi;
const PUNKSHIPS_ABI = PunkshipsAbi.abi;

const hexagonSize = { x: 5, y: 5 };
const waterSize = { x: 4.33, y: 5 };
const islandSize = { x: 4.33, y: 5 };

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
  const [currentGameRound, setCurrentGameRound] = useState(0);
  const [travelEndpoint, setTravelEndpoint] = useState(undefined);
  const [shotEndpoint, setShotEndpoint] = useState(undefined);
  const [state, setState] = useState(TRAVELLING);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const gameId = id;

  // useEffect(() => {
  //   const fetchContract = async () => {
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const contract = new ethers.Contract(GAME_ADDRESS, GAME_ABI, signer);
  //     setContract(contract);
  //     setProvider(provider);
  //     setGamePlayer(signer.address);
  //     // console.log("Player address:", signer.address);
  //   };

  //   fetchContract();
  // }, []);

  const account = useAccount();
  const images = props.design === 0 ? imagesClean : imagesPixel;

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
    The codes are as follows:
    0b000001: East
    0b000010: North East
    0b000100: North West
    0b001000: West
    0b010000: South West
    0b100000: South East 
    */
    const neighborCode = neighbors.reduce(
      (acc, c, i) => acc + (c.island ? Math.pow(2, i) : 0),
      0
    );

    return { ...cell, s, state, highlighted, neighborCode };
  };

  const enrichShip = (ship) => {
    const s = (ship.q + ship.r) * -1;
    console.log(
      "Ship address:",
      ship.address,
      ", Account address:",
      account.address,
      ", Mine:",
      ship.address.toLowerCase() === account.address.toLowerCase()
    );
    console.log("Ship: ", ship);
    const mine = ship.address.toLowerCase() === account.address.toLowerCase();
    const newCell = { ...ship, s, mine };
    return newCell;
  };

  const highlightReachableCells = (destination, origin, distance) => {
    if (HexUtils.equals(origin, destination)) {
      destination.highlighted = true;
    }
    if (
      (origin.q === destination.q ||
        origin.r === destination.r ||
        origin.s === destination.s) &&
      HexUtils.distance(destination, origin) <= distance
    ) {
      destination.highlighted = true;
    }
    return destination;
  };

  const clearHighlights = (cell) => {
    cell.highlighted = false;
    return cell;
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

  // const { loading, error, data } = useQuery(GET_GAME, {
  //   pollInterval: 5000,
  //   variables: { gameId: id, first: 1000, skip: 0 },
  //   fetchPolicy: "network-only",
  //   onCompleted: (data) => {
  //     console.log("Data2:", data);
  //     updateData(data);
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //   },
  // });

  useEffect(() => {
    console.log("Account: ", account.address, ", Data: ", data);
    if (!!account.address && data) {
      updateData(data);
    }
  }, [account.address, data]);

  useEffect(() => {
    if (data) {
      const { gameWinners } = data;
      if (gameWinners.length > 0) {
        const gameWinner = gameWinners[0];
        const { gameId } = gameWinner;
        disableEventBridgeRule(gameId);
      }
    }
  }, [data]);

  const handleMouseEnter = (event, source) => {
    cells.forEach((cell) => {
      if (HexUtils.equals(source.state.hex, cell)) {
        // cell.highlighted = true;
        if (cell.highlighted) {
          if (state === TRAVELLING) {
            setTravelEndpoint(cell);
          } else if (state === SHOOTING) {
            setShotEndpoint(cell);
          }
        }
      }
    });
  };

  const handleMouseClick = (event, source) => {
    const selectedCell = cells.filter((c) =>
      HexUtils.equals(source.state.hex, c)
    )[0];

    if (state === DONE) {
      const updatedCells = cells
        .map(clearHighlights)
        .map((cell) => highlightReachableCells(cell, myShip, myShip.range));
      setTravelEndpoint(undefined);
      setShotEndpoint(undefined);
      setCells([...updatedCells]);
      setState(TRAVELLING);
      setShowSubmitButton(false);
    } else if (state === TRAVELLING && selectedCell.highlighted) {
      const updatedCells = cells
        .map(clearHighlights)
        .map((cell) =>
          highlightReachableCells(cell, travelEndpoint, myShip.shotRange)
        );
      setCells([...updatedCells]);
      setState(SHOOTING);
      setShowSubmitButton(false);
    } else if (state === SHOOTING && selectedCell.highlighted) {
      const updatedCells = cells.map(clearHighlights);
      setCells([...updatedCells]);
      setState(DONE);
      setShowSubmitButton(true);
    }
  };

  const handleMouseLeave = (event, source) => {
    const updatedCells = cells.map((cell) => {
      if (HexUtils.equals(source.state.hex, cell)) {
        cell.highlighted = false;
      }
      return cell;
    });

    setCells([...updatedCells]);
  };

  //To determine the distance between two cells
  const distance = (a, b) => {
    const q1 = a.q,
      r1 = a.r;
    const q2 = b.q,
      r2 = b.r;

    return (
      (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2
    );
  };

  //To determine the direction of the moves in the map
  const determineDirection = (deltaQ, deltaR) => {
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

  const commitMoves = async () => {
    let qTravel = travelEndpoint.q - myShip.q;
    let rTravel = travelEndpoint.r - myShip.r;
    let travelDirection = determineDirection(qTravel, rTravel);
    let travelDistance = distance(myShip, travelEndpoint);
    let qShot = shotEndpoint.q - travelEndpoint.q;
    let rShot = shotEndpoint.r - travelEndpoint.r;
    let shotDirection = determineDirection(qShot, rShot);
    let shotDistance = distance(travelEndpoint, shotEndpoint);

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

  const getFillPattern = (state, neighborCode) => {
    if (state === "island") {
      return `pat-island${neighborCode % 15}`;
      // return `pat-island99`;

    } else {
      return `pat-water${neighborCode}`;
    }
  };

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack spacing={4} direction={"row"} alignContent={"center"}>
            <Typography variant="h5">Game {id}</Typography>
            <Typography variant="h5">Round {currentGameRound}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          {myShip && myShip.range && <ShipStatus ship={myShip} />}

          <Logs gameData={data} gameId={id} />
        </Grid>
        <Grid item xs={6}>
          <HexGrid width={800} height={800} viewBox="18 -20 120 120">
            <defs>
              <marker
                id="arrowheadMove"
                markerWidth="4"
                markerHeight="4"
                refX="2"
                refY="2"
                orient="auto"
              >
                <polyline
                  points="0 0, 2 2, 0 4"
                  fill="none"
                  strokeWidth={1}
                  stroke="lightgray"
                />
              </marker>
              <marker
                id="arrowheadShoot"
                markerWidth="4"
                markerHeight="4"
                refX="2"
                refY="2"
                orient="auto"
              >
                <polyline
                  points="0 0, 2 2, 0 4"
                  fill="none"
                  strokeWidth={1}
                  stroke="lightgray"
                />
              </marker>
            </defs>
            <Layout size={hexagonSize} spacing={1.02} flat={false}>
              {cells.map(
                ({ id, q, r, s, state, highlighted, neighborCode }) => (
                  <Hexagon
                    className={[state, highlighted ? "highlighted" : ""].join(
                      " "
                    )}
                    key={id}
                    q={q}
                    r={r}
                    s={s}
                    onMouseEnter={handleMouseEnter}
                    onClick={handleMouseClick}
                    fill={getFillPattern(state, neighborCode)}
                    // onMouseLeave={handleMouseLeave}

                  >
                    <Coordinates q={q} r={r} />
                  </Hexagon>
                )
              )}

              <Pattern
                id="pat-water0"
                link={images["water0"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water1"
                link={images["water1"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water2"
                link={images["water2"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water3"
                link={images["water3"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water4"
                link={images["water4"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water5"
                link={images["water5"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water6"
                link={images["water6"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water7"
                link={images["water7"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water8"
                link={images["water8"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water9"
                link={images["water9"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water10"
                link={images["water10"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water11"
                link={images["water11"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water12"
                link={images["water12"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water13"
                link={images["water13"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water14"
                link={images["water14"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water15"
                link={images["water15"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water16"
                link={images["water16"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water17"
                link={images["water17"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water18"
                link={images["water18"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water19"
                link={images["water19"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water20"
                link={images["water20"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water21"
                link={images["water21"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water22"
                link={images["water22"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water23"
                link={images["water23"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water24"
                link={images["water24"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water25"
                link={images["water25"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water26"
                link={images["water26"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water27"
                link={images["water27"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water28"
                link={images["water28"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water29"
                link={images["water29"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water30"
                link={images["water30"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water31"
                link={images["water31"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water32"
                link={images["water32"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water33"
                link={images["water33"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water34"
                link={images["water34"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water35"
                link={images["water35"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water36"
                link={images["water36"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water37"
                link={images["water37"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water38"
                link={images["water38"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water39"
                link={images["water39"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water40"
                link={images["water40"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water41"
                link={images["water41"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water42"
                link={images["water42"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water43"
                link={images["water43"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water44"
                link={images["water44"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water45"
                link={images["water45"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water46"
                link={images["water46"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water47"
                link={images["water47"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water48"
                link={images["water48"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water49"
                link={images["water49"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water50"
                link={images["water50"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water51"
                link={images["water51"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water52"
                link={images["water52"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water53"
                link={images["water53"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water54"
                link={images["water54"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water55"
                link={images["water55"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water56"
                link={images["water56"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water57"
                link={images["water57"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water58"
                link={images["water58"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water59"
                link={images["water59"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water60"
                link={images["water60"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water61"
                link={images["water61"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water62"
                link={images["water62"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water63"
                link={images["water63"]}
                size={waterSize}
              />
              <Pattern
                id="pat-water64"
                link={images["water64"]}
                size={waterSize}
              />

              <Pattern
                id="pat-island0"
                link={images["island0"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island1"
                link={images["island1"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island2"
                link={images["island2"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island3"
                link={images["island3"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island4"
                link={images["island4"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island5"
                link={images["island5"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island6"
                link={images["island6"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island7"
                link={images["island7"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island8"
                link={images["island8"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island9"
                link={images["island9"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island10"
                link={images["island10"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island11"
                link={images["island11"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island12"
                link={images["island12"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island13"
                link={images["island13"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island14"
                link={images["island14"]}
                size={islandSize}
              />
              <Pattern
                id="pat-island99"
                link={island99}
                size={waterSize}
              />

              {ships.map((ship, index) => (
                <Ship ship={ship} size={hexagonSize} key={index} />
              ))}

              <Path
                start={myShip}
                end={travelEndpoint}
                markerEnd="url(#arrowheadMove)"
              />
              <Path
                start={travelEndpoint}
                end={shotEndpoint}
                markerEnd="url(#arrowheadShoot)"
                strokeDasharray="1 2"
              />
            </Layout>
          </HexGrid>
        </Grid>
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
