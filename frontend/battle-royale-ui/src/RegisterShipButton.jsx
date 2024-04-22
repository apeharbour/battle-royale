import React, { useState, useEffect, Fragment } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useSnackbar } from "notistack";

import { Button } from "@mui/material";

import RegistrationPunkAbi from "./abis/RegistrationPunk.json";
import GameAbi from "./abis/GamePunk.json";
import PunkshipsAbi from "./abis/Punkships.json";

const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const PUNKSHIPS_ADDRESS = import.meta.env.VITE_PUNKSHIPS_ADDRESS;
const REGISTRATION_ABI = RegistrationPunkAbi.abi;
const GAME_ABI = GameAbi.abi;
const PUNKSHIPS_ABI = PunkshipsAbi.abi;

export default function RegisterShipButton({ shipId, ...props }) {
  const [txInFlight, setTxInFlight] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const {address, isConnected} = useAccount();

  const { data: hash, writeContract } = useWriteContract();

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const registerShip = () => {
    console.log(`Registering ship ${shipId} for ${address}`);
    writeContract({
      abi: GAME_ABI,
      address: GAME_ADDRESS,
      functionName: "registerPlayer",
      args: [shipId],
    });
    setTxInFlight(true);
  };

  if (isConfirmed && txInFlight) {
    enqueueSnackbar(`Ship ${shipId} registered`, { variant: "success" });
    console.log(`Ship ${shipId} registered`, receipt);
    setTxInFlight(false);
  }

  return (
    <Button variant="outlined" onClick={registerShip} disabled={isConfirming || !isConnected}>
      {isConfirming ? "Confirming..." : "Register Ship"}
    </Button>
  );
}
