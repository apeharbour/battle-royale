import React, { useState, useEffect, Fragment } from "react";
import { ethers } from "ethers";
import GameAbi from "./abis/GamePunk.json";
import RegistrationPunkAbi from "./abis/RegistrationPunk.json";
import { TextField, Button, Stack } from "@mui/material";

const GAME_ADDRESS = "0xB29EB360720DE3FC7BB14E6F91bcA6E0bdF50a66";
const GAME_ABI = GameAbi.abi;
const REGISTRATION_ADDRESS = "0x90463db24497E862A848417EdFc351F32F3e4E08";
const REGISTRATION_ABI = RegistrationPunkAbi.abi;

export default function Admin(props) {

    const [gameContract, setGameContract] = useState(null);
    const [regiContract, setRegiContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [player, setPlayer] = useState(null);
    const [registrationContractAddress, setRegistrationContractAdress] = useState("");

    useEffect(() => {
        const fetchContract = async () => {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const gameContract = new ethers.Contract(GAME_ADDRESS, GAME_ABI, signer);
          const regiContract = new ethers.Contract(REGISTRATION_ADDRESS, REGISTRATION_ABI, signer);
          setGameContract(gameContract);
          setRegiContract(regiContract);
          setProvider(provider);
          setPlayer(signer.address);
        };
    
        fetchContract();
      }, []);

      const registrationContract = async () => {
        if (gameContract) {
          const tx = await gameContract
            .setRegistrationContract(registrationContractAddress)
            .catch(console.error);
          await tx.wait();
        }
      };

      const startRegistration = async () => {
        if (regiContract !== null) {
          const tx = await regiContract.startRegistration().catch(console.error);
          await tx.wait();
          console.log(tx);
        }
      }

      const closeRegistration = async () => {
        if (regiContract !== null) {
          const tx = await regiContract.closeRegistration(8,6).catch(console.error);
          await tx.wait();

          const lastGameIdBigInt = await regiContract.lastGameId();
          const lastGameId = Number(lastGameIdBigInt);
          console.log(lastGameId);

          for (let gameId = 1; gameId <= lastGameId; gameId++) {
            triggerLambdaFunction(gameId);
        }
      
        }
      };

      const triggerLambdaFunction = async (gameId) => {
        const apiEndpoint = 'https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/afterGameCreated';
        const postData = {
            gameId: gameId.toString(),
            scheduleTime: "0,15 * * * ? *" // Cron expression for every 30 mins
        };
       
        try {
            console.log('Sending API Request for Game ID:', gameId, postData);
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
    
            const responseData = await response.json();
            console.log('API Response for Game ID:', gameId, responseData);
        } catch (error) {
            console.error('API Call Error for Game ID:', gameId, error);
        }
    };
    

    return (
        <Fragment>
              <Stack spacing={2} direction="row">
                <TextField
                  variant="outlined"
                  value={registrationContractAddress}
                  label='Reg Contract'
                  onChange={(e) =>
                    setRegistrationContractAdress(e.target.value)
                  }
                />
                <Button variant="contained" onClick={registrationContract}>
                  Set
                </Button>
                <Button variant="contained" color="success" onClick={startRegistration}>
                  Start Registration
                </Button>
                <Button
                  variant="contained"
                  onClick={closeRegistration}
                  color="error"
                >
                  Stop Registration
                </Button>
              </Stack>
        </Fragment>      
    );
}