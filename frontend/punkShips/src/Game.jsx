import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
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
import Registration from "./Registration";
import PlayerMovements from "./PlayerMovements";
import { useLayoutContext } from "react-hexgrid/lib/Layout";
import GameAbi from "./abis/GamePunk.json";

//const MY_ADDRESS = "0x21d5b09cbb222151271cb193e6849df246df82a5";
const MY_ADDRESS = "0xCd9680dd8318b0df924f0bD47a407c05B300e36f";
const GAME_ADDRESS = "0xFbadD58d6317637af3Dad09BFa8F10C82ccDa2b0";
const GAME_ABI = GameAbi.abi;
const TRAVELLING = 0;
const SHOOTING = 1;
const DONE = 2;

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
  const [registrationContractAddress, setRegistrationContractAdress] =
    useState("");
  const [cells, setCells] = useState([]);
  const [ships, setShips] = useState([]);
  const [myShip, setMyShip] = useState(undefined);
  const [travelEndpoint, setTravelEndpoint] = useState(undefined);
  const [shotEndpoint, setShotEndpoint] = useState(undefined);
  const [state, setState] = useState(TRAVELLING);
  const [viewBoxValues, setViewBoxValues] = useState("2 -20 135 135");

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

  const enrichCell = (cell) => {
    const s = (cell.q + cell.r) * -1;
    const state = cell.island ? "island" : "water";
    const highlighted = false;
    const newCell = { ...cell, s, state, highlighted };
    return newCell;
  };

  const enrichShip = (ship) => {
    const s = (ship.q + ship.r) * -1;
    const mine = ship.address.toLowerCase() === MY_ADDRESS.toLowerCase();
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
    const cells = game.cells.map(enrichCell);
    console.log("Cells: ", cells);
    setCells([...cells]);
    const updatedCells = cells.map((c) =>
      highlightReachableCells(c, myShip1, myShip1.range)
    );
    console.log("Updated Cells: ", updatedCells);
    setCells([...updatedCells]);
  };

  const { loading, error, data } = useQuery(GET_GAME, {
    pollInterval: 5000,
    variables: { gameId: id, first: 1000, skip: 0 },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log("Data2:", data);
      updateData(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

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
    } else if (state === TRAVELLING && selectedCell.highlighted) {
      const updatedCells = cells
        .map(clearHighlights)
        .map((cell) =>
          highlightReachableCells(cell, travelEndpoint, myShip.shotRange)
        );
      setCells([...updatedCells]);
      setState(SHOOTING);
    } else if (state === SHOOTING && selectedCell.highlighted) {
      const updatedCells = cells.map(clearHighlights);
      setCells([...updatedCells]);
      setState(DONE);
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

  const registrationContract = async () => {
    if (contract) {
      const tx = await contract
        .setRegistrationContract(registrationContractAddress)
        .catch(console.error);
      await tx.wait();
    }
  };

  const distance = (a, b) => {
    const q1 = a.q, r1 = a.r;
    const q2 = b.q, r2 = b.r;

    return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
};


const determineDirection = (deltaQ, deltaR) => {
  // Normalize the deltas to -1, 0, or 1
  const sign = (num) => num === 0 ? 0 : num > 0 ? 1 : -1;
  const normDeltaQ = sign(deltaQ);
  const normDeltaR = sign(deltaR);

  if (normDeltaQ === 1 && normDeltaR === 0) return "E";
  if (normDeltaQ === 1 && normDeltaR === -1) return "NE";
  if (normDeltaQ === 0 && normDeltaR === -1) return "NW";
  if (normDeltaQ === -1 && normDeltaR === 0) return "W";
  if (normDeltaQ === -1 && normDeltaR === 1) return "SW";
  if (normDeltaQ === 0 && normDeltaR === 1) return "SE";
  return "Unknown";
};

const consoleMoves = () => {
  let qTravel = travelEndpoint.q - myShip.q;
  let rTravel = travelEndpoint.r - myShip.r;
  let travelDirection = determineDirection(qTravel, rTravel);
  let travelDistance = distance(myShip, travelEndpoint);
  let qShot = shotEndpoint.q - travelEndpoint.q;
  let rShot = shotEndpoint.r - travelEndpoint.r;
  let shotDirection = determineDirection(qShot, rShot);
  let shotDistance = distance(travelEndpoint, shotEndpoint);

  console.log('Travel Direction: ', travelDirection);
  console.log('Travel Distance: ', travelDistance);
  console.log('Shot Direction: ', shotDirection);
  console.log('Shot Distance: ', shotDistance);
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Grid container spacing={2}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h5">Game {id}</Typography>
        </Grid>
        {gamePlayer === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" ||
        gamePlayer === "0xCd9680dd8318b0df924f0bD47a407c05B300e36f" ? (
          <Grid item xs={8}>
            <Stack spacing={2} direction="row">
              <TextField
                variant="outlined"
                value={registrationContractAddress}
                onChange={(e) => {
                  setRegistrationContractAdress(e.target.value);
                }}
              />
              <Button variant="contained" onClick={registrationContract}>
                Set
              </Button>
            </Stack>
          </Grid>
        ) : null}
      </Grid>

      <Grid item xs={12}>
        <Registration gameId={id} />
      </Grid>

      <Grid item xs={9}>
        <HexGrid width={800} height={800} viewBox="-5 -20 120 120">
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
                className={[state, highlighted ? "highlighted" : ""].join(" ")}
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
        <PlayerMovements gameId={id} travelEndpoint={travelEndpoint} shotEndpoint={shotEndpoint} />
        <Box mt={3}>
        <Button variant="contained" onClick={consoleMoves}>Console</Button>
        </Box>
      </Grid>
    </Grid>
  );
}
