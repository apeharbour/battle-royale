// Logs.jsx

import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Hex, HexUtils } from "react-hexgrid";

const ShipPaper = styled(Paper)({
  maxWidth: "240px",
  maxHeight: "400px",
  borderRadius: "30px",
  overflow: "hidden",
  margin: "auto auto 40px auto",
  backgroundColor: "rgba(195, 208, 243, 0.5)",
  position: "relative", // Add position relative

  "&:before": {
    // Add before pseudo-element
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "10px", // Adjust as needed
    background:
      "linear-gradient(to right, rgba(255,255,255,0), rgba(195, 208, 243, 0.5))",
  },
});

const TopSection = styled("div")({
  backgroundColor: "rgba(195, 208, 243, 0.5)",
  padding: "16px",
});

const BottomSection = styled("div")({
  backgroundColor: "rgba(215, 227, 249, 0.5)",
  padding: "16px",
  maxHeight: "340px", // Adjust as needed
  overflowY: "auto",

  // Hiding the scrollbar (for Webkit/Blink browsers)
  "&::-webkit-scrollbar": {
    display: "none",
  },
});

const StatTypography = styled(Typography)({
  margin: "8px 0",
});

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}..${address.slice(-4)}`;
};

const calculateDirectionDistance = (origin, destination) => {

    const distance = HexUtils.distance({...origin, s: (origin.q + origin.r) * -1}, {...destination, s: (destination.q + destination.r) * -1});


    const deltaQ = destination.q - origin.q;
    const deltaR = destination.r - origin.r;

    // Normalize the deltas to -1, 0, or 1
    const sign = (num) => (num === 0 ? 0 : num > 0 ? 1 : -1);
    const normDeltaQ = sign(deltaQ);
    const normDeltaR = sign(deltaR);
    let direction = 0;

    if (normDeltaQ === 1 && normDeltaR === 0) direction = 0;
    if (normDeltaQ === 1 && normDeltaR === -1) direction = 1;
    if (normDeltaQ === 0 && normDeltaR === -1) direction = 2;
    if (normDeltaQ === -1 && normDeltaR === 0) direction = 3;
    if (normDeltaQ === -1 && normDeltaR === 1) direction = 4;
    if (normDeltaQ === 0 && normDeltaR === 1) direction = 5;
    // return 6;
  // };

  // origin.s = -origin.q - origin.r;
  // destination.s = -destination.q - destination.r;
  // const qDiff = destination.q - origin.q;
  // const rDiff = destination.r - origin.r;
  // const sDiff = destination.s - origin.s;
  // const distance = (Math.abs(qDiff) + Math.abs(rDiff) + Math.abs(sDiff)) / 2;

  // let direction = 0;
  // if (qDiff === 0 && rDiff === 0) {
  //   direction = 0;
  // } else if (qDiff === 0 && sDiff === 0) {
  //   direction = 1;
  // } else if (rDiff === 0 && sDiff === 0) {
  //   direction = 2;
  // } else if (qDiff === 0 && rDiff > 0 && sDiff < 0) {
  //   direction = 3;
  // } else if (qDiff > 0 && rDiff === 0 && sDiff < 0) {
  //   direction = 4;
  // } else if (qDiff < 0 && rDiff > 0 && sDiff === 0) {
  //   direction = 5;
  // }

  const prettyPrintDirection = (direction) => {
    switch (direction) {
      case 0:
        return "E";
      case 1:
        return "NE";
      case 2:
        return "NW";
      case 3:
        return "W";
      case 4:
        return "SW";
      case 5:
        return "SE";
      default:
        return "N/A";
    }
  } 

  return { direction, distance, prettyPrint: `${prettyPrintDirection(direction)} ${distance}` };
}

export default function Logs({ gameData: data, ...props }) {

  !!data ? console.log(data) : console.log('No data');
  return (
    <>
      {/* <Card elevation={20}>
        <CardHeader>
          <Typography variant="h6">Log Book</Typography>
        </CardHeader>
        <CardContent>
          {data.games[0].rounds.map((round, roundIndex) => (
            <Box key={roundIndex}>
              <Typography variant="subtitle1">Round {round.round}</Typography>
              {round.moves.map((move, moveIndex) => (
                <>
                  <Typography key={`${moveIndex}-m`} variant="body2">
                    Move: {shortenAddress(move.player.address)} from [
                    {move.travel.originQ}, {move.travel.originR}] to [
                    {move.travel.destinationQ}, {move.travel.destinationR}]
                  </Typography>
                  <Typography key={`${moveIndex}-t`} variant="body2">
                    Shot: {shortenAddress(move.player.address)} from [
                    {move.shot.originQ}, {move.shot.originR}] to [
                    {move.shot.destinationQ}, {move.shot.destinationR}]
                  </Typography>
                </>
              ))}
            </Box>
          ))}
        </CardContent>
      </Card> */}

        <Card elevation={4}>
          <CardHeader title="Logs" sx={{backdropFilter: 'brightness: 60%', opacity: 1}} />
          <CardContent>
            {data.games[0].rounds.map((round, roundIndex) => (
              <Box key={roundIndex}>
                <Typography variant="subtitle1">Round {round.round}</Typography>
                {round.moves.map((move, moveIndex) => (
                  <Box key={moveIndex} pl={2}>
                    <Typography variant="body2">{shortenAddress(move.player.address)}</Typography>
                    <Box pl={2}>
                    {move && move.travel &&
                    <Typography variant="body2">
                      Move: [{move.travel.originQ}, {move.travel.originR}] to [{move.travel.destinationQ}, {move.travel.destinationR}] = {calculateDirectionDistance({q: move.travel.originQ, r: move.travel.originR}, {q: move.travel.destinationR, r: move.travel.destinationR}).prettyPrint}
                    </Typography>
}
                    {move && move.shot && 
                    <Typography variant="body2">
                      Shot: [{move.shot.originQ}, {move.shot.originR}] to [{move.shot.destinationQ}, {move.shot.destinationR}] = {calculateDirectionDistance({q: move.shot.originQ, r: move.shot.originR}, {q: move.shot.destinationR, r: move.shot.destinationR}).prettyPrint}
                    </Typography> }
                  </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </CardContent>
        </Card>
    </>

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
