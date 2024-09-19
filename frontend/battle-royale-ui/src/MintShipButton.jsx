import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import PunkshipsAbi from "./abis/Punkships.json";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const PUNKSHIPS_ADDRESS = import.meta.env.VITE_PUNKSHIPS_ADDRESS;
const PUNKSHIPS_ABI = PunkshipsAbi.abi;

const HolographicButton = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "16px 27px",
  color: "#00ffcc",
  border: "1.8px solid #00ffcc",
  borderRadius: "27px",
  "& .MuiButton-label": {
    fontSize: "1rem",
  },
  cursor: "pointer",
  overflow: "hidden",
  transition: "transform 0.2s ease",
  fontFamily: theme.typography.fontFamily,
  "&:hover": {
    transform: "scale(1.05)",
    background: "black",
  },
  "&:disabled": {
    cursor: "not-allowed",
    borderColor: "#555",
    color: "#777",
    background: "#333",
  },
}));

export default function MintShipButton() {
  const [txInFlight, setTxInFlight] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract, error: writeError } = useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed && txInFlight) {
      enqueueSnackbar("Ship minted", { variant: "success" });
      console.log("Ship minted", receipt);
      setTxInFlight(false);
    }
  }, [isConfirmed, txInFlight, receipt, enqueueSnackbar]);

  useEffect(() => {
    if (writeError) {
      if (writeError.code === 4001) {
        // User rejected the transaction
        enqueueSnackbar("Transaction rejected by user", { variant: "error" });
      } else {
        // Other errors
        enqueueSnackbar("An error occurred during the transaction", {
          variant: "error",
        });
      }
      setTxInFlight(false);
    }
  }, [writeError, enqueueSnackbar]);

  const mintShip = () => {
    if (!isConnected) {
      enqueueSnackbar("Please connect your wallet first", {
        variant: "warning",
      });
      return;
    }
    console.log(`Minting ship for ${address}`);
    enqueueSnackbar("Minting ship for you", { variant: "info" });
    writeContract({
      abi: PUNKSHIPS_ABI,
      address: PUNKSHIPS_ADDRESS,
      functionName: "safeMint",
      args: [address],
    });
    setTxInFlight(true);
  };

  return (
    <HolographicButton onClick={mintShip} disabled={isConfirming}>
      {isConfirming ? "Confirming..." : "Mint Ship"}
    </HolographicButton>
  );
}
