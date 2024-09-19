import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import { HexGrid, Hexagon, Layout } from "react-hexgrid";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount, useBlockNumber } from "wagmi";
import BackdropComponent from "./Backdrop";
import "./MintShip.css";

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

const GET_GAMES = gql`
  query getGame($address: Bytes, $first: Int) {
    players(where: { address: $address }) {
      address
      state
      game {
        gameId
        radius
        totalPlayers
        timeCreated
        mapShrink
        state
        cells(first: $first) {
          q
          r
          island
        }
      }
    }
  }
`;

const registrationQuery = gql`
  query registrations {
    registrations {
      firstGameId
      phase
      state
      players {
        state
        gameId
        address
      }
    }
  }
`;

export default function ListGames(props) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const queryClient = useQueryClient();

  // State to control the visibility of the Backdrop
  const [loading, setLoading] = useState(false);
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);

  const useGameQuery = (select) =>
    useQuery({
      queryKey: ["players"],
      queryFn: async () =>
        request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_GAMES, {
          address: address,
          first: 1000,
        }),
      select,
    });

  const useGameData = () =>
    useGameQuery((data) =>
      data.players.filter((player) => player.game.state === "active")
    );

  const { data: gameData } = useGameData();

  const useRegistrationQuery = (select) =>
    useQuery({
      queryKey: ["registrations"],
      queryFn: async () =>
        request(
          import.meta.env.VITE_SUBGRAPH_URL_REGISTRATION,
          registrationQuery,
          {}
        ),
      select,
    });

  const useRegiState = () =>
    useRegistrationQuery((data) => {
      const openRegistrations = data.registrations.filter(
        (registration) => registration.state === "OPEN"
      );

      const hasRegisteredPlayer = openRegistrations.some((registration) =>
        registration.players.some((player) => {
          const isMatchingAddress =
            player.address.toLowerCase() === address.toLowerCase();
          const isRegistered = player.state === "REGISTERED";
          return isMatchingAddress && isRegistered;
        })
      );

      return hasRegisteredPlayer;
    });

  // Usage in your component
  const { data: hasRegisteredPlayer } = useRegiState();

  useEffect(() => {
    if (hasRegisteredPlayer) {
      setShowRegisteredMessage(true);
    }
  }, [hasRegisteredPlayer]);

  const handleButtonClick = (gameId) => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = `/${gameId}`;
    }, 1000);
  };

  const renderHexGrid = (cells) => (
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

  return (
    <Grid container spacing={2} p={4}>
      <BackdropComponent open={loading} />

      {showRegisteredMessage && (
        <Grid container justifyContent="center" alignItems="center" size={12}>
          <Grid item>
            <Box
              sx={{
                border: "1px solid green",
                borderRadius: "8px",
                padding: "16px",
                position: "relative",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                color="green"
                component="div"
                textAlign="center"
                sx={{ fontSize: "1rem" }}
              >
                You are registered for the game in the next phase!
              </Typography>
              <Typography
                sx={{ fontSize: "1rem" }}
                color="green"
                component="div"
                textAlign="center"
              >
                Wait for the registration to close to view your new game screen.
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  top: "-12px",
                  right: "16px",
                  padding: "0 8px",
                  fontWeight: "bold",
                  color: "green",
                  borderRadius: "4px",
                }}
              >
                NOTE
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
      {gameData &&
        gameData.map(({ game }, index) => {
          return (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Box mt={1}>
                <Card sx={{ maxWidth: "320px" }}>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="inherit"
                        sx={{ fontSize: "1rem", fontWeight: "600" }}
                      >
                        Game {game.gameId}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "1rem" }}
                        variant="inherit"
                        color="textSecondary"
                      >
                        {game.state}
                      </Typography>
                    </Box>
                    <Box ml={2}>{renderHexGrid(game.cells)}</Box>
                    <Box>
                      <Typography>
                        <Typography component="span" sx={{ fontSize: "1rem" }}>
                          Map Size:{" "}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ fontSize: "1rem", fontWeight: "600" }}
                        >
                          {game.radius} rings
                        </Typography>
                      </Typography>
                      {game.mapShrink && game.mapShrink === 1 && (
                        <Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "1rem" }}
                          >
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
                      {game.mapShrink && game.mapShrink > 1 && (
                        <Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "1rem" }}
                          >
                            Map Shrink:{" "}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "1rem", fontWeight: "600" }}
                          >
                            Every {game.mapShrink} rounds
                          </Typography>
                        </Typography>
                      )}
                      <Typography>
                        <Typography component="span" sx={{ fontSize: "1rem" }}>
                          Total Players:{" "}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ fontSize: "1rem", fontWeight: "600" }}
                        >
                          {game.totalPlayers}
                        </Typography>
                      </Typography>
                      <Typography>
                        <Typography component="span" sx={{ fontSize: "1rem" }}>
                          Game Created On:{" "}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ fontSize: "1rem", fontWeight: "600" }}
                        >
                          {formatTimestampToDate(game.timeCreated)}
                        </Typography>
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ marginBottom: 1 }}>
                    <HolographicButtonBlue
                      onClick={() => handleButtonClick(game.gameId)}
                      disabled={game.state !== "active"}
                    >
                      Show
                    </HolographicButtonBlue>
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          );
        })}
    </Grid>
  );
}
