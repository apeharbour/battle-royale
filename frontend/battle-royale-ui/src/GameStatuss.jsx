import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import removeYachtBackground from "./RemoveYachtBackground";

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  height: "calc(100% - 64px)",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.5rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.paper,
  },
  textAlign: "left",
}));

export default function GameStatuss({ winner, playerState, gameId }) {
  const navigate = useNavigate();
  const { address } = useAccount();

  const isWinner =
    winner &&
    winner.address &&
    address &&
    address.toLowerCase() === winner.address.toLowerCase();

  return (
    <Card elevation={4} sx={{ overflow: "hidden" }}>
      <CardHeader
        title={isWinner ? "Game Over -> You Won!" : "Game Over -> You Lost!"}
        titleTypographyProps={{
          fontSize: "1.25rem",
          fontWeight: "600",
          color: isWinner ? "green" : "red",
        }}
      />
      <StyledCardContent>
        {winner ? (
          <>
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}>
                <Tooltip title={winner.address} arrow>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ cursor: "pointer" }}
                  >
                    Winner:{" "}
                    {winner.address
                      ? `${winner.address.slice(0, 4)}..${winner.address.slice(
                          -4
                        )}`
                      : "N/A"}
                  </Typography>
                </Tooltip>
              </Box>
              <Box
                component="img"
                src={removeYachtBackground(winner.image)}
                alt="Winner's ship"
                sx={{ maxWidth: "20%" }}
              />
            </Box>
            <Box flexGrow={1}>
              <Typography variant="h6" gutterBottom>
                Kills: {winner.kills}
              </Typography>
            </Box>
            <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center">
              <Button
                onClick={() => (window.location.href = `/cov/${gameId}`)}
              >
                Canvas of Victory
              </Button>
            </Box>
          </>
        ) : null}
      </StyledCardContent>
    </Card>
  );
}
