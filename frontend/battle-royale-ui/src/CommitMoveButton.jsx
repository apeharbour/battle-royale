import React, { useState, useEffect, Fragment } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import { Hex, HexUtils } from "react-hexgrid";

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

export default function CommitMoveButton({ travelEndpoint, shotEndpoint, myShip, clearTravelAndShotEndpoints, gameId, ...props }) {
  const [txInFlight, setTxInFlight] = useState(false);
  const [moveCommitted, setMoveCommitted] = useState(false);

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

    // calculate distances and directions
    const myShipHex = new Hex(myShip.q, myShip.r, (myShip.q + myShip.r) * -1);
    const travelDistance = HexUtils.distance(myShipHex, travelEndpoint);
    const shotDistance = HexUtils.distance(travelEndpoint, shotEndpoint);

    const travelDirection = determineDirection(myShipHex, travelEndpoint);
    const shotDirection = determineDirection(travelEndpoint, shotEndpoint);

    // clearTravelAndShotEndpoints();

    // if (contract) {
    //   setRandomInt(generateRandomInt());
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
       } catch (error) {
         console.error(
           "Error in submitting moves or storing in DynamoDB",
           error
         );
       }
      };

  if (isConfirmed && txInFlight) {
    enqueueSnackbar(`Commited move`, { variant: "success" });
    console.log(`Commited move for player ${address} with hash ${hash}`, receipt);
    setTxInFlight(false);
    setMoveCommitted(true);
  }

  return (
    // <Button variant="outlined" onClick={commitMove} disabled={isConfirming || !isConnected || !shotEndpoint || !travelEndpoint}>
    <Button variant="contained" onClick={commitMove} disabled={isConfirming || !isConnected || !shotEndpoint || !travelEndpoint || moveCommitted}>
      {isConfirming ? "Confirming..." : "Commit Move"}
    </Button>
  );
}
