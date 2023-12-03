import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RegistrationPunkAbi from "./abis/RegistrationPunk.json";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import img1 from "./images/6.png";
import img2 from "./images/8.png";
import img3 from "./images/7.png";
import img4 from "./images/4.png";
import img5 from "./images/5.png";

const REGISTRATION_ADDRESS = "0x2300Bc033C668eC7a5De3BC5CDF46277b9f9b46C";
const REGISTRATION_ABI = RegistrationPunkAbi.abi;

const punkShips = [
  { name: "Sailing Ship", movement: 6, shoot: 2, image: img1 },
  { name: "Three-master", movement: 5, shoot: 3, image: img2 },
  { name: "Four-master", movement: 4, shoot: 4, image: img3 },
  { name: "Five-master", movement: 3, shoot: 5, image: img4 },
  { name: "Superyacht", movement: 2, shoot: 6, image: img5 },
];

export default function RegistrationPunk(props) {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [player, setPlayer] = useState(null);
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [showYachtSelectError, setShowYachtSelectError] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        REGISTRATION_ADDRESS,
        REGISTRATION_ABI,
        signer
      );
      setContract(contract);
      setProvider(provider);
      setPlayer(signer.address);
      console.log("Player Address:", signer.address);
    };

    fetchContract();
  }, []);

  const handleCardClick = (ship) => {
    setSelectedYacht(ship);
    setShowYachtSelectError(false);
  };

  const register = async () => {
    if (contract !== null) {
      console.log("Adding ship");
      const tx = await contract
        .registerPlayer(props.gameId, selectedYacht.movement, selectedYacht.shoot)
        .catch(console.error);
      await tx.wait();
    }
    console.log("Added ship");
  };

  const stopRegistration = async () => {
    if (contract !== null) {
      console.log(`Closing player registration for game with ID: ${props.gameId} `);
      const tx = await contract.closeRegistration().catch(console.error);
      await tx.wait();
    }
  };

  return (
    <Container>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "cyan"}}>
          <Typography variant="h6">Register with Punk Ships</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "cyan"}} >
          <Grid container spacing={2} mt={4}>
            <Grid item xs={12}>
              {player === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" ||
              player === "0xCd9680dd8318b0df924f0bD47a407c05B300e36f" ? (
                <Button
                  variant="contained"
                  onClick={stopRegistration}
                  color="error"
                >
                  Stop Registration
                </Button>
              ) : null}
            </Grid>
            <Grid item xs={7}>
              {punkShips.map((ship, index) => (
                <Card
                  key={index}
                  sx={{
                    display: "flex",
                    border: selectedYacht === ship ? "2px solid blue" : "none",
                    backgroundColor: "cyan"
                  }}
                  onClick={() => handleCardClick(ship)}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {selectedYacht === ship && (
                      <CheckCircleIcon color="#0000FF" />
                    )}
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <Typography gutterBottom variant="h6" component="h2">
                        {ship.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        Movement: {ship.movement}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        Shoot: {ship.shoot}
                      </Typography>
                    </CardContent>
                  </Box>

                  <CardMedia
                    component="img"
                    alt={ship.name}
                    height={80}
                    image={ship.image}
                    title={ship.name}
                    sx={{ width: 151 }}
                  />
                </Card>
              ))}
            </Grid>
            <Grid item xs={5} mt={30}>
              <Button
                variant="outlined"
                onClick={register}
                disabled={!selectedYacht}
                sx={{ backgroundColor: "gray", color: "black"}}
              >
                Add Ship
              </Button>
              {showYachtSelectError && (
                <Typography>
                  Please select a yacht first.
                </Typography>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Container>
  )
}


