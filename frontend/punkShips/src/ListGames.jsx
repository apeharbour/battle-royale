import React, { useState, useEffect} from "react";
import { Box, Button, Card, CardActions, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useQuery, gql } from "@apollo/client";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import GameAbi from "./abis/GamePunk.json";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
import { ethers } from "ethers";
import Registration from "./Registration";

const GAME_ADDRESS = "0x07FDE55d91347eDB0fEd9a6b5D541bc09d048525";
const GAME_ABI = GameAbi.abi;

const GET_GAMES = gql`
  query getGames {
    gameStarteds{
      id
      gameId
    } 
  }
`;

export default function ListGames(props) {

  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [player, setPlayer] = useState(null);
  const [gameId, setGameId] = useState(1);
  const [regGameId, setRegGameId] = useState(1);
  const [endGameId, setEndGameId] = useState(1);
  const [sortedGames, setSortedGames] = useState([]);
  const [radius, setRadius] = useState(4);
  const [registrationContractAddress, setRegistrationContractAdress] =
  useState("");

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

  const { loading, error, data } = useQuery(GET_GAMES, {
    pollInterval: 5000,
  });

  useEffect(() => {
    if (data && data.gameStarteds) {
      const sorted = data.gameStarteds.slice().sort((a, b) => a.gameId - b.gameId);
      setSortedGames(sorted);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const startGame = async () => {
    if (contract) {
      const tx = await contract.startNewGame(gameId).catch(console.error)
      await tx.wait()
      console.log('Start Game:', tx)
      const txMap = await contract.initGame(radius, gameId).catch((e) => {
        console.error("horrible mistake:", e)
      })
      await txMap.wait()
      console.log(txMap)
    }
  }

  const endGame = async () => {
    if (contract) {
      const tx = await contract.endGame(endGameId).catch(console.error)
      await tx.wait()
      console.log('End Game:', tx)
    }
  }

  const registrationContract = async () => {
    if (contract) {
      const tx = await contract
        .setRegistrationContract(registrationContractAddress)
        .catch(console.error);
      await tx.wait();
    }
  };

  return (
    <Grid container spacing={2}>
       <Grid xs={12} md={6}>
      {sortedGames.map(({ id, gameId }) => (
          <Box mt={1} key={id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Game {gameId}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                href={`/${gameId}`}
              >
                Show
              </Button>
            </CardActions>
          </Card>
          </Box>
      ))}
       </Grid>
      <Grid xs={12} md={6}>
      <Stack spacing={2} direction='row'>
                <TextField
                  variant='outlined'
                  value={gameId}
                  label='Start Game'
                  onChange={e => {
                    setGameId(parseInt(e.target.value))
                  }}
                />
                <TextField
                variant="outlined"
                value={radius}
                label='Map Radius'
                onChange={(e) => {
                  setRadius(parseInt(e.target.value));
                }}
              />
               <Button variant='contained' onClick={startGame}>
                  Start Game
                </Button>
                <TextField
                  variant='outlined'
                  value={endGameId}
                  label='End Game'
                  onChange={e => {
                    setEndGameId(parseInt(e.target.value))
                  }}
                />
                <Button variant='contained' onClick={endGame}>
                  End Game
                </Button>
              </Stack>
              <Box mt={2}>
              <Stack spacing={2} direction="row">
                <TextField
                  variant="outlined"
                  value={registrationContractAddress}
                  label='Reg Contract'
                  onChange={(e) =>
                    setRegistrationContractAdress(e.target.value)
                  }
                />
                  <TextField
                  variant='outlined'
                  value={regGameId}
                  label='Reg GameID'
                  onChange={e => {
                    setRegGameId(parseInt(e.target.value))
                  }}
                /> 
                <Button variant="contained" onClick={registrationContract}>
                  Set
                </Button>
              </Stack>
              </Box>
              <Box mt={2}>
              <Registration gameId={regGameId} />
              </Box>
      </Grid>
    </Grid>
  );
}
