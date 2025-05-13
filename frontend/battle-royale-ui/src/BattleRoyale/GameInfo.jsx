import React from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

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

export default function GameInfo({ round, gameId, mapShrink, gameState }) {
  const maxShrinks = 6;
  // Subtract 1 so that shrink count starts at 0 in round 1
  const currentShrinkCount = Math.floor((round - 1) / mapShrink);
  // Calculate the round when the next shrink will occur
  const nextShrinkRound = (currentShrinkCount + 1) * mapShrink + 1;
  const roundsUntilShrink = nextShrinkRound - round;

  const shrinkMessage = () => {
    if (currentShrinkCount >= maxShrinks) {
      return (
        <Typography sx={{ fontSize: "1rem", textAlign: "left" }} color="error">
          no more shrinking
        </Typography>
      );
    }
    // When only 1 round remains until the next shrink, show the update message
    if (roundsUntilShrink === 1) {
      return (
        <Typography sx={{ fontSize: "1rem", textAlign: "left" }} color="error">
          shrink after world updates
        </Typography>
      );
    } else {
      return (
        <Typography sx={{ fontSize: "1rem", textAlign: "left" }}>
          shrinking in {roundsUntilShrink}{" "}
          {roundsUntilShrink === 1 ? "round" : "rounds"}
        </Typography>
      );
    }
  };

  const content =
    gameState === "finished" ? (
      <Typography sx={{ fontSize: "1rem" }} color="error">
        game over
      </Typography>
    ) : (
      shrinkMessage()
    );

  return (
    <Card elevation={4} sx={{ overflow: "hidden" }}>
      <CardHeader
        title={`game ${gameId}`}
        titleTypographyProps={{ fontSize: "1.25rem", fontWeight: "600" }}
      />
      <StyledCardContent>
        <Typography sx={{ fontSize: "1rem" }}>round: {round}</Typography>
        {content}
      </StyledCardContent>
    </Card>
  );
}
