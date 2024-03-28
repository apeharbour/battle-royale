// ShipStatus.jsx

import React from "react";
import { Card, CardContent, CardMedia, Chip, Stack } from "@mui/material";

export default function ShipStatus({ship, ...props}) {

  return (
      <Card elevation={4}>
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
