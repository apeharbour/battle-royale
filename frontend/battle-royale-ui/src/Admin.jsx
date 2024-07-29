import React, { useState, useEffect, Fragment } from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useWriteContract,
  useConfig,
  useWaitForTransactionReceipt,
} from "wagmi";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";

import GameAbi from "./abis/GamePunk.json";
import RegistrationPunkAbi from "./abis/RegistrationPunk.json";

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

const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const REGISTRATION_ABI = RegistrationPunkAbi.abi;
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

// const useRegistrationsQuery = (select) => {
//   return useQuery({
//     queryKey: ["registrations"],
//     queryFn: async () =>
//       request(
//         import.meta.env.VITE_SUBGRAPH_URL_REGISTRATION,
//         registrationQuery
//       ),
//     select,
//   });
// };

const useRegistrationsQuery = (select) => {
  return useQuery({
    queryKey: ["registrations"],
    queryFn: async () => request(import.meta.env.VITE_SUBGRAPH_URL_REGISTRATION, registrationQuery),
    select,
    staleTime: 0, // Ensure the data is considered stale immediately
    cacheTime: 0, // Minimize cache duration
    refetchOnWindowFocus: 'always' // Refetch every time the window gains focus, useful in development
  });
};


const useRegistrations = (state) => useRegistrationsQuery((data) => data.registrations.filter((r) => r.state === state));
const useRegistrationsPhase = (state) => useRegistrationsQuery((data) => {
  const filteredByState = data.registrations.filter(r => r.state === state);
  const highestPhase = Math.max(...filteredByState.map(r => parseInt(r.phase, 10)));
  const highestPhaseGameIds = filteredByState.filter(r => parseInt(r.phase, 10) === highestPhase).map(r => r.firstGameId);
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

  const [testGameId, setTestGameId] = useState(0);
  const [testGameRadius, setTestGameRadius] = useState(0);
  const [updateWorldTestId, setUpdateWorldTestId] = useState(0);
  const [txInFlight, setTxInFlight] = useState(false);



  const {
    data: closedRegistrations,
    refetch: refetchClosedRegistrations,
  } = useRegistrations(RegistrationState.CLOSED);
  const {
    data: openRegistrations,
    refetch: refetchOpenRegistrations,
  } = useRegistrations(RegistrationState.OPEN);
  const {
    data: registrationData,
    refetch: refetchRegistrationsData,
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

  useEffect(() => {
    if (isTxConfirmed && txData && txInFlight) {
      console.log('Transaction confirmed:', txData);
      setTxInFlight(false);

      refetchRegistrationsData().then(newData => {
        console.log("Refetched data:", newData.data);
        setTimeout(() => {
          newData.data.highestPhaseGameIds.forEach(gameId => {
            triggerLambdaFunction(gameId);
          });
        }, 4000);
      });
    }
  }, [isTxConfirmed, txData, txInFlight, refetchRegistrationsData]);

  useEffect(() => {
    if (isTxError && txError) {
      console.error('Transaction error:', txError);
    }
  }, [isTxError, txError]);

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
      args: [MAX_PLAYERS_PER_GAME, RADIUS],
    });
    setTxInFlight(true);
  }

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
        {openRegistrations && (
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

        {closedRegistrations && (
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
