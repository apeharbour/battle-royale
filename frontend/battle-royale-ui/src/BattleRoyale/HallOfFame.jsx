import React, { Fragment } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Tooltip,
  formControlClasses,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useQuery, useQueries } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount } from "wagmi";
import Backdrop from "./Backdrop";
import "./MintShip.css";
import { styled } from "@mui/material/styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import removeYachtBackground from "./RemoveYachtBackground";
import NotConnected from "./NotConnected";

const HolographicButtonYellow = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "12px 24px",
  color: "#FFD700",
  border: "1.6px solid #FFD700",
  textTransform: "none",
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
  query getGames {
    games {
      id
      gameId
      state
    }
  }
`;

const GET_WINNER = gql`
  query getWinner($gameId: BigInt!) {
    games(where: { gameId: $gameId }) {
      gameId
      totalPlayers
      timeCreated
      timeEnded
      players {
        address
        range
        shotRange
        state
        kills
        image
      }
    }
  }
`;

export default function HallOfFame(props) {
  const account = useAccount();

  const useGameQuery = (select) =>
    useQuery({
      queryKey: ["getGames"],
      queryFn: async () =>
        request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_GAMES, {}),
      select,
    });

  const useGameData = () =>
    useGameQuery((data) =>
      data.games.filter((game) => game.state === "finished")
    );

  const { data: gameData, isLoading, isError } = useGameData();

  const gameIds = gameData?.map((game) => game.gameId) || [];

  const winnerQueries = useQueries({
    queries: gameIds.map((gameId) => ({
      queryKey: ["getWinner", gameId],
      queryFn: async () =>
        request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_WINNER, { gameId }),
      enabled: !!gameId,
    })),
  });

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}..${address.slice(-4)}`;
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

  if (isLoading || winnerQueries.some((query) => query.isLoading)) {
    return <Backdrop open={true} />;
  }

  if (isError || winnerQueries.some((query) => query.isError)) {
    return <Backdrop open={true} />;
  }

  return (
    <Fragment>
      {account?.address ? (
        <Grid container spacing={2} p={4}>
          {gameData &&
            gameData.map((game, index) => {
              const winnerGameData = winnerQueries[index]?.data?.games[0];
              const winnerData = winnerGameData?.players?.find(
                (player) => player.state === "won"
              );
              return (
                <Fragment key={game.gameId}>
                  {winnerData && (
                    <Grid item size={{ xs: 12, md: 3 }} key={game.gameId}>
                      <Box mt={1}>
                        <Card
                          sx={{
                            maxWidth: "300px",
                          }}
                        >
                          <CardContent sx={{ padding: "16px" }}>
                            <Typography
                              variant="inherit"
                              sx={{ fontSize: "1.25rem", fontWeight: "600" }}
                            >
                              game {game.gameId}
                            </Typography>
                            <Box
                              component="img"
                              src={removeYachtBackground(winnerData.image)}
                              alt={winnerData.address}
                              sx={{
                                maxWidth: "70%",
                                height: "auto",
                              }}
                            />
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                flexWrap: "wrap",
                                textAlign: "left",
                              }}
                            >
                              <Typography
                                component="span"
                                sx={{ fontSize: "1rem" }}
                              >
                                winner:{" "}
                                <Tooltip
                                  title={
                                    <a
                                      href={`https://curtis.explorer.caldera.xyz/address/${winnerData.address}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: "inherit",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span>{winnerData.address}</span>
                                      <OpenInNewIcon
                                        sx={{
                                          fontSize: "1rem",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    </a>
                                  }
                                  disableInteractive={false}
                                >
                                  <Typography
                                    component="span"
                                    sx={{ fontSize: "1rem", cursor: "pointer" }}
                                  >
                                    {shortenAddress(winnerData.address)}
                                  </Typography>
                                </Tooltip>
                              </Typography>
                              <Typography sx={{ fontSize: "1rem" }}>
                                kills:{" "}
                                <Typography
                                  component="span"
                                  sx={{
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    display: "inline",
                                  }}
                                >
                                  {winnerData.kills}
                                </Typography>
                              </Typography>

                              <Typography sx={{ fontSize: "1rem" }}>
                                players:{" "}
                                <Typography
                                  component="span"
                                  sx={{
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    display: "inline",
                                  }}
                                >
                                  {winnerGameData.totalPlayers}
                                </Typography>
                              </Typography>

                              <Typography sx={{ fontSize: "1rem" }}>
                                created:{" "}
                                <Typography
                                  component="span"
                                  sx={{
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    display: "inline",
                                  }}
                                >
                                  {formatTimestampToDate(
                                    winnerGameData.timeCreated
                                  )}
                                </Typography>
                              </Typography>

                              <Typography sx={{ fontSize: "1rem" }}>
                                ended:{" "}
                                <Typography
                                  component="span"
                                  sx={{
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    display: "inline",
                                  }}
                                >
                                  {formatTimestampToDate(
                                    winnerGameData.timeEnded
                                  )}
                                </Typography>
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ marginBottom: 1 }}>
                            <HolographicButtonYellow
                              onClick={() =>
                                (window.location.href = `/cov/${game.gameId}`)
                              }
                            >
                              canvas of victory
                            </HolographicButtonYellow>
                          </CardActions>
                        </Card>
                      </Box>
                    </Grid>
                  )}
                </Fragment>
              );
            })}
        </Grid>
      ) : (
        <NotConnected />
      )}
    </Fragment>
  );
}
