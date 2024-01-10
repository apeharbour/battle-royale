import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
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
import sailboat from "./sailboat.svg";
import Point from "react-hexgrid/lib/models/Point";
import GameAbi from "./abis/GamePunk.json";

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
      radius
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
  const shipColor = mine ? "red" : "whitesmoke";

  return (
    <svg
      x={point.x - size / 2}
      y={point.y - size / 2}
      width={size}
      height={size}
      viewBox="0 0 199.502 199.502"
      style={{ fill: shipColor }}
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
  const [radius, setRadius] = useState(4);
  const [registrationContractAddress, setRegistrationContractAdress] =
    useState("");
  const [travelEndpoint, setTravelEndpoint] = useState(undefined);
  const [shotEndpoint, setShotEndpoint] = useState(undefined);
  const [state, setState] = useState(TRAVELLING);
  const [myPosition, setMyPosition] = useState(null);

  const { loading, error, data } = useQuery(GET_GAME, {
    pollInterval: 5000,
    variables: { gameId: id, first: 300, skip: 0 },
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      // Check the radius and set the viewBox dynamically
      if (data && data.games && data.games[0]) {
        const radius = data.games[0].radius;
        if (radius < 5) { 
          setViewBoxValues("-5 -20 100 100");
        }
      }
    },
  });

  useEffect(() => {
    const fetchContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(GAME_ADDRESS, GAME_ABI, signer);
      setContract(contract);
      setProvider(provider);
      setGamePlayer(signer.address);
    };

    fetchContract();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  useEffect(() => {
    if (data && data.games && data.games[0]) {
      // Find and set the player's current position
      const myPlayer = data.games[0].players.find(
        (player) => player.address.toLowerCase() === gamePlayer.toLowerCase()
      );
      if (myPlayer) {
        setMyPosition(
          new Hex(myPlayer.q, myPlayer.r, -myPlayer.q - myPlayer.r)
        );
      }
    }
  }, [data, gamePlayer]);



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

  const hexToPixel = (hex) => {
    if (!hex) return null;
    const layout = new Layout(Layout.flat, { x: 4, y: 4 }, new Point(0, 0));
    return HexUtils.hexToPixel(hex, layout);
  };

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
    const hexClicked = new Hex(
      source.props.q,
      source.props.r,
      -source.props.q - source.props.r
    );

    if (state === TRAVELLING) {
      setTravelEndpoint(hexClicked);
      setShotEndpoint(null);
      setState(SHOOTING);
    } else if (state === SHOOTING) {
      setShotEndpoint(hexClicked);
      setState(DONE);      
    } else if (state === DONE) {
      setTravelEndpoint(undefined)
      setShotEndpoint(undefined)
      setState(TRAVELLING)
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

  const initMap = async () => {
    if (contract) {
      console.log(`Creating Map for gameID: ${id} with radius: ${radius}`);
      const tx = await contract.initGame(radius, id).catch((e) => {
        console.error("horrible mistake:", e);
      });
      console.log(tx);
      await tx.wait();
    }
  };

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
                value={radius}
                onChange={(e) => {
                  setRadius(parseInt(e.target.value));
                }}
              />
              <Button variant="outlined" onClick={initMap}>
                Init
              </Button>
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
        <HexGrid width={800} height={800} viewBox={viewBoxValues}>
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
            {data &&
              data.games &&
              data.games[0] &&
              data?.games[0].cells.map((cell) => {
                const s = (cell.q + cell.r) * -1;
                const state = cell.island ? "island" : "water";
                const highlighted = false;

                return (
                  <Hexagon
                    className={[state, highlighted ? "highlighted" : ""].join(
                      " "
                    )}
                    key={cell.id}
                    q={cell.q}
                    r={cell.r}
                    s={s}
                    onMouseEnter={handleMouseEnter}
                    onClick={handleMouseClick}
                  >
                    <Coordinates q={cell.q} r={cell.r} />
                  </Hexagon>
                );
              })}

            {data &&
              data.games &&
              data.games[0] &&
              data?.games[0].players.map((player) => {
                const s = (player.q + player.r) * -1;
                const mine =
                  player.address.toLowerCase() === gamePlayer.toLowerCase();
                return (
                  <Ship
                    q={player.q}
                    r={player.r}
                    s={s}
                    mine={mine}
                    key={player.address}
                  />
                );
              })}
            {myPosition && travelEndpoint && (
              <Path
                start={hexToPixel(myPosition)}
                end={hexToPixel(travelEndpoint)}
                markerEnd="url(#arrowheadMove)"
              />
            )}
            {travelEndpoint && shotEndpoint && (
              <Path
                start={hexToPixel(travelEndpoint)}
                end={hexToPixel(shotEndpoint)}
                markerEnd="url(#arrowheadShoot)"
                strokeDasharray="1 2"
              />
            )}
          </Layout>
        </HexGrid>
      </Grid>
      <Grid item xs={3}>
        <PlayerMovements gameId={id} />
      </Grid>
    </Grid>
  );
}
