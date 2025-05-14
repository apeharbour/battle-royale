import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount, useBlockNumber } from "wagmi";
import SpectatorGameCard from "./SpectatorGameCard";
import Grid from "@mui/material/Grid2";

const gameQuery = gql`
  query getGame($first: Int) {
    games {
      gameId
      radius
      totalPlayers
      timeCreated
      mapShrink
      state
      cells(first: $first) {
        q
        r
        island
      }
    }
  }
`;

export default function Spectator() {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const queryClient = useQueryClient();

  const useGameQuery = (select) =>
    useQuery({
      queryKey: ["games"],
      queryFn: async () =>
        request(import.meta.env.VITE_SUBGRAPH_URL_GAME, gameQuery, {
          first: 1000,
        }),
      select,
      refetchOnWindowFocus: false,
    });

  const { data: gameData } = useGameQuery((data) => {
    // console.log("Game Data:", data);
    return data.games;
  });

  return (
    <Grid container spacing={2} p={2}>
      {gameData &&
        gameData.slice().reverse().map((game) => (
          <Grid item size={{ xs: 12, md: 3 }} key={game.gameId}>
            <SpectatorGameCard
              gameId={game.gameId}
              totalPlayers={game.totalPlayers}
              cells={game.cells}
              mapShrink={game.mapShrink}
              radius={game.radius}
              state={game.state}
              timeCreated={game.timeCreated}
            />
          </Grid>
        ))}
    </Grid>
  );
}
