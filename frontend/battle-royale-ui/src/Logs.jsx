// Logs.jsx

import React from "react";
import { Box, Card, CardContent, CardHeader, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";


const ShipPaper = styled(Paper)({
    maxWidth: "240px",
    maxHeight: "400px",
    borderRadius: "30px",
    overflow: "hidden",
    margin: "auto auto 40px auto",
    backgroundColor: "rgba(195, 208, 243, 0.5)",
    position: 'relative', // Add position relative
  
    '&:before': { // Add before pseudo-element
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '10px', // Adjust as needed
      background: 'linear-gradient(to right, rgba(255,255,255,0), rgba(195, 208, 243, 0.5))',
    }
  });

const TopSection = styled("div")({
  backgroundColor: "rgba(195, 208, 243, 0.5)",
  padding: "16px",
});

const BottomSection = styled("div")({
    backgroundColor: "rgba(215, 227, 249, 0.5)",
    padding: "16px",
    maxHeight: '340px', // Adjust as needed
    overflowY: 'auto',
  
    // Hiding the scrollbar (for Webkit/Blink browsers)
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  });

const StatTypography = styled(Typography)({
  margin: "8px 0",
});

const shortenAddress = (address) => {
  return `${address.slice(0, 4)}..${address.slice(-2)}`;
}


export default function Logs({gameData: dat a, ...props}) {
  return (
    <Paper elevation={4}>
      <Card>
        <CardHeader>
          <Typography variant="h6">Log Book</Typography>
        </CardHeader>
        <CardContent>
          {data.games[0].rounds.map((round, roundIndex) => (
        <Box key={roundIndex}>
          <Typography variant="subtitle1">Round {round.round}</Typography>
          {round.moves.map((move, moveIndex) => (
            <Typography key={moveIndex} variant="body2">
              Move: {shortenAddress(move.player.address)} from [{move.originQ}, {move.originR}] to [{move.destinationQ}, {move.destinationR}]
            </Typography>
          ))}
          {round.shots.map((shot, shotIndex) => (
            <Typography key={shotIndex} variant="body2">
              Shot: {shortenAddress(shot.player.address)} from [{shot.originQ}, {shot.originR}] to [{shot.destinationQ}, {shot.destinationR}]
            </Typography>
          ))}
        </Box>
    ))}


        </CardContent>
      </Card>
    </Paper>
    // <ShipPaper elevation={4}>
    //   <TopSection>
    //     <Typography variant="h6" color="black" sx={{ fontWeight: "700" }}>
    //       Log Book
    //     </Typography>
    //   </TopSection>
    //   <BottomSection
    //     sx={{ borderTopLeftRadius: "35px", borderTopRightRadius: "35px" }}
    //   >
    //      {data.games[0].rounds.map((round, roundIndex) => (
    //     <Box key={roundIndex}>
    //       <StatTypography variant="subtitle1">Round {round.round}</StatTypography>
    //       {round.moves.map((move, moveIndex) => (
    //         <StatTypography key={moveIndex} variant="body2">
    //           Move: {`${move.player.address.slice(0, 4)}..${move.player.address.slice(-2)}`} from [{move.originQ}, {move.originR}] to [{move.destinationQ}, {move.destinationR}]
    //         </StatTypography>
    //       ))}
    //       {round.shots.map((shot, shotIndex) => (
    //         <StatTypography key={shotIndex} variant="body2">
    //           Shot: {`${shot.player.address.slice(0, 4)}..${shot.player.address.slice(-2)}`} from [{shot.originQ}, {shot.originR}] to [{shot.destinationQ}, {shot.destinationR}]
    //         </StatTypography>
    //       ))}
    //     </Box>
    //   ))}
    //   </BottomSection>
    // </ShipPaper>
  );
}
