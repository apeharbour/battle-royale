import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
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

export default function GameInfo({ round, gameId, mapShrink }) {
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

  return (
    <Card elevation={4} sx={{ overflow: "hidden" }}>
      <StyledCardContent>
        <Typography sx={{ fontSize: "1rem" }}>Game {gameId}</Typography>
        <Typography sx={{ fontSize: "1rem" }}>Round: {round}</Typography>
        {shrinkMessage()}
      </StyledCardContent>
    </Card>
  );
}
