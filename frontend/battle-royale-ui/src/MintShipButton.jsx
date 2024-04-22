import React, { useState, useEffect, Fragment } from "react";

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
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


export default function MintShipButton() {

  const [txInFlight, setTxInFlight] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const {address, isConnected} = useAccount();

  const { data: hash, 
    isPending, writeContract } = useWriteContract();

    const { data: receipt, isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  const mintShip = () => {
    console.log(`Minting ship for ${address}`);
    writeContract({
      abi: PUNKSHIPS_ABI,
      address: PUNKSHIPS_ADDRESS,
      functionName: "safeMint",
      args: [address],
    });
    setTxInFlight(true);
  };

  if (isConfirmed && txInFlight) {
    enqueueSnackbar("Ship minted", { variant: "success" });
    console.log("Ship minted", receipt);
    setTxInFlight(false);
  }

  return (
    <Button variant="outlined" onClick={mintShip} disabled={!isConnected || isConfirming}>
      {isConfirming ? "Confirming..." : "Mint Ship"}
    </Button>
  );
}
