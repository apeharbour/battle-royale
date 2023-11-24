import * as React from "react";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useQuery, gql } from "@apollo/client";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

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
  const { loading, error, data } = useQuery(GET_GAMES, {
    pollInterval: 5000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Grid container spacing={2}>
      {data.games.map(({ id, state, gameId }) => (
        <Grid xs={6} md={8} key={id}>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {id}
              </Typography>
              <Typography variant="h5" component="div">
                Game {gameId}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                color="inherit"
                href={`/${gameId}`}
              >
                Show
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
