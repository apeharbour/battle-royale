import React, { useState, useEffect, Fragment } from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
} from "@mui/material";
import Timer from "./Timer";

import GameAbi from "./abis/Gameyarts.json";
import RegistrationAbi from "./abis/Registrationyarts.json";
import YartsAbi from "./abis/Yarts.json";

// Constants
const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const YARTS_ADDRESS = import.meta.env.VITE_YARTS_ADDRESS;
const REGISTRATION_ABI = RegistrationAbi;
const GAME_ABI = GameAbi.abi;
const YARTS_ABI = YartsAbi.abi;

const GAME_ID = 1;
const MAX_PLAYERS_PER_GAME = 9;
const RADIUS = 7;
const MAX_RETRIES = 10;
const RETRY_DELAY = 3000; 
const SUBGRAPH_POLLING_INTERVAL = 1000; // 1 second

// GraphQL Query
const registrationQuery = gql`
  query registrations {
    registrations {
      firstGameId
      phase
      state
      players {
        address
        yartsshipId
        state
        gameId
      }
    }
  }
`;

// Utility Functions
const shortenAddress = (address) => {
  return `${address.slice(0, 6)}..${address.slice(-4)}`;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Custom Hooks
const useRegistrationsQuery = (select) => {
  return useQuery({
    queryKey: ["registrations"],
    queryFn: async () =>
      request(
        import.meta.env.VITE_SUBGRAPH_URL_REGISTRATION,
        registrationQuery
      ),
    select,
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: SUBGRAPH_POLLING_INTERVAL,
    refetchOnWindowFocus: "always",
  });
};

const useRegistrations = (state) =>
  useRegistrationsQuery((data) =>
    data.registrations.filter((r) => r.state === state)
  );

const useRegistrationsPhase = (state) =>
  useRegistrationsQuery((data) => {
    const filteredByState = data.registrations.filter((r) => r.state === state);
    const highestPhase = Math.max(
      ...filteredByState.map((r) => parseInt(r.phase, 10))
    );
    const highestPhaseGameIds = filteredByState
      .filter((r) => parseInt(r.phase, 10) === highestPhase)
      .map((r) => r.firstGameId);
    return {
      highestPhase,
      highestPhaseGameIds,
      fullData: filteredByState,
    };
  });

class RegistrationState {
  static OPEN = "OPEN";
  static CLOSED = "CLOSED";
}

export default function Admin(props) {
  // State
  const [testGameId, setTestGameId] = useState("");
  const [testGameRadius, setTestGameRadius] = useState("");
  const [updateWorldTestId, setUpdateWorldTestId] = useState("");
  const [mapShrink, setMapShrink] = useState(3);
  const [isClosingRegistration, setIsClosingRegistration] = useState(false);
  const [lastProcessedPhase, setLastProcessedPhase] = useState(-1);
  const [processingError, setProcessingError] = useState(null);
  const [processedTransactions] = useState(new Set());
  const [gameIdEventBridge, setGameIdEventBridge] = useState(null);
  const [mintAddress, setMintAddress] = useState(null);
  const [mintAmount, setMintAmount] = useState(null);

  // Hooks
  const { data: closedRegistrations } = useRegistrations(
    RegistrationState.CLOSED
  );
  const { data: openRegistrations } = useRegistrations(RegistrationState.OPEN);
  const {
    data: registrationData,
    refetch: refetchRegistrationsData,
    isLoading: isRegistrationDataLoading,
  } = useRegistrationsPhase(RegistrationState.CLOSED);

  const account = useAccount();

  const {
    writeContract,
    data: hash,
    isPending: isTxPending,
    isSuccess: isTxSuccess,
    isError: isTxError,
    error: txError,
  } = useWriteContract();

  const {
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    data: txData,
  } = useWaitForTransactionReceipt({ hash });

  // Helper Functions
  const hasNewRegistrationData = (newData, lastPhase) => {
    if (!newData?.fullData?.length) return false;
    const currentHighestPhase = Math.max(
      ...newData.fullData.map((r) => parseInt(r.phase, 10))
    );
    return currentHighestPhase > lastPhase;
  };

  const fetchRegistrationDataWithRetries = async (lastPhase) => {
    for (let i = 0; i < MAX_RETRIES; i++) {
      console.log(
        `Attempt ${i + 1}/${MAX_RETRIES} to fetch updated registration data`
      );

      const newData = await refetchRegistrationsData();

      if (hasNewRegistrationData(newData.data, lastPhase)) {
        console.log("Found new registration data:", newData.data);
        return newData.data;
      }

      console.log(`No new data found, waiting ${RETRY_DELAY}ms before retry`);
      await wait(RETRY_DELAY);
    }
    throw new Error(
      "Failed to get updated registration data after maximum retries"
    );
  };

  const triggerLambdaFunction = async (gameId) => {
    const apiEndpoint =
      "https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/afterGameCreated";
    const postData = {
      gameId: gameId.toString(),
      scheduleRate: "3 minutes",
    };

    try {
      console.log(`Triggering Lambda for Game ID: ${gameId}`, postData);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(
          `Lambda API call failed with status: ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log(`Lambda response for Game ID ${gameId}:`, responseData);
      return true;
    } catch (error) {
      console.error(`Lambda error for Game ID ${gameId}:`, error);
      return false;
    }
  };

  // Contract Interaction Functions
  const startRegistration = async () => {
    try {
      await writeContract({
        abi: REGISTRATION_ABI,
        address: REGISTRATION_ADDRESS,
        functionName: "startRegistration",
      });
    } catch (error) {
      console.error("Error starting registration:", error);
      setProcessingError(error.message);
    }
  };

  const closeRegistration = async () => {
    try {
      setIsClosingRegistration(true);
      setProcessingError(null);

      await writeContract({
        abi: REGISTRATION_ABI,
        address: REGISTRATION_ADDRESS,
        functionName: "closeRegistration",
        args: [MAX_PLAYERS_PER_GAME, RADIUS, mapShrink],
      });

      console.log("Closing registration with params:", {
        maxPlayers: MAX_PLAYERS_PER_GAME,
        radius: RADIUS,
        mapShrink,
      });
    } catch (error) {
      console.error("Error closing registration:", error);
      setProcessingError(error.message);
      setIsClosingRegistration(false);
    }
  };

  const safeMint = async () => {
    try {
      await writeContract({
        abi: YARTS_ABI,
        address: YARTS_ADDRESS,
        functionName: "safeMint",
        args: [mintAddress, mintAmount],
      });
    } catch (error) {
      console.error("Error minting Yarts:", error);
      setProcessingError(error.message);
    }
  };

  const startTestGame = async () => {
    try {
      await writeContract({
        abi: GAME_ABI,
        address: GAME_ADDRESS,
        functionName: "startNewGame",
        args: [testGameId, testGameRadius],
      });
    } catch (error) {
      console.error("Error starting test game:", error);
      setProcessingError(error.message);
    }
  };

  const endTestGame = async () => {
    try {
      await writeContract({
        abi: GAME_ABI,
        address: GAME_ADDRESS,
        functionName: "endGame",
        args: [testGameId],
      });
    } catch (error) {
      console.error("Error ending test game:", error);
      setProcessingError(error.message);
    }
  };

  const updateWorldTest = async () => {
    try {
      await writeContract({
        abi: GAME_ABI,
        address: GAME_ADDRESS,
        functionName: "updateWorld",
        args: [updateWorldTestId],
      });
    } catch (error) {
      console.error("Error updating world:", error);
      setProcessingError(error.message);
    }
  };

// Replace the existing transaction confirmation effect with this updated version
useEffect(() => {
  const handleTransactionConfirmed = async () => {
    if (!isTxConfirmed || !hash || !isClosingRegistration) return;
    
    // Check if we've already processed this transaction
    if (processedTransactions.has(hash)) {
      console.log("Transaction already processed:", hash);
      return;
    }

    console.log("Close Registration transaction confirmed:", hash);
    
    try {
      // Get current phase before fetching new data
      const currentPhase = registrationData?.highestPhase ?? -1;
      console.log("Current phase before fetching new data:", currentPhase);

      // Wait for and fetch new registration data
      const newData = await fetchRegistrationDataWithRetries(currentPhase);
      
      if (newData?.highestPhaseGameIds?.length) {
        console.log("Processing game IDs:", newData.highestPhaseGameIds);
        
        const results = await Promise.all(
          newData.highestPhaseGameIds.map(gameId => triggerLambdaFunction(gameId))
        );

        const successCount = results.filter(Boolean).length;
        console.log(`Successfully processed ${successCount} of ${results.length} games`);

        // Update last processed phase
        const newPhase = Math.max(...newData.fullData.map(r => parseInt(r.phase, 10)));
        setLastProcessedPhase(newPhase);
        
        if (successCount < results.length) {
          setProcessingError("Some Lambda functions failed to process");
        }
        
        // Add transaction to processed set
        processedTransactions.add(hash);
      } else {
        console.log("No new game IDs to process");
      }
    } catch (error) {
      console.error("Error processing registration closure:", error);
      setProcessingError(error.message);
    } finally {
      setIsClosingRegistration(false);
    }
  };

  handleTransactionConfirmed();
}, [isTxConfirmed, hash, isClosingRegistration, registrationData]);

  // Effect for handling transaction errors
  useEffect(() => {
    if (isTxError && txError) {
      console.error("Transaction error:", txError);
      setProcessingError(txError.message);
      setIsClosingRegistration(false);
    }
  }, [isTxError, txError]);

  const renderTransactionStatus = () => {
    if (processingError)
      return <Typography color="error">Error: {processingError}</Typography>;
    if (isTxPending)
      return <Typography color="primary">Transaction pending...</Typography>;
    if (isTxConfirming)
      return (
        <Typography color="secondary">Transaction confirming...</Typography>
      );
    if (isTxConfirmed)
      return <Typography color="success">Transaction confirmed!</Typography>;
    if (isRegistrationDataLoading)
      return <Typography>Loading registration data...</Typography>;
    return null;
  };

  return (
    <Fragment>
      <Box mt={2}>
        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            color="success"
            onClick={startRegistration}
          >
            Start Registration
          </Button>
          <Button variant="contained" onClick={closeRegistration} color="error">
            Stop Registration
          </Button>
          <TextField
            variant="outlined"
            value={mapShrink}
            label="Map Shrink"
            onChange={(e) => setMapShrink(e.target.value)}
          />
           <TextField
            variant="outlined"
            value={gameIdEventBridge}
            label="Event Bridge"
            onChange={(e) => setGameIdEventBridge(e.target.value)}
          />
        </Stack>
        <Button variant="contained" onClick={()=> {triggerLambdaFunction(gameIdEventBridge)}}>
            Event Bridge
          </Button>
      </Box>
      <Box mt={5}>
        <Stack spacing={2} direction="row">
          <TextField
            variant="outlined"
            value={mintAddress}
            label="Mint Address"
            onChange={(e) => setMintAddress(e.target.value)}
          />
          <TextField
            variant="outlined"
            value={mintAmount}
            label="Mint Amount"
            onChange={(e) => setMintAmount(e.target.value)}
          />
          <Button variant="contained" onClick={safeMint}>
            Mint Yarts
          </Button>
        </Stack>
      </Box>
      <Box mt={5}>
        <Stack spacing={2} direction="row">
          <TextField
            variant="outlined"
            value={testGameId}
            label="Game ID"
            onChange={(e) => setTestGameId(e.target.value)}
          />
          <TextField
            variant="outlined"
            value={testGameRadius}
            label="Radius"
            onChange={(e) => setTestGameRadius(e.target.value)}
          />
          <TextField
            variant="outlined"
            value={mapShrink}
            label="Map Shrink"
            onChange={(e) => setMapShrink(e.target.value)}
          />
          <Button variant="contained" onClick={startTestGame}>
            Start Game
          </Button>
          <Button variant="contained" onClick={endTestGame}>
            End Game
          </Button>
        </Stack>
      </Box>
      <Box mt={5}>
        <Stack spacing={2} direction="row">
          <TextField
            variant="outlined"
            value={updateWorldTestId}
            label="Game ID"
            onChange={(e) => setUpdateWorldTestId(e.target.value)}
          />
          <Button variant="contained" onClick={updateWorldTest}>
            {" "}
            Update World
          </Button>
        </Stack>
      </Box>
      <Box mt={5}>
        <Timer gameId={22} />
      </Box>

      <Grid container p={4}>
        {openRegistrations?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h4">
              {`${openRegistrations.length} Open Registrations`}
            </Typography>
          </Grid>
        )}

        {openRegistrations &&
          openRegistrations.map((registration) => (
            <Grid item key={registration.phase} m={2}>
              <Card elevation={4}>
                <CardHeader
                  title={`Phase: ${registration.phase}, ${registration.state}, ${registration.players.length} players`}
                />
                <CardContent>
                  {registration.players.map((player) => (
                    <Typography variant="h6" key={player.address} ml={2}>
                      {shortenAddress(player.address)} with ship{" "}
                      {player.yartsshipId} {player.state} for game{" "}
                      {player.gameId}.
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}

        {closedRegistrations?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h4">
              {`${closedRegistrations.length} Closed Registrations`}
            </Typography>
          </Grid>
        )}

        {closedRegistrations &&
          closedRegistrations.map((registration) => (
            <Grid item key={registration.phase} m={2}>
              <Card elevation={4}>
                <CardHeader
                  title={`Phase: ${registration.phase}, ${registration.state}, ${registration.players.length} players`}
                />
                <CardContent>
                  {registration.players.map((player) => (
                    <Typography variant="h6" key={player.address} ml={2}>
                      {shortenAddress(player.address)} with ship{" "}
                      {player.yartsshipId} {player.state} for game{" "}
                      {player.gameId}.
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Fragment>
  );
}
