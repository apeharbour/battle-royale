import React, { useState } from "react";
import "./MintShip.css";
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
import { HexGrid, Hexagon, Layout } from "react-hexgrid";
import { useNavigate } from "react-router-dom";

export default function SpectatorGameCard({
  gameId,
  totalPlayers,
  cells,
  mapShrink,
  radius,
  state,
  timeCreated,
}) {
  const navigate = useNavigate();

  const renderHexGrid = (cells) => {
    if (!cells || cells.length === 0) return null;

    return (
      <HexGrid width={220} height={200} viewBox="-10 -30 130 130">
        <Layout
          size={{ x: 4, y: 3.5 }}
          flat={false}
          spacing={1.1}
          origin={{ x: 0, y: 0 }}
        >
          {cells.map((cell, index) => (
            <Hexagon
              key={index}
              q={cell.q}
              r={cell.r}
              s={-cell.q - cell.r}
              style={{ fill: cell.island ? "#8B4513" : "#1E90FF" }}
            />
          ))}
        </Layout>
      </HexGrid>
    );
  };

  function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "Europe/Berlin",
      timeZoneName: "short",
    };
    return new Intl.DateTimeFormat("en-US", options)
      .format(date)
      .replace("GMT+2", "CET");
  }

  const handleButtonClick = (gameId) => () => {
    console.log("Show game", gameId);
    navigate(`/spectator/${gameId}`);
  };

  if (!gameId || !totalPlayers || !cells || !radius || !state || !timeCreated) {
    return null;
  }

  return (
    <Card sx={{ maxWidth: "320px" }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ fontWeight: 700 }}
        >
          <Typography variant="h5" component="div">
            Game {gameId}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {state}
          </Typography>
        </Box>
        <Box ml={2}>{renderHexGrid(cells)}</Box>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Map Size: {radius} rings
          </Typography>
          {mapShrink && mapShrink === 1 && (
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Shrink: Every round
            </Typography>
          )}
          {mapShrink && mapShrink > 1 && (
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Map Shrink: Every {mapShrink} rounds
            </Typography>
          )}
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Total Players: {totalPlayers}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Game Created On: {formatTimestampToDate(timeCreated)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ marginBottom: 1 }}>
        <button
          className="holographic3-button"
          onClick={handleButtonClick(gameId)}
        >
          Show
        </button>
      </CardActions>
    </Card>
  );
}
