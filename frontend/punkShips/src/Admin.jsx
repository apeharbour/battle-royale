import React, { useState, useEffect, Fragment } from "react";
import { ethers } from "ethers";
import GameAbi from "./abis/GamePunk.json";
import { TextField, Button, Stack } from "@mui/material";

const GAME_ADDRESS = "0x47f321419Aa908bcb090BBF4dc8E9Fc72c47358f";
const GAME_ABI = GameAbi.abi;

export default function Game(props) {

    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [player, setPlayer] = useState(null);
    const [registrationContractAddress, setRegistrationContractAdress] = useState("");

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

      const registrationContract = async () => {
        if (contract) {
          const tx = await contract
            .setRegistrationContract(registrationContractAddress)
            .catch(console.error);
          await tx.wait();
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
              </Stack>
        </Fragment>      
    );
}