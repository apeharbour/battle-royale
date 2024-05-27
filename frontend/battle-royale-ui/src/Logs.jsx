// Logs.jsx

import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { Hex, HexUtils } from "react-hexgrid";

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}..${address.slice(-4)}`;
};

const calculateDirectionDistance = (origin, destination) => {
  const distance = HexUtils.distance(
    { ...origin, s: (origin.q + origin.r) * -1 },
    { ...destination, s: (destination.q + destination.r) * -1 }
  );

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
  };

  return {
    direction,
    distance,
    prettyPrint: `${prettyPrintDirection(direction)} ${distance}`,
  };
};

export default function Logs({ rounds, ...props }) {
  return (
    <Card elevation={4} sx={{ height: '400px', overflow: 'hidden' }} >
      <CardHeader
        title="Logs"
        sx={{ backdropFilter: "brightness: 60%", opacity: 1 }}
      />
      <CardContent sx={{ height: 'calc(100% - 64px)', overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
        {rounds &&
          rounds.map((round, roundIndex) => (
            <Box key={roundIndex}>
              <Typography variant="subtitle1">Round {round.round}</Typography>
              {round.moves.map((move, moveIndex) => (
                <Box key={moveIndex} pl={2}>
                  <Typography variant="body2">
                    {shortenAddress(move.player.address)}
                  </Typography>
                  <Box pl={2}>
                    {move && move.travel && (
                      <Typography variant="body2">
                        Move: [{move.travel.originQ}, {move.travel.originR}] to
                        [{move.travel.destinationQ}, {move.travel.destinationR}]
                        ={" "}
                        {
                          calculateDirectionDistance(
                            { q: move.travel.originQ, r: move.travel.originR },
                            {
                              q: move.travel.destinationR,
                              r: move.travel.destinationR,
                            }
                          ).prettyPrint
                        }
                      </Typography>
                    )}
                    {move && move.shot && (
                      <Typography variant="body2">
                        Shot: [{move.shot.originQ}, {move.shot.originR}] to [
                        {move.shot.destinationQ}, {move.shot.destinationR}] ={" "}
                        {
                          calculateDirectionDistance(
                            { q: move.shot.originQ, r: move.shot.originR },
                            {
                              q: move.shot.destinationR,
                              r: move.shot.destinationR,
                            }
                          ).prettyPrint
                        }
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
      </CardContent>
    </Card>
  );
}
