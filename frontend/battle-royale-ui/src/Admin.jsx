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

import GameAbi from "./abis/GamePunk.json";
import RegistrationPunkAbi from "./abis/RegistrationPunk.json";

const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const REGISTRATION_ABI = RegistrationPunkAbi;
const GAME_ABI = GameAbi.abi;

const GAME_ID = 1;
const MAX_PLAYERS_PER_GAME = 8;
const RADIUS = 6;

const registrationQuery = gql`
  query registrations {
    registrations {
      firstGameId
      phase
      state
      players {
        address
        punkshipId
        state
        gameId
      }
    }
  }
`;

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}..${address.slice(-4)}`;
};

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
      highestPhaseGameIds,
      fullData: filteredByState,
    };
  });

class RegistrationState {
  static OPEN = "OPEN";
  static CLOSED = "CLOSED";
}

export default function Admin(props) {
  const [testGameId, setTestGameId] = useState();
  const [testGameRadius, setTestGameRadius] = useState();
  const [updateWorldTestId, setUpdateWorldTestId] = useState();
  const [txInFlight, setTxInFlight] = useState(false);
  const [mapShrink, setMapShrink] = useState(3);

  const { data: closedRegistrations } = useRegistrations(
    RegistrationState.CLOSED
  );
  const { data: openRegistrations } = useRegistrations(RegistrationState.OPEN);
  const { data: registrationData, refetch: refetchRegistrationsData } =
    useRegistrationsPhase(RegistrationState.CLOSED);

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


  useEffect(() => {
    if (isTxError && txError) {
      console.error("Transaction error:", txError);
    }
  }, [isTxError, txError]);

  useEffect(() => {
    const setupEventListener = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          REGISTRATION_ADDRESS,
          REGISTRATION_ABI,
          signer
        );

        // Debug: Ensure contract is being listened to
        console.log(
          "Listening to RegistrationClosed event on contract:",
          REGISTRATION_ADDRESS
        );

        contract.on("RegistrationClosed", async (registrationPhase, gameId) => {
          console.log(
            "Registration closed event detected:",
            registrationPhase,
            gameId
          );

          const newData = await refetchRegistrationsData();
          console.log("Refetched data:", newData.data);

          if (newData.data && newData.data.highestPhaseGameIds.length > 0) {
            newData.data.highestPhaseGameIds.forEach((gameId) => {
              triggerLambdaFunction(gameId);
            });
          }
        });

        // Cleanup event listener on component unmount
        return () => {
          console.log("Removing event listener for RegistrationClosed");
          contract.off("RegistrationClosed");
        };
      } else {
        console.error("Ethereum provider is not available");
      }
    };

    setupEventListener();
  }, [refetchRegistrationsData]);

  const startRegistration = async () => {
    writeContract({
      abi: REGISTRATION_ABI,
      address: REGISTRATION_ADDRESS,
      functionName: "startRegistration",
    });
  };

  const closeRegistration = async () => {
    writeContract({
      abi: REGISTRATION_ABI,
      address: REGISTRATION_ADDRESS,
      functionName: "closeRegistration",
      args: [MAX_PLAYERS_PER_GAME, RADIUS, mapShrink],
    });
    setTxInFlight(true);
    console.log(
      "Closing registration",
      MAX_PLAYERS_PER_GAME,
      RADIUS,
      mapShrink
    );
  };

  const triggerLambdaFunction = async (gameId) => {
    const apiEndpoint =
      "https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/afterGameCreated";
    const postData = {
      gameId: gameId.toString(),
      scheduleRate: "2 minutes",
    };

    try {
      console.log("Sending API Request for Game ID:", gameId, postData);
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const responseData = await response.json();
      console.log("API Response for Game ID:", gameId, responseData);
    } catch (error) {
      console.error("API Call Error for Game ID:", gameId, error);
    }
  };

  const startTestGame = async () => {
    writeContract({
      abi: GAME_ABI,
      address: GAME_ADDRESS,
      functionName: "startNewGame",
      args: [testGameId, testGameRadius],
    });
  };

  const endTestGame = async () => {
    writeContract({
      abi: GAME_ABI,
      address: GAME_ADDRESS,
      functionName: "endGame",
      args: [testGameId],
    });
  };

  const updateWorldTest = async () => {
    writeContract({
      abi: GAME_ABI,
      address: GAME_ADDRESS,
      functionName: "updateWorld",
      args: [updateWorldTestId],
    });
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
                      {player.punkshipId} {player.state} for game{" "}
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
                      {player.punkshipId} {player.state} for game{" "}
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
