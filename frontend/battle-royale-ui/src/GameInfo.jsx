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
    const roundsUntilShrink = mapShrink - (round % mapShrink);
    const nextShrinkRound = round + roundsUntilShrink;

    const shrinkMessage = () => {
        if (roundsUntilShrink === 1) {
            return (
                <Typography variant="h5" color="error">
                    1 round to shrink
                </Typography>
            );
        } else {
            return (
                <Typography variant="h5">
                    {roundsUntilShrink} rounds to shrink
                </Typography>
            );
        }
    };

    return (
        <Card elevation={4} sx={{ overflow: "hidden" }}>
            <StyledCardContent sx={{textAlign: "left"}}>
                <Typography variant="h5">Game {gameId}</Typography>
                <Typography variant="h5">Round: {round}</Typography>
                {shrinkMessage()}
            </StyledCardContent>
        </Card>
    );
}
