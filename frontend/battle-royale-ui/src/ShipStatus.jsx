import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import "./MintShip.css";

export default function ShipStatus({ ship }) {
  if (!ship)
    return (
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h5"> Not playing in this game </Typography>
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
          width: "100%",
          margin: "auto",
          padding: "10px",
        }}
      />
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Stack spacing={1} direction="row" justifyContent="center">
          <div className="holographic-chip">Movement: {ship.range}</div>
          <div className="holographic-chip">Shoot: {ship.shotRange}</div>
        </Stack>
      </CardContent>
    </Card>
  );
}
