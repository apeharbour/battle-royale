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
import PunkshipsAbi from "./abis/Punkships.json";

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
const PUNKSHIPS_ADDRESS = import.meta.env.VITE_PUNKSHIPS_ADDRESS;
const REGISTRATION_ABI = RegistrationPunkAbi.abi;
const GAME_ABI = GameAbi.abi;
const PUNKSHIPS_ABI = PunkshipsAbi.abi;

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

export default function Admin(props) {
  const [gameContract, setGameContract] = useState(null);
  const [regiContract, setRegiContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [player, setPlayer] = useState(null);
  const [testGameId, setTestGameId] = useState(0);
  const [testGameRadius, setTestGameRadius] = useState(0);
  const [updateWorldTestId, setUpdateWorldTestId] = useState(0);
  const [registrationContractAddress, setRegistrationContractAdress] =
    useState("");

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () =>
      request(
        import.meta.env.VITE_SUBGRAPH_URL_REGISTRATION,
        registrationQuery
      ),
  });

  // useEffect(() => {
  //   const fetchContract = async () => {
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const gameContract = new ethers.Contract(GAME_ADDRESS, GAME_ABI, signer);
  //     const regiContract = new ethers.Contract(
  //       REGISTRATION_ADDRESS,
  //       REGISTRATION_ABI,
  //       signer
  //     );
  //     setGameContract(gameContract);
  //     setRegiContract(regiContract);
  //     setProvider(provider);
  //     setPlayer(signer.address);
  //   };

  //   fetchContract();
  // }, []);

  // const registrationContract = async () => {
  //   if (gameContract) {
  //     const tx = await gameContract
  //       .setRegistrationContract(registrationContractAddress)
  //       .catch(console.error);
  //     await tx.wait();
  //   }
  // };

  const account = useAccount();

  const {
    writeContract,
    hash,
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

  if (isTxConfirmed) {
    console.log("Transaction Confirmed", txData);
  }
  if (isTxError) {
    console.error("Transaction Error", txError);
  }

  const startRegistration = async () => {
    writeContract({
      abi: REGISTRATION_ABI,
      address: REGISTRATION_ADDRESS,
      functionName: "startRegistration",
    });
    // if (regiContract !== null) {
    //   const tx = await regiContract.startRegistration().catch(console.error);
    //   await tx.wait();
    //   console.log(tx);
    // }
  };

  const closeRegistration = async () => {
    writeContract({
      abi: REGISTRATION_ABI,
      address: REGISTRATION_ADDRESS,
      functionName: "closeRegistration",
      args: [MAX_PLAYERS_PER_GAME, RADIUS],
    });

    // if (regiContract !== null) {
    //   const tx = await regiContract
    //     .closeRegistration(8, 6)
    //     .catch(console.error);
    //   await tx.wait();

    //    const lastGameIdBigInt = await regiContract.lastGameId();
    //    const lastGameId = Number(lastGameIdBigInt);
    //    console.log(lastGameId);

    //    for (let gameId = 1; gameId <= lastGameId; gameId++) {
    //      triggerLambdaFunction(gameId);
    //  }

    // triggerLambdaFunction(1);
  };

  const triggerLambdaFunction = async (gameId) => {
    const apiEndpoint =
      "https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/afterGameCreated";
    const postData = {
      gameId: gameId.toString(),
      scheduleRate: "5 minutes",
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

    // if (gameContract !== null) {
    //   const tx = await gameContract
    //     .startNewGame(testGameId, testGameRadius)
    //     .catch(console.error);
    //   await tx.wait();
    //   console.log(tx);
    // }
  };

  const endTestGame = async () => {
    writeContract({
      abi: GAME_ABI,
      address: GAME_ADDRESS,
      functionName: "endGame",
      args: [testGameId],
    });

    // if (gameContract !== null) {
    //   const tx = await gameContract.endGame(testGameId).catch(console.error);
    //   await tx.wait();
    //   console.log(tx);
    // }
  };

  const updateWorldTest = async () => {
    writeContract({
      abi: GAME_ABI,
      address: GAME_ADDRESS,
      functionName: "updateWorld",
      args: [updateWorldTestId],
    });
    // if (gameContract !== null) {
    //   const tx = await gameContract
    //     .updateWorld(updateWorldTestId)
    //     .catch(console.error);
    //   await tx.wait();
    //   console.log(tx);
    // }
  };

  return (
    <Fragment>
      <Box mt={2}>
        <Stack spacing={2} direction="row">
          {/* <TextField
            variant="outlined"
            value={registrationContractAddress}
            label="Reg Contract"
            onChange={(e) => setRegistrationContractAdress(e.target.value)}
          /> */}
          {/* <Button variant="contained" onClick={registrationContract}>
            Set
          </Button> */}
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
      <Box>
        <Timer />
      </Box>

      <Grid container p={4}>
        <Grid item xs={12}>
          {data && <Typography variant="h4">Registration Status</Typography>}
          {isFetching && <Typography variant="h6">Loading...</Typography>}
          {isError && <Typography variant="h6">{error.message}</Typography>}
        </Grid>

        {data && (
          <Grid item xs={12}>
            <Typography variant="h4">
              {`${
                data.registrations.filter((r) => r.state === "OPEN").length
              } Open Registrations`}
            </Typography>
          </Grid>
        )}

        {data &&
          data.registrations
            .filter((r) => r.state === "OPEN")
            .map((registration) => (
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

        {data && (
          <Grid item xs={12}>
            <Typography variant="h4">
              {`${
                data.registrations.filter((r) => r.state === "CLOSED").length
              } Closed Registrations`}
            </Typography>
          </Grid>
        )}

        {data &&
          data.registrations
            .filter((r) => r.state === "CLOSED")
            .map((registration) => (
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
