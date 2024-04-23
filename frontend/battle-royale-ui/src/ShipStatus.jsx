// ShipStatus.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardMedia, Chip, Stack, Typography } from "@mui/material";

export default function ShipStatus({ship, gameId, state, round, ...props}) {

  if (!ship) return (
  <Card elevation={4}>
    <CardHeader title={`game ${gameId}, round ${round}`} />
    <CardContent>
      <Typography variant="h5" > Not playing in this game </Typography>
    </CardContent>
  </Card>
  );

  return (
      <Card elevation={4}>
        <CardHeader title={`game ${gameId}, round ${round}`} />
        <CardMedia
          component="img"
          alt="Ship"
          image={ship.image}
          title={ship.name}
        />
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Stack spacing={1} direction="row">
          <Chip label={`Movement: ${ship.range}`} color='primary'/>
          <Chip label={`Shoot: ${ship.shotRange}`} color='secondary'/>
          </Stack>
        </CardContent>
      </Card>
  );
}
