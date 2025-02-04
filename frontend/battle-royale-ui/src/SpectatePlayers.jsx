import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import removeYachtBackground from "./RemoveYachtBackground";

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
  return (
    <Card elevation={4} sx={{ height: "225px", overflow: "hidden" }}>
      <CardHeader
        title="Players"
        titleTypographyProps={{ fontSize: "1.25rem", fontWeight: "600" }}
        sx={{ backdropFilter: "brightness: 60%", opacity: 1 }}
      />
      <StyledCardContent>
        {ships &&
          ships.map((ship, shipIndex) => (
            <Box key={shipIndex} display="flex" alignItems="center" mb={2}>
              <Box
                component="img"
                src={removeYachtBackground(ship.image)}
                alt="ship image"
                sx={{
                  width: 70,
                  height: 55,
                  borderRadius: "10%",
                  marginRight: 5,
                }}
              />
              <Tooltip
                title={
                  <a
                    href={`https://basescan.org/address/${ship.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span>{ship.address}</span>
                    <OpenInNewIcon
                      sx={{ fontSize: "1rem", marginLeft: "4px" }}
                    />
                  </a>
                }
                disableInteractive={false} // Make tooltip interactive
              >
                <Typography sx={{ fontSize: "1rem", cursor: "pointer" }}>
                  {shortenAddress(ship.address)}
                </Typography>
              </Tooltip>
            </Box>
          ))}
      </StyledCardContent>
    </Card>
  );
}
