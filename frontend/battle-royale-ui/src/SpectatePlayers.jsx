import React from "react";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}..${address.slice(-4)}`;
};

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  height: "calc(100% - 64px)",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.5rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#000000",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#808080",
  },
}));

export default function SpectatePlayers({ ships }) {
  console.log("ships", ships);
  return (
    <Card elevation={4} sx={{ height: "225px", overflow: "hidden" }}>
      <CardHeader
        title="Leaderboard"
        sx={{ backdropFilter: "brightness: 60%", opacity: 1 }}
      />
      <StyledCardContent>
        {ships &&
          ships.map((ship, shipIndex) => (
            <Box key={shipIndex} display="flex" alignItems="center" mb={2}>
              <Box
                component="img"
                src={ship.image}
                alt="ship image"
                sx={{
                  width: 70,
                  height: 55,
                  borderRadius: "10%",
                  marginRight: 5,
                }}
              />
              <Typography variant="subtitle1">
                {shortenAddress(ship.address)}
              </Typography>
            </Box>
          ))}
      </StyledCardContent>
    </Card>
  );
}
