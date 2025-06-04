import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import "./MintShip.css";
import removeYachtBackground from "./RemoveYachtBackground";

export default function ShipStatus({ ship }) {
  if (!ship)
    return (
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h5"> not playing in this game </Typography>
        </CardContent>
      </Card>
    );

  return (
    <Card elevation={4}>
      <CardMedia
        component="img"
        alt="Ship"
        image={removeYachtBackground(ship.image)}
        title={ship.name}
        sx={{
          width: "100%",
          margin: "auto",
          padding: "10px",
        }}
      />
      <CardContent sx={{ flex: "1 0 auto" }}>
      <Stack spacing={1} direction="row" justifyContent="center">
          <Chip label={`yart  #${ship.tokenId}`} />
        </Stack>
        <Stack spacing={1} direction="row" justifyContent="center" mt={2}>
          <Chip label={`movement: ${ship.range}`} />
          <Chip label={`shoot: ${ship.shotRange}`} />
        </Stack>
      </CardContent>
    </Card>
  );
}
