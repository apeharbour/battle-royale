import React from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
  } from "@mui/material";

export default function ActiveShip({ ship, handleCardClick, selectedYacht }) {
    return (
        <Card
                sx={{
                  border: selectedYacht === ship ? "2px solid blue" : "none",
                  opacity: ship.burned ? 0.5 : 1,
                  cursor: ship.burned ? "not-allowed" : "pointer",
                }}
                onClick={() => handleCardClick(ship)}
              >
                <CardMedia
                  component="img"
                  alt={ship.name}
                  image={ship.image}
                  title={ship.name}
                  sx={{ height: 140, objectFit: "contain" }}
                />
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {ship.name} {ship.tokenId}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Chip
                      label={`Movement: ${ship.movement}`}
                      sx={{
                        height: "32px",
                        minWidth: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                    <Chip
                      label={`Shoot: ${ship.shoot}`}
                      sx={{
                        height: "32px",
                        minWidth: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
    );
}