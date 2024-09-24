import React, { useState } from "react";
import "./MintShip.css";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { HexGrid, Hexagon, Layout } from "react-hexgrid";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const HolographicButtonBlue = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "12px 24px",
  color: "#00bfff",
  border: "1.6px solid #00bfff",
  borderRadius: "24px",
  "& .MuiButton-label": {
    fontSize: "1rem",
  },
  cursor: "pointer",
  overflow: "hidden",
  transition: "transform 0.2s ease",
  fontFamily: theme.typography.fontFamily,
  "&:hover": {
    transform: "scale(1.05)",
    background: "black",
  },
  "&:disabled": {
    cursor: "not-allowed",
    borderColor: "#555",
    color: "#777",
    background: "#333",
  },
}));

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
          <Typography
            sx={{ fontSize: "1.25rem", fontWeight: "600" }}
            component="div"
          >
            Game {gameId}
          </Typography>
          <Typography sx={{ fontSize: "1rem" }} color="textSecondary">
            {state}
          </Typography>
        </Box>
        <Box ml={2}>{renderHexGrid(cells)}</Box>
        <Typography>
          <Typography component="span" sx={{ fontSize: "1rem" }}>
            Map:{" "}
          </Typography>
          <Typography
            component="span"
            sx={{ fontSize: "1rem", fontWeight: "600" }}
          >
            {radius} rings
          </Typography>
        </Typography>
        <Box>
          {mapShrink && mapShrink === 1 && (
            <Typography>
              <Typography component="span" sx={{ fontSize: "1rem" }}>
                Shrink:{" "}
              </Typography>
              <Typography
                component="span"
                sx={{ fontSize: "1rem", fontWeight: "600" }}
              >
                Every round
              </Typography>
            </Typography>
          )}
          {mapShrink && mapShrink > 1 && (
            <Typography>
              <Typography component="span" sx={{ fontSize: "1rem" }}>
                Shrink:{" "}
              </Typography>
              <Typography
                component="span"
                sx={{ fontSize: "1rem", fontWeight: "600" }}
              >
                Every {mapShrink} rounds
              </Typography>
            </Typography>
          )}
          <Typography>
            <Typography component="span" sx={{ fontSize: "1rem" }}>
              Players:{" "}
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: "1rem", fontWeight: "600" }}
            >
              {totalPlayers}
            </Typography>
          </Typography>
          <Typography>
            <Typography component="span" sx={{ fontSize: "1rem" }}>
              Created On:{" "}
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: "1rem", fontWeight: "600" }}
            >
              {formatTimestampToDate(timeCreated)}
            </Typography>
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ marginBottom: 1 }}>
        <HolographicButtonBlue onClick={handleButtonClick(gameId)}>
          Show
        </HolographicButtonBlue>
      </CardActions>
    </Card>
  );
}
