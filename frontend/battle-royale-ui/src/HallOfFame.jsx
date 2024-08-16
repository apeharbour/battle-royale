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
  console.log(gameIds);

  const winnerQueries = useQueries({
    queries: gameIds.map((gameId) => ({
      queryKey: ["getWinner", gameId],
      queryFn: async () =>
        request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_WINNER, { gameId }),
      enabled: !!gameId,
    })),
  });

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
          const winnerData = winnerQueries[
            index
          ]?.data?.games[0]?.players?.find((player) => player.state === "won");
          return (
            <Fragment>
              {winnerData && (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Tooltip>
                    <Box mt={1}>
                      <Card>
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="h5" component="div">
                              Game {game.gameId}
                            </Typography>
                            <CardMedia
                              component="img"
                              image={winnerData.image}
                              alt={winnerData.address}
                              sx={{
                                maxWidth: "25%",
                                height: "auto",
                                marginLeft: "10px",
                              }}
                            />
                            <Box>
                              <Typography variant="body2">
                                Winner: {winnerData.address}
                              </Typography>
                              <Typography variant="body2">
                                Kills: {winnerData.kills}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions>
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
                  </Tooltip>
                </Grid>
              )}
            </Fragment>
          );
        })}
    </Grid>
  );
}
