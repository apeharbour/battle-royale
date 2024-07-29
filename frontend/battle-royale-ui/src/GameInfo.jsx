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

export default function GameInfo({ round, gameId }) {

    const shrinkInterval = 3;
    const nextShrinkRound = Math.ceil(round / shrinkInterval) * shrinkInterval;
    const roundsToShrink = nextShrinkRound - round;

    return (
        <Card elevation={4} sx={{ height: "200px", overflow: "hidden" }}>
            <CardHeader
                title="Game Info"
                sx={{ backdropFilter: "brightness: 60%", opacity: 1 }}
            />
            <StyledCardContent>
                <Typography variant="h5"> Game {gameId} </Typography>
                <Typography variant="h5"> Round {round} </Typography>
                <Typography variant="h5" sx={{ color: roundsToShrink === 1 ? 'red' : 'inherit' }}>
                    {roundsToShrink === 1 ? 'Last round before shrink' : `Shrink in ${roundsToShrink} rounds`}
                </Typography>
            </StyledCardContent>
        </Card>
    );
}
