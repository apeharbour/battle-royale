import React, { Fragment } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Grid,
  Tooltip,
} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { useQuery, useQueries } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount } from "wagmi";
import Backdrop from "./Backdrop";
import "./MintShip.css";

const GET_GAMES = gql`
  query getGames {
    games {
      id
      gameId
      state
    }
  }
`;

const GET_WINNER = gql`
  query getWinner($gameId: BigInt!) {
    games(where: { gameId: $gameId }) {
      gameId
      totalPlayers
      timeEnded
      players {
        address
        range
        shotRange
        state
        kills
        image
      }
    }
  }
`;

export default function HallOfFame(props) {
  const { address } = useAccount();

  const useGameQuery = (select) =>
    useQuery({
      queryKey: ["getGames"],
      queryFn: async () =>
        request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_GAMES, {}),
      select,
    });

  const useGameData = () =>
    useGameQuery((data) =>
      data.games.filter((game) => game.state === "finished")
    );

  const { data: gameData, isLoading, isError } = useGameData();

  const gameIds = gameData?.map((game) => game.gameId) || [];

  const winnerQueries = useQueries({
    queries: gameIds.map((gameId) => ({
      queryKey: ["getWinner", gameId],
      queryFn: async () =>
        request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_WINNER, { gameId }),
      enabled: !!gameId,
    })),
  });

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}..${address.slice(-4)}`;
  };

  if (isLoading || winnerQueries.some((query) => query.isLoading)) {
    return <Backdrop open={true} />;
  }

  if (isError || winnerQueries.some((query) => query.isError)) {
    return <Backdrop open={true} />;
  }

  return (
    <Grid container spacing={2} p={4}>
      {gameData &&
        gameData.map((game, index) => {
          const winnerGameData = winnerQueries[index]?.data?.games[0];
          const winnerData = winnerGameData?.players?.find(
            (player) => player.state === "won"
          );
          return (
            <Fragment>
              {winnerData && (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box mt={1}>
                    <Card
                      sx={{
                        maxWidth: "300px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <CardContent sx={{ padding: "16px" }}>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{ marginBottom: "16px" }}
                        >
                          Game {game.gameId}
                        </Typography>
                        <Box
                          component="img"
                          src={winnerData.image}
                          alt={winnerData.address}
                          sx={{
                            maxWidth: "80%",
                            height: "auto",
                            marginBottom: "16px",
                          }}
                        />
                        <Tooltip title={winnerData.address}>
                          <Typography variant="body1">
                            Winner: {shortenAddress(winnerData.address)}
                          </Typography>
                        </Tooltip>
                        <Typography variant="body1">
                          Kills: {winnerData.kills}
                        </Typography>
                        <Typography variant="body1">
                          Total Players: {winnerGameData.totalPlayers}
                        </Typography>
                        <Typography variant="body1">
                          Game Ended On:{" "}
                          {new Date(winnerGameData.timeEnded * 1000).toLocaleString()}
                        </Typography>
                      </CardContent>
                      <CardActions
                        sx={{ width: "100%", justifyContent: "flex-start" }}
                      >
                        <button
                          className="holographic3-button"
                          onClick={() =>
                            (window.location.href = `/${game.gameId}/finalart`)
                          }
                        >
                          Show
                        </button>
                      </CardActions>
                    </Card>
                  </Box>
                </Grid>
              )}
            </Fragment>
          );
        })}
    </Grid>
  );
}
