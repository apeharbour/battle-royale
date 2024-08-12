import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import PunkshipsAbi from "./abis/Punkships.json";
import "./MintShip.css";

const PUNKSHIPS_ADDRESS = import.meta.env.VITE_PUNKSHIPS_ADDRESS;
const PUNKSHIPS_ABI = PunkshipsAbi.abi;

export default function MintShipButton() {
  const [txInFlight, setTxInFlight] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const { data: receipt, isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

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
    <button
      className="holographic-button"
      onClick={mintShip}
      disabled={!isConnected || isConfirming}
    >
      {isConfirming ? "Confirming..." : "Mint Ship"}
    </button>
  );
}