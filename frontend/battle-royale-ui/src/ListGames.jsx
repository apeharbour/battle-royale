import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Grid,
  Tooltip
} from "@mui/material";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from 'graphql-request';
import { useAccount, useBlockNumber } from "wagmi";

const GET_GAMES = gql`
query getGame($address: Bytes) {
  players(where: {address: $address}) {
    address
    state
    game {
      gameId
      state
    }
  }
}
`;

export default function ListGames(props) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const queryClient = useQueryClient();

  const useGameQuery = (select) => useQuery({
    queryKey: ["players"],
    queryFn: async () => request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_GAMES, {
      address: address,
    }),
    select,
  });

  const useGameData = () => useGameQuery((data) => data.players);

  const { data: gameData } = useGameData();

  return (
    <Grid container spacing={2} p={4}>
      {gameData && gameData.map(({ game, address, state }, index) => {
        let hoverMessage;
        if (state === "active") {
          hoverMessage = `You are active in game with ${game.gameId}`;
        } else if (state === "won") {
          hoverMessage = `You won the game with game ${game.gameId}`;
        } else if (state === "beached") {
          hoverMessage = `You were beached. Try again next time!`;
        } else if (state === "dropped") {
          hoverMessage = `You lost the game with game ${game.gameId}, due to dropping out of the map!`;
        } else if (state === "crashed") {
          hoverMessage = `You lost the game with game ${game.gameId}, due to crashing into an island!`;
        } else if (state === "shot") {
          hoverMessage = `You lost the game with game ${game.gameId}, due to being shot down!`;
        } else if (state === "draw") {
          hoverMessage = `It was a draw in game ${game.gameId}!, try again!`;
        }

        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Tooltip title={hoverMessage}>
              <Box mt={1}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h5" component="div">
                        Game {game.gameId}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {game.state}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      href={`/${game.gameId}`}
                      disabled={game.state !== "active"}
                    >
                      Show
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Tooltip>
          </Grid>
        );
      })}
    </Grid>
  );
}
