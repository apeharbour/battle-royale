import React from "react";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";

const shortenAddress = (address) =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

export default function LastRoundResults({ ships = [] }) {
  // 1. pull out only those ships that were killed, and
  //    sort them by the numeric round in which they died
  const deadShips = ships
    .filter((ship) => ship.killedInRound) // has kill info
    .sort(
      (a, b) => Number(a.killedInRound.round) - Number(b.killedInRound.round)
    );

  if (deadShips.length === 0) {
    return (
      <Card elevation={4}>
        <CardHeader
          title="results"
          titleTypographyProps={{ fontSize: "1.25rem", fontWeight: 600 }}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            No ships have been destroyed yet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={4}>
      <CardHeader
        title="results"
        titleTypographyProps={{ fontSize: "1.25rem", fontWeight: 600 }}
      />
      <CardContent>
        {deadShips.map((ship) => (
          <Box key={ship.address} mb={1}>
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "left"}}
            >
              round {ship.killedInRound.round}
            </Typography>
            <Box pl={1}>
              <Typography variant="body2" sx={{ textAlign: "left"}}>
                {shortenAddress(ship.address)} was {ship.state}
              </Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
