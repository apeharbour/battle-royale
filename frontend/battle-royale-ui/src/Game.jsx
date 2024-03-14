import React, { useState, useEffect, Fragment } from "react";
import { ethers } from "ethers";
import { Box, Grid, Stack, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useQuery, gql } from "@apollo/client";
import { useLocation } from "react-router-dom";
import {
  Hex,
  HexGrid,
  HexUtils,
  Hexagon,
  Layout,
  Path,
  Text,
} from "react-hexgrid";
import Coordinates from "./Coordinates";
import { useLayoutContext } from "react-hexgrid/lib/Layout";
import GameAbi from "./abis/GamePunk.json";
import Timer from "./Timer";
import ShipStatus from "./ShipStatus";
import PlayerStatus from "./PlayerStatus";
import Logs from "./Logs";

const GAME_ADDRESS = "0x1D6CDc348B3631e9C444CdEfe7Da09048e4F88FD";
const GAME_ABI = GameAbi.abi;
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

function Ship({ q, r, s, mine }) {
  const { layout } = useLayoutContext();
  const hex = new Hex(q, r, s);
  const point = HexUtils.hexToPixel(hex, layout);
  const size = 5;
  const shipColor = mine ? "red" : "black";
  return (
    <svg
      x={point.x - size / 2}
      y={point.y - size / 2}
      height={size}
      width={size}
      viewBox="0 0 199.502 199.502"
    >
      <g>
        <path
          d="M198.773,118.615c-0.663-0.86-1.687-1.364-2.772-1.364h-54.559c-1.198,0-2.312,0.614-2.955,1.624l-7.858,12.376h-22.128
				V53.122l32.801-13.12c1.328-0.533,2.199-1.82,2.199-3.25s-0.872-2.717-2.199-3.25L108.501,20.38V8.751h-7v14v28v80.5h-24.5v-10.5
				h17.5c1.359,0,2.594-0.786,3.17-2.017c0.576-1.231,0.388-2.683-0.484-3.727c-0.061-0.073-6.186-8.242-6.186-38.006
				c0-29.528,6.175-37.987,6.187-38.006c0.871-1.044,1.059-2.497,0.484-3.727c-0.576-1.23-1.812-2.017-3.17-2.017H42.001
				c-1.313,0-2.514,0.733-3.114,1.901c-0.3,0.588-7.386,14.689-7.386,41.849s7.085,41.262,7.386,41.85
				c0.6,1.167,1.801,1.9,3.114,1.9h14v10.5h-52.5c-1.537,0-2.892,1.001-3.345,2.468c-0.453,1.468,0.104,3.059,1.372,3.924
				l49.528,33.769c15.642,10.664,43.764,19.339,62.691,19.339h64.754c1.589,0,2.981-1.072,3.386-2.61l17.5-66.5
				C199.662,120.592,199.436,119.475,198.773,118.615z M108.501,27.921l22.077,8.83l-22.077,8.83V27.921z M44.3,113.751
				c-1.772-4.505-5.799-16.922-5.799-36.75c0-19.833,4.03-32.254,5.797-36.75h44.551c-2.221,5.898-4.848,17.041-4.848,36.75
				s2.627,30.852,4.849,36.75H73.501h-14H44.3z M70.001,120.751v10.5h-7v-10.5H70.001z M175.803,183.751h-62.055
				c-17.736,0-44.09-8.13-58.746-18.122l-40.155-27.378h44.654h14h28h7h24.052c1.198,0,2.312-0.614,2.955-1.624l7.858-12.376h48.094
				L175.803,183.751z"
          style={{ fill: shipColor }}
        />
        <circle cx="84.001" cy="155.751" r="7" />
        <circle cx="115.501" cy="155.751" r="7" />
        <circle cx="147.001" cy="155.751" r="7" />
      </g>
    </svg>
  );
}

export default function Game(props) {
  const { pathname } = useLocation();
  const id = parseInt(pathname.split("/")[1]);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [gamePlayer, setGamePlayer] = useState(null);
  const [cells, setCells] = useState([]);
  const [ships, setShips] = useState([]);
  const [myShip, setMyShip] = useState(undefined);
  const [currentGameRound, setCurrentGameRound] = useState(0);
  const [travelEndpoint, setTravelEndpoint] = useState(undefined);
  const [shotEndpoint, setShotEndpoint] = useState(undefined);
  const [state, setState] = useState(TRAVELLING);
  const [viewBoxValues, setViewBoxValues] = useState("2 -20 135 135");
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const gameId = id;

  useEffect(() => {
    const fetchContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(GAME_ADDRESS, GAME_ABI, signer);
      setContract(contract);
      setProvider(provider);
      setGamePlayer(signer.address);
      // console.log("Player address:", signer.address);
    };

    fetchContract();
  }, []);

  const enrichCell = (cell, allCells) => {
    const s = (cell.q + cell.r) * -1;
    const state = cell.island ? "island" : "water";
    const highlighted = false;

    // check if there are islands as neighbors
    const hex = new Hex(cell.q, cell.r, s);
    const neighbors = HexUtils.neighbors(hex);

    const allNeighborCells = allCells.filter((c) =>
      neighbors.some((n) =>
        HexUtils.equals(n, new Hex(c.q, c.r, (c.q + c.r) * -1))
      )
    );

    /* neigbor code is a 6 bit number where each bit represents a neighbor cell
    The codes are as follows:
    0b000001: West
    0b000010: South West
    0b000100: North West
    0b001000: South East
    0b010000: North East
    0b100000: East */
    // FIXME: doesn't work for cells on the edge of the map because the ring of neighbors is not complete
    const neighborCode = allNeighborCells.reduce(
      (acc, c, i) => acc + (c.island ? Math.pow(2, i) : 0),
      0
    );

    const newCell = { ...cell, s, state, highlighted, neighborCode };
    return newCell;
  };

  const enrichShip = (ship) => {
    const s = (ship.q + ship.r) * -1;
    const mine = ship.address.toLowerCase() === gamePlayer.toLowerCase();
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

  const { loading, error, data } = useQuery(GET_GAME, {
    pollInterval: 5000,
    variables: { gameId: id, first: 1000, skip: 0 },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log("Data2:", data);
      updateData(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (gamePlayer && data) {
      updateData(data);
    }
  }, [gamePlayer, data]);

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
      let randomInt = generateRandomInt();
      const moveHash = ethers.solidityPackedKeccak256(
        ["uint8", "uint8", "uint8", "uint8", "uint8"],
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
        <Grid item xs={12}>
          <Stack spacing={4} direction={"row"} alignContent={"center"}>
            <Typography variant="h5">Game {id}</Typography>
            <Typography variant="h5">Round {currentGameRound}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          {myShip && myShip.range && (
            <ShipStatus range={myShip.range} speed={myShip.shotRange} />
          )}

          <Logs gameId={id} />
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
            <Layout size={{ x: 4, y: 4 }} spacing={1.05} flat={false}>
              {cells.map(({ id, q, r, s, state, highlighted }) => (
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
                  // onMouseLeave={handleMouseLeave}
                >
                  <Coordinates q={q} r={r} />
                </Hexagon>
              ))}

              {ships.map(({ q, r, s, mine, address, state }, index) => (
                <Ship q={q} r={r} s={s} mine={mine} key={index} />
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
