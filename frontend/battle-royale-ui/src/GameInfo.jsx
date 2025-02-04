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
  const roundsUntilShrink = mapShrink - (round % mapShrink);

  const shrinkMessage = () => {
    if (roundsUntilShrink === mapShrink) {
      return (
        <Typography sx={{ fontSize: "1rem" }} color="error">
          Shrink after world updates
        </Typography>
      );
    } else {
      return (
        <Typography sx={{ fontSize: "1rem" }}>
          Shrinking in {roundsUntilShrink}{" "}
          {roundsUntilShrink === 1 ? "round" : "rounds"}
        </Typography>
      );
    }
  };

  // Decide what to show: the shrink message or "Game Over"
  const content = gameState === "finished" ? (
    <Typography sx={{ fontSize: "1rem" }} color="error">
      Game Over
    </Typography>
  ) : (
    shrinkMessage()
  );

  return (
    <Card elevation={4} sx={{ overflow: "hidden" }}>
      <CardHeader
        title={`Game ${gameId}`}
        titleTypographyProps={{ fontSize: "1.25rem", fontWeight: "600" }}
      />
      <StyledCardContent>
        <Typography sx={{ fontSize: "1rem" }}>Round: {round}</Typography>
        {content}
      </StyledCardContent>
    </Card>
  );
}
