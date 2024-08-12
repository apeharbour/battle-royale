import React from "react";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
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
    textAlign: "center",
}));

export default function GameInfo({ round, gameId, mapShrink }) {

    return (
        <Card elevation={4} sx={{ overflow: "hidden" }}>
            
            <StyledCardContent>
                <Typography variant="h5"> Game {gameId} </Typography>
                <Typography variant="h5"> Round {round} </Typography>
                {mapShrink && mapShrink === 1 && (
                <Typography variant="h5">
                    Map will shrink every round
                </Typography>
                )}
                {mapShrink && mapShrink !== 1 && (
                <Typography variant="h5">
                    Map will shrink every {mapShrink} rounds
                </Typography>
                )}
            </StyledCardContent>
        </Card>
    );
}
