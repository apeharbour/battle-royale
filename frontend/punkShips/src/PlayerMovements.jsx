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
  const [direction, setDirection] = useState(0);
  const [distance, setDistance] = useState(0);
  const [secret, setSecret] = useState(0);
  const [shotDirection, setShotDirection] = useState(0);
  const [shotDistance, setShotDistance] = useState(0);

//   const { onMovesChange } = props;

//   const updateMoves = () => {
//     if (onMovesChange) {
//       onMovesChange({
//         moveDirection: direction,
//         moveDistance: distance,
//         shootDirection: shotDirection,
//         shootDistance: shotDistance,
//       });
//     }
//   };

//   useEffect(() => {
//     updateMoves();
//   }, [direction, distance, shotDirection, shotDistance, updateMoves]);
  

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
          </Stack>
        </Grid>
      ) : null}

      <Grid item>
        <Stack spacing={4}>
          <Typography variant="h5">Movements</Typography>

          <Stack spacing={2} direction="row">
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                {" "}
                Direction{" "}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={direction}
                onChange={(event) => {
                  setDirection(event.target.value);
                }}
                name="radio-buttons-group"
              >
                <FormControlLabel value="0" control={<Radio />} label="E" />
                <FormControlLabel value="1" control={<Radio />} label="NE" />
                <FormControlLabel value="2" control={<Radio />} label="NW" />
                <FormControlLabel value="3" control={<Radio />} label="W" />
                <FormControlLabel value="4" control={<Radio />} label="SW" />
                <FormControlLabel value="5" control={<Radio />} label="SE" />
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                Shot Direction
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={shotDirection}
                onChange={(event) => {
                  setShotDirection(event.target.value);
                }}
                name="radio-buttons-group"
              >
                <FormControlLabel value="0" control={<Radio />} label="E" />
                <FormControlLabel value="1" control={<Radio />} label="NE" />
                <FormControlLabel value="2" control={<Radio />} label="NW" />
                <FormControlLabel value="3" control={<Radio />} label="W" />
                <FormControlLabel value="4" control={<Radio />} label="SW" />
                <FormControlLabel value="5" control={<Radio />} label="SE" />
              </RadioGroup>
            </FormControl>
          </Stack>

          <Stack spacing={2} direction="column">
            <TextField
              required
              id="outlined-required"
              label="Move Distance"
              type="number"
              inputProps={{ min: "0", step: "1" }}
              onChange={(event) => {
                let newValue = event.target.value;
                if (newValue === "" || newValue < 0) {
                  newValue = "0";
                }
                setDistance(newValue);
              }}
              value={distance} // set value to handle the label position
            />
            <TextField
              required
              id="outlined-required"
              label="Shot Distance"
              type="number"
              inputProps={{ min: "0", step: "1" }}
              onChange={(event) => {
                let newValue = event.target.value;
                if (newValue === "" || newValue < 0) {
                  newValue = "0";
                }
                setShotDistance(newValue);
              }}
              value={shotDistance} // set value to handle the label position
            />
            {/* <TextField
     required
     id='outlined-required'
     label='Secret Value'
     type='number'
     inputProps={{ min: '0', step: '1' }}
     onChange={event => {
       let newValue = event.target.value
       if (newValue === '' || newValue < 0) {
         newValue = '0'
       }
       setSecret(newValue)
     }}
     value={secret} // set value to handle the label position
   /> */}
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
