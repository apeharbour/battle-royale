// ShipStatus.jsx

import React from "react";
import { Card, CardContent, CardMedia, Chip, Stack, Typography } from "@mui/material";

export default function ShipStatus({ ship }) {

  if (!ship) return (
    <Card elevation={4}>
      <CardContent>
        <Typography variant="h5" > Not playing in this game </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Card elevation={4}>
      <CardMedia
        component="img"
        alt="Ship"
        image={ship.image}
        title={ship.name}
        sx={{
          width: '100%', // Adjust the width to leave space around the image
          margin: 'auto', // Center the image horizontally
          padding: '10px', // Optional: add padding around the image
        }}
      />
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Stack spacing={1} direction="row" justifyContent="center">
          <Chip label={`Movement: ${ship.range}`} color='primary' />
          <Chip label={`Shoot: ${ship.shotRange}`} color='primary' />
        </Stack>

      </CardContent>
    </Card>
  );
}
