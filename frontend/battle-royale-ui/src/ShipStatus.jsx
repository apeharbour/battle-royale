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

  console.log(ship);
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
          <Chip label={`Yart Id: ${ship.tokenId}`} />
        </Stack>
        <Stack spacing={1} direction="row" justifyContent="center" mt={2}>
          <Chip label={`Movement: ${ship.range}`} />
          <Chip label={`Shoot: ${ship.shotRange}`} />
        </Stack>
      </CardContent>
    </Card>
  );
}
