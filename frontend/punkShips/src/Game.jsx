import * as React from "react";
import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
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
import sailboat from './sailboat.svg'
import Point from "react-hexgrid/lib/models/Point";

const MY_ADDRESS = '0x21d5b09cbb222151271cb193e6849df246df82a5'

const GET_GAME = gql`
  query getGame($gameId: Int!) {
    games(where: { gameId: $gameId }) {
      gameId
      state
      cells {
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

function Ship({q, r, s, mine}) {
  const { layout } = useLayoutContext()
  console.log('l:', layout)
    const hex = new Hex(q, r, s);
    const point = HexUtils.hexToPixel(hex, layout);
    const size = 5
    return (
      <>
      {/* <circle cx={point.x} cy={point.y} r={1} className={mine ? 'myShip' : 'ship'}/> */}
      <image x={point.x - size/2} y={point.y-size/2} height={size} width={size} href={sailboat} className={mine ? 'myShip' : 'ship'}/>
      </>
    )
}


export default function Game(props) {
  const { pathname } = useLocation();
  const id = parseInt(pathname.split("/")[1]);
  const [cells, setCells] = React.useState([]);
  const [ships, setShips] = React.useState([]);

  const enrichCell = (cell) => {
    const s = (cell.q + cell.r) * -1;
    const newCell = { ...cell, s };
    return newCell;
  };

  const enrichShip = (ship) => {
    const s = (ship.q + ship.r) * -1;
    const mine = ship.address === MY_ADDRESS
    const newCell = { ...ship, s, mine };
    return newCell;
  };

  const updateData = (data) => {
    const { games } = data;
    const game = games[0];

    // process cells
    const cells = game.cells.map(enrichCell);
    setCells([...cells]);

    // process ships
    const ships = game.players.map(enrichShip);
    setShips([...ships]);
  };

  const { loading, error, data } = useQuery(GET_GAME, {
    pollInterval: 5000,
    variables: { gameId: id },
    onCompleted: (data) => {
      updateData(data);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  console.log(sailboat);

  return (
    <Stack>
      <Typography variant="h5">Game {id}</Typography>
      <HexGrid width={1024} height={1024} 
      viewBox="2 -20 100 100"
      >
        <Layout
          size={{x: 4, y: 4}}
          spacing={1.05}
          flat={false}
        >

          {cells.map(({ id, q, r, s, island }) => (
            <Hexagon
              className={island ? "island" : "water"}
              key={id}
              q={q}
              r={r}
              s={s}
            >
              <Coordinates q={q} r={r} />
            </Hexagon>
          ))}

          {ships.map(({ q, r, s, mine, address, state }, index) => (
            <Ship q={q} r={r} s={s} mine={mine} key={index} />
          ))}
        </Layout>
      </HexGrid>
    </Stack>
  );
}
