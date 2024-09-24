import React from "react";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}..${address.slice(-4)}`;
};

export default function LastRoundResults({ rounds, ...props }) {
  // Keep track of displayed players to avoid duplicates
  const displayedPlayers = new Set();

  return (
    <Card elevation={4}>
      <CardHeader
        title="Results"
        titleTypographyProps={{ fontSize: "1.25rem", fontWeight: "600" }}
        sx={{ backdropFilter: "brightness: 60%", opacity: 1 }}
      />
      <CardContent>
        {rounds &&
          rounds.map((round, roundIndex) =>
            round.moves.map((move, moveIndex) => {
              const player = move?.player;
              const killedInRound = player?.killedInRound;

              // Check if the player exists, was killed in this round, and has not been displayed yet
              if (
                player &&
                killedInRound &&
                killedInRound.round === round.round &&
                !displayedPlayers.has(player.address)
              ) {
                // Add player to the Set of displayed players to avoid duplicates
                displayedPlayers.add(player.address);

                return (
                  <Box key={`${roundIndex}-${moveIndex}`}>
                    <Typography variant="subtitle1">
                      Round {round.round}
                    </Typography>
                    <Box pl={2}>
                      <Typography variant="body2">
                        {`${shortenAddress(player.address)} was ${
                          player.state
                        }`}
                      </Typography>
                    </Box>
                  </Box>
                );
              }
              return null;
            })
          )}
      </CardContent>
    </Card>
  );
}
