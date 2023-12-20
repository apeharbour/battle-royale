import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  List,
  ListItem,
  Input,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import GameAbi from "./abis/GamePunk.json";

const GAME_ADDRESS = "0xFbadD58d6317637af3Dad09BFa8F10C82ccDa2b0";
const GAME_ABI = GameAbi.abi;

export default function PlayerMovements(props) {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [player, setPlayer] = useState(null);
  

  useEffect(() => {
    const fetchContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(GAME_ADDRESS, GAME_ABI, signer);
      setContract(contract);
      setProvider(provider);
      setPlayer(signer.address);
    };

    fetchContract();
  }, []);

  const allowSubmit = async () => {
    if (contract) {
      const tx = await contract
        .allowSubmitMoves(props.gameId)
        .catch(console.error);
      await tx.wait();
      console.log(tx);
    }
  };

  const updateWorld = async () => {
    if (contract) {
      const tx = await contract.updateWorld(props.gameId);
      await tx.wait();

      allowSubmit();
    }
  };

  return (
    <Grid container spacing={2}>
      {player === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" ||
      player === "0xCd9680dd8318b0df924f0bD47a407c05B300e36f" ? (
        <Grid item>
          <Stack spacing={4}>
            <Button variant="contained" onClick={allowSubmit}>
              Allow players to submit
            </Button>
            <Button variant="contained" onClick={updateWorld}>
              Update World
            </Button>
            <Button variant="contained"> Console Moves </Button>
          </Stack>
        </Grid>
      ) : null}

     
    </Grid>
  );
}
