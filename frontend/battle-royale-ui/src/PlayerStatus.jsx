// PlayerStatus.jsx

import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const punkShips = [
  { name: "Sailing Ship", range: 6, speed: 2 },
  { name: "Three-master", range: 5, speed: 3 },
  { name: "Four-master", range: 4, speed: 4 },
  { name: "Five-master", range: 3, speed: 5 },
  { name: "Superyacht", range: 2, speed: 6 },
];

const PlayerPaper = styled(Paper)({
  maxWidth: "240px",
  borderRadius: "45px",
  overflow: "hidden",
  backgroundColor: "rgba(195, 208, 243, 0.9)",
  margin: "60px auto auto auto",
});

const ShipImage = styled("img")({
  width: "60%",
  height: "auto",
});

const PlayerStatus = ({ ships }) => {
  const findShipImage = (range, speed) => {
    const ship = punkShips.find(
      (ship) => ship.range === range && ship.speed === speed
    );
    return ship ? ship.image : null;
  };

  return (
    <>
      <Card elevation={4}>
        <CardHeader title="Leaderboard" />
        <CardContent>
        <TableContainer
            component={Paper}
          >
            <Table sx={{ minWidth: "auto" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Player</TableCell>
                  <TableCell align="right">Range</TableCell>
                  <TableCell align="right">Speed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ships && ships.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      <ShipImage src={player.image} alt={`Player Ship`} />
                    </TableCell>
                    <TableCell align="right">{player.range}</TableCell>
                    <TableCell align="right">{player.shotRange}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </CardContent>
      </Card>
    </>
  );
};

export default PlayerStatus;
