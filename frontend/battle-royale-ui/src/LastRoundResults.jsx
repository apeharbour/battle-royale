// LastRoundResults.jsx

import React from "react";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}..${address.slice(-4)}`;
};

/* The entire condition below checks if someone was killed in a round 
 * and displays the result. It omits rounds and players that had no 
 * change. */
export default function LastRoundResults({ rounds, ...props }) {
  return (
    <Card elevation={4}>
      <CardHeader
        title="Results"
        sx={{ backdropFilter: "brightness: 60%", opacity: 1 }}
      />
      <CardContent>
        {rounds &&
          rounds.map((round, roundIndex) =>
            round.moves.map(
              (move, moveIndex) =>
                move &&
                move.player &&
                move.player.killedInRound &&
                move.player.killedInRound.round === round.round && (
                  <Box key={roundIndex}>
                    <Typography variant="subtitle1">
                      Round {round.round}
                    </Typography>
                    <Box key={moveIndex} pl={2}>
                      <Typography variant="body2">
                        {`${shortenAddress(move.player.address)} was ${
                          move.player.state
                        }`}
                      </Typography>
                    </Box>
                  </Box>
                )
            )
          )}
      </CardContent>
    </Card>
  );
}
