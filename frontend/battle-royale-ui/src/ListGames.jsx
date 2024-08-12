import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Grid,
  Tooltip
} from "@mui/material";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from 'graphql-request';
import { useAccount, useBlockNumber } from "wagmi";
import BackdropComponent from "./Backdrop";

const GET_GAMES = gql`
query getGame($address: Bytes) {
  players(where: {address: $address}) {
    address
    state
    game {
      gameId
      state
    }
  }
}
`;

const registrationQuery = gql`
query registrations {
  registrations {
    firstGameId
    phase
    state
    players{state, gameId, address}
  }
}
`;

export default function ListGames(props) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const queryClient = useQueryClient();

  // State to control the visibility of the Backdrop
  const [loading, setLoading] = useState(false);

  const useGameQuery = (select) => useQuery({
    queryKey: ["players"],
    queryFn: async () => request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_GAMES, {
      address: address,
    }),
    select,
  });

  const useGameData = () => useGameQuery((data) => data.players.filter(player => player.game.state === "active"));

  const { data: gameData } = useGameData();

  const useRegistrationQuery = (select) => useQuery({
    queryKey: ["registrations"],
    queryFn: async () => request(import.meta.env.VITE_SUBGRAPH_URL_REGISTRATION, registrationQuery, {}),
    select,
  });

  const useRegiState = () => useRegistrationQuery((data) => {
  
    const openRegistrations = data.registrations.filter(registration => registration.state === "OPEN");
  
    const hasRegisteredPlayer = openRegistrations.some(registration => 
      registration.players.some(player => {
        const isMatchingAddress = player.address.toLowerCase() === address.toLowerCase();
        const isRegistered = player.state === "REGISTERED";
        return isMatchingAddress && isRegistered;
      })
    );
  
    return hasRegisteredPlayer;
  });
  
  // Usage in your component
  const { data: hasRegisteredPlayer } = useRegiState();

  const handleButtonClick = (gameId) => {
    // Show the backdrop
    setLoading(true);
    // Simulate an action that takes time, then navigate to the game screen
    setTimeout(() => {
      // Your navigation logic here
      window.location.href = `/${gameId}`; // Navigate to the game page
    }, 2000); // Simulate a 2 second delay
  };

  return (
    <Grid container spacing={2} p={4}>
      {/* Backdrop Component */}
      <BackdropComponent open={loading} />

      {hasRegisteredPlayer && (
       <Grid container justifyContent="center" alignItems="center">
       <Grid item xs={12} md={6}>
         <Box 
           sx={{ 
             border: '1px solid green', 
             borderRadius: '8px', 
             padding: '16px', 
             position: 'relative',
             boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
           }}
         >
           <Typography 
             variant="h5" 
             color='green' 
             component="div" 
             textAlign="center"
           >
             You are registered for the game in the next phase!
           </Typography>
           <Typography 
             variant="h5" 
             color='green' 
             component="div" 
             textAlign="center"
           >
             Wait for the registration to close to view your new game screen.
           </Typography>
           <Box 
             sx={{ 
               position: 'absolute', 
               top: '-10px', 
               right: '16px', 
               backgroundColor: 'white', 
               padding: '0 8px', 
               fontWeight: 'bold',
               color: 'green',
               borderRadius: '4px'
             }}
           >
             NOTE
           </Box>
         </Box>
       </Grid>
     </Grid>
      )}
      {gameData && gameData.map(({ game, address, state }, index) => {
        let hoverMessage;
        if (state === "active") {
          hoverMessage = `You are active in game with ${game.gameId}`;
        } else if (state === "won") {
          hoverMessage = `You won the game with game ${game.gameId}`;
        } else if (state === "beached") {
          hoverMessage = `You were beached. Try again next time!`;
        } else if (state === "dropped") {
          hoverMessage = `You lost the game with game ${game.gameId}, due to dropping out of the map!`;
        } else if (state === "crashed") {
          hoverMessage = `You lost the game with game ${game.gameId}, due to crashing into an island!`;
        } else if (state === "shot") {
          hoverMessage = `You lost the game with game ${game.gameId}, due to being shot down!`;
        } else if (state === "draw") {
          hoverMessage = `It was a draw in game ${game.gameId}!, try again!`;
        }

        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Tooltip title={hoverMessage}>
              <Box mt={1}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h5" component="div">
                        Game {game.gameId}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {game.state}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      onClick={() => handleButtonClick(game.gameId)}
                      disabled={game.state !== "active"}
                    >
                      Show
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Tooltip>
          </Grid>
        );
      })}
    </Grid>
  );
}
