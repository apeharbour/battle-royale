import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Grid
} from "@mui/material";

import Registration from "./Registration";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from 'graphql-request'
import { useAccount, useBlockNumber } from "wagmi";


const GET_GAMES = gql`
  query getGames {
    games {
      id
      gameId
      state
    }
  }
`;

export default function ListGames(props) {
  const [sortedGames, setSortedGames] = useState([]);

  const account = useAccount();
  const { data: blockNumber } = useBlockNumber({watch: true})

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isFetching, isRefetching  } = useQuery({
    queryKey: ["games"],
    queryFn: async () =>
      request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_GAMES),
  });

  useEffect(() => {
    console.log("New block: ", blockNumber, "invalidating games query");
    queryClient.invalidateQueries(['games']);
  }, [blockNumber]);


  // const { loading, error, data } = useQuery(GET_GAMES, {
  //   pollInterval: 5000,
  // });

  // const data = [ { gameStarteds: [ { id: 1, gameId: 1 }, { id: 2, gameId: 2 } ] } ];
  // const loading = false;
  // const error = null;

  useEffect(() => {
    if (data && data.games) {
      const sorted = data.games
        .sort((a, b) => a.gameId - b.gameId);
      setSortedGames(sorted);
    }
  }, [data]);

  if (isLoading) {console.log("Loading...");};
  if (isError) {console.log("Error: ", error);};

  return (
    <Grid container spacing={2} p={4}>
      <Grid item xs={6} md={6}>
        {sortedGames.map(({ id, gameId }) => (
          <Box mt={1} key={id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Game {gameId}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" href={`/${gameId}`}>
                  Show
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Grid>
      <Grid item xs={6} md={6}>
        <Registration />
      </Grid>
    </Grid>
  );
}
