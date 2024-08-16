import React, { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import { Hex, HexUtils } from "react-hexgrid";
import { Button, Stack } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import GameAbi from "./abis/GamePunk.json";
import "./MintShip.css";

const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const GAME_ABI = GameAbi.abi;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const determineDirection = (origin, destination) => {
  const deltaQ = destination.q - origin.q;
  const deltaR = destination.r - origin.r;

  // Normalize the deltas to -1, 0, or 1
  const sign = (num) => (num === 0 ? 0 : num > 0 ? 1 : -1);
  const normDeltaQ = sign(deltaQ);
  const normDeltaR = sign(deltaR);

  if (normDeltaQ === 1 && normDeltaR === 0) return 0;
  if (normDeltaQ === 1 && normDeltaR === -1) return 1;
  if (normDeltaQ === 0 && normDeltaR === -1) return 2;
  if (normDeltaQ === -1 && normDeltaR === 0) return 3;
  if (normDeltaQ === -1 && normDeltaR === 1) return 4;
  if (normDeltaQ === 0 && normDeltaR === 1) return 5;
  return 6;
};

export default function CommitMoveButton({
  travelEndpoint,
  shotEndpoint,
  myShip,
  clearTravelAndShotEndpoints,
  gameId,
  ...props
}) {
  const [txInFlight, setTxInFlight] = useState(false);
  const [moveCommitted, setMoveCommitted] = useState(false);
  const [commitMoveDialogOpen, setCommitMoveDialogOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { address, isConnected } = useAccount();

  const { data: hash, writeContract } = useWriteContract();

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (travelEndpoint && shotEndpoint) {
      setCommitMoveDialogOpen(true);
    }
  }, [travelEndpoint, shotEndpoint]);

  //Helper Function to generate secret random number for hashing moves
  function generateRandomInt() {
    return Math.floor(Math.random() * 99) + 1;
  }

  //To store players moves in the dynamoDB
  const storePlayerMove = async ({
    gameId,
    playerAddress,
    moveHash,
    secretValue,
    travelDirection,
    travelDistance,
    shotDirection,
    shotDistance,
  }) => {
    if (!playerAddress) {
      console.error("storePlayerMove: playerAddress is null or undefined.");
      return;
    }
    const apiEndpoint =
      "https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/storePlayerMoves";
    const moveData = {
      gameId,
      playerAddress,
      moveHash,
      secretValue,
      travelDirection,
      travelDistance,
      shotDirection,
      shotDistance,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(moveData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Move stored successfully via API");
    } catch (error) {
      console.error("Error storing move via API", error);
    }
  };

  const commitMove = async () => {
    if (!isConnected) {
      console.error("Player address is undefined or not set");
      return; // Exit the function if gamePlayer is not set
    }

    if (myShip.state !== "active") {
      enqueueSnackbar(`You are not active in the game, cannot commit move!`, {
        variant: "error",
      });
      return; // Exit the function if the player's ship is not active
    }

    // calculate distances and directions
    const myShipHex = new Hex(myShip.q, myShip.r, (myShip.q + myShip.r) * -1);
    const travelDistance = HexUtils.distance(myShipHex, travelEndpoint);
    const shotDistance = HexUtils.distance(travelEndpoint, shotEndpoint);

    const travelDirection = determineDirection(myShipHex, travelEndpoint);
    const shotDirection = determineDirection(travelEndpoint, shotEndpoint);

    const randomInt = generateRandomInt();
    const moveHash = ethers.solidityPackedKeccak256(
      ["uint8", "uint8", "uint8", "uint8", "uint8", "address"],
      [
        travelDirection,
        travelDistance,
        shotDirection,
        shotDistance,
        randomInt,
        address,
      ]
    );

    console.log("Move Hash: ", moveHash);

    try {
      writeContract({
        abi: GAME_ABI,
        address: GAME_ADDRESS,
        functionName: "commitMove",
        args: [moveHash, BigInt(gameId)],
      });

      await storePlayerMove({
        gameId,
        playerAddress: address,
        moveHash,
        secretValue: randomInt,
        travelDirection,
        travelDistance,
        shotDirection,
        shotDistance,
      });
      setTxInFlight(true);
      // clearTravelAndShotEndpoints() shouldn't be called here, so that the highlighting is not removed before the transaction is confirmed
    } catch (error) {
      console.error("Error in submitting moves or storing in DynamoDB", error);
    }
  };

  if (isConfirmed && txInFlight) {
    enqueueSnackbar(`Commited move`, { variant: "success" });
    console.log(
      `Commited move for player ${address} with hash ${hash}`,
      receipt
    );
    setTxInFlight(false);
    setMoveCommitted(true);
    setCommitMoveDialogOpen(false);
    clearTravelAndShotEndpoints();
  }

  const handleClose = () => {
    clearTravelAndShotEndpoints();
    setCommitMoveDialogOpen(false);
  };

  return (
    <BootstrapDialog
      open={commitMoveDialogOpen}
      onClose={handleClose}
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          fontSize: "2.8rem",
          fontWeight: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Commit your move
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} direction="row" justifyContent="center">
          <button
            className="holographic2-button"
            onClick={handleClose}
            disabled={isConfirming}
          >
            Edit
          </button>
          <button className="holographic-button" onClick={commitMove}>
            {isConfirming ? "Confirming..." : "Commit"}
          </button>
        </Stack>
      </DialogContent>
    </BootstrapDialog>
  );
}
