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

  const GET_GAME = gql`
  query getGame($gameId: Int!,$first: Int, $skip: Int) {
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
    // console.log("l:", layout);
    const hex = new Hex(q, r, s);
    const point = HexUtils.hexToPixel(hex, layout);
    const size = 5;
    return (
      <>
        {/* <circle cx={point.x} cy={point.y} r={1} className={mine ? 'myShip' : 'ship'}/> */}
        <image
          x={point.x - size / 2}
          y={point.y - size / 2}
          height={size}
          width={size}
          href={sailboat}
          className={mine ? "myShip" : "ship"}
        />
      </>
    );
  }

  export default function Game(props) {
    const { pathname } = useLocation();
    const id = parseInt(pathname.split("/")[1]);
    // const [cells, setCells] = useState([]);
    // const [ships, setShips] = useState([]);
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [player, setPlayer] = useState(null);
    const [radius, setRadius] = useState(4);
    const [registrationContractAddress, setRegistrationContractAdress] =
      useState("");
    const [viewBoxValues, setViewBoxValues] = useState("2 -20 135 135");

    useEffect(() => {
      const fetchContract = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(GAME_ADDRESS, GAME_ABI, signer);
        setContract(contract);
        setProvider(provider);
        setPlayer(signer.address);
      };

      fetchContract();
    }, []);

    // const enrichCell = (cell) => {
    //   const s = (cell.q + cell.r) * -1;
    //   const newCell = { ...cell, s };
    //   return newCell;
    // };

    // const enrichShip = (ship) => {
    //   const s = (ship.q + ship.r) * -1;
    //   const mine = ship.address === MY_ADDRESS;
    //   const newCell = { ...ship, s, mine };
    //   return newCell;
    // };

    //   const updateData = (data) => {
    //     const { games } = data;
    //     const game = games[0];

    //     // process cells
    //     const newCells = game.cells.map(cell => ({ ...enrichCell(cell) }));
    //     setCells(newCells);
    //     console.log("NewCells: ", cells);

    //     // process ships
    //     const newShips = game.players.map(player => ({ ...enrichShip(player) }));
    //     setShips(newShips);
    //     console.log("Ships: ", ships);
    // };

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
      }
    });

    console.log("Data: ", data);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    // console.log(sailboat);

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
          {player === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" ||
          player === "0xCd9680dd8318b0df924f0bD47a407c05B300e36f" ? (
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
            <Layout size={{ x: 4, y: 4 }} spacing={1.05} flat={false}>
              {data && data.games && data.games[0] && data?.games[0].cells.map((cell) => {
                const s = (cell.q + cell.r) * -1;
                return (
                  <Hexagon
                    className={cell.island ? "island" : "water"}
                    key={cell.id}
                    q={cell.q}
                    r={cell.r}
                    s={s}
                  >
                    <Coordinates q={cell.q} r={cell.r} />
                  </Hexagon>
                );
              })}

              {data && data.games && data.games[0] && data?.games[0].players.map((player) => {
                const s = (player.q + player.r) * -1;
                const mine = player.address === MY_ADDRESS;
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
            </Layout>
          </HexGrid>
        </Grid>
        <Grid item xs={3}>
          <PlayerMovements gameId={id} />
        </Grid>
      </Grid>
    );
  }
