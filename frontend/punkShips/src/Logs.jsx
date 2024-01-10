// Logs.jsx

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useQuery, gql } from "@apollo/client";

const GET_GAME = gql`
  query getGame($gameId: Int!) {
    games(where: { gameId: $gameId }) {
      gameId
      state
      rounds {
        round
        shrunk
        moves {
          player {
            address
          }
          originQ
          originR
          destinationQ
          destinationR
        }
        shots {
          player {
            address
          }
          originQ
          originR
          destinationQ
          destinationR
        }
      }
    }
  }
`;

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

export default function ShipStatus(props) {
  const { loading, error, data } = useQuery(GET_GAME, {
    pollInterval: 5000,
    variables: { gameId: props.gameId, first: 1000, skip: 0 },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log("Data2:", data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <ShipPaper elevation={4}>
      <TopSection>
        <Typography variant="h6" color="black" sx={{ fontWeight: "700" }}>
          Log Book
        </Typography>
      </TopSection>
      <BottomSection
        sx={{ borderTopLeftRadius: "35px", borderTopRightRadius: "35px" }}
      >
         {data.games[0].rounds.map((round, roundIndex) => (
        <Box key={roundIndex}>
          <StatTypography variant="subtitle1">Round {round.round}</StatTypography>
          {round.moves.map((move, moveIndex) => (
            <StatTypography key={moveIndex} variant="body2">
              Move: {`${move.player.address.slice(0, 4)}..${move.player.address.slice(-2)}`} from [{move.originQ}, {move.originR}] to [{move.destinationQ}, {move.destinationR}]
            </StatTypography>
          ))}
          {round.shots.map((shot, shotIndex) => (
            <StatTypography key={shotIndex} variant="body2">
              Shot: {`${shot.player.address.slice(0, 4)}..${shot.player.address.slice(-2)}`} from [{shot.originQ}, {shot.originR}] to [{shot.destinationQ}, {shot.destinationR}]
            </StatTypography>
          ))}
        </Box>
      ))}
      </BottomSection>
    </ShipPaper>
  );
}
