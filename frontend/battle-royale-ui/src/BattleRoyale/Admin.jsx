import React, { useState, useEffect, Fragment } from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
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

import GameAbi from "../abis/Gameyarts.json";
import RegistrationAbi from "../abis/Registrationyarts.json";
import YartsAbi from "../abis/Yarts.json";

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
const API_KEY = "scX42vcQTF6Ic8dxvje657pP57dlRqeK7svOiPDE";
const START_REGISTRATION_URL =
  "https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/startRegistration";
const CLOSE_REGISTRATION_URL =
  "https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/closeRegistration";
const EVENT_BRIDGE_URL =
  "https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/afterGameCreated";

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
  const [mapShrink, setMapShrink] = useState(null);
  const [lastProcessedPhase, setLastProcessedPhase] = useState(-1);
  const [processingError, setProcessingError] = useState(null);
  const [processedTransactions] = useState(new Set());
  const [gameIdEventBridge, setGameIdEventBridge] = useState(null);
  const [mintAddress, setMintAddress] = useState(null);
  const [mintAmount, setMintAmount] = useState(null);
  const [radius, setRadius] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(null);
  const [gameKMS, setGameKMS] = useState(null);
  const [registrationKMS, setRegistrationKMS] = useState(null);

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

  const startRegistration = async () => {
    try {
      setProcessingError(null);

      const response = await fetch(START_REGISTRATION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "battleroyale",
        },
      });

      if (!response.ok) {
        throw new Error(`Error starting registration: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error starting registration:", error);
      setProcessingError(error.message);
    }
  };

  const closeRegistration = async (maxPlayers, radius, mapShrink) => {
    try {
      const response = await fetch(CLOSE_REGISTRATION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "battleroyale",
        },
        body: JSON.stringify({
          maxPlayers,
          radius,
          mapShrink,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error closing registration: ${response.statusText}`);
      }

      console.log("Closing registration with params:", {
        maxPlayers,
        radius,
        mapShrink,
      });
    } catch (error) {
      console.error("Error closing registration:", error);
    }
  };

  const triggerLambdaFunction = async (gameId) => {
    const postData = {
      gameId: gameId.toString(),
      scheduleRate: "3 minutes",
    };

    try {
      const response = await fetch(EVENT_BRIDGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "battleroyale",
        },
        body: JSON.stringify(postData),
      });
    } catch (error) {
      console.error("Error triggering lambda function:", error);
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

  const gameKMSFunction = () => {
    try {
      writeContract({
        abi: GAME_ABI,
        address: GAME_ADDRESS,
        functionName: "setKmsPublicAddress",
        args: [gameKMS],
      });
    } catch (error) {
      console.error("Error calling setKmsPublicAddress:", error);
      setProcessingError(error.message);
    }
  };

  const registrationKMSFunction = async () => {
    try {
      await writeContract({
        abi: REGISTRATION_ABI,
        address: REGISTRATION_ADDRESS,
        functionName: "setKmsPublicAddress",
        args: [registrationKMS],
      });
    } catch (error) {
      console.error("Error calling setKmsPublicAddress:", error);
      setProcessingError(error.message);
    }
  };

  return (
    <Fragment>
      {account?.address?.toLowerCase() ===
      "0xcd9680dd8318b0df924f0bd47a407c05b300e36f" ? (
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
              <Button
                variant="contained"
                onClick={() => closeRegistration(maxPlayers, radius, mapShrink)}
                color="error"
                disabled={!mapShrink || !maxPlayers || !radius}
              >
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
                value={maxPlayers}
                label="Max Players"
                onChange={(e) => setMaxPlayers(e.target.value)}
              />
              <TextField
                variant="outlined"
                value={radius}
                label="Radius"
                onChange={(e) => setRadius(e.target.value)}
              />
              <TextField
                variant="outlined"
                value={gameIdEventBridge}
                label="Event Bridge"
                onChange={(e) => setGameIdEventBridge(e.target.value)}
              />
            </Stack>
            <Button
              variant="contained"
              onClick={() => {
                triggerLambdaFunction(gameIdEventBridge);
              }}
            >
              Event Bridge
            </Button>
          </Box>
          <Box mt={5}>
            <Stack spacing={2} direction="row">
              <TextField
                variant="outlined"
                value={gameKMS}
                label="KMS Address"
                onChange={(e) => setGameKMS(e.target.value)}
              />
              <Button variant="contained" onClick={gameKMSFunction}>
                Set Game KMS
              </Button>
              <TextField
                variant="outlined"
                value={registrationKMS}
                label="KMS Address"
                onChange={(e) => setRegistrationKMS(e.target.value)}
              />
              <Button variant="contained" onClick={registrationKMSFunction}>
                Set Registration KMS
              </Button>
            </Stack>
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
            <Timer gameId={1} />
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
      ) : (
        <Typography variant="h4" color="error">
          You are not authorized to view this page. Please contact the admin.
        </Typography>
      )}
    </Fragment>
  );
}
