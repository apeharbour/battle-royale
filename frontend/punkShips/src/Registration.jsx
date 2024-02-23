import React, { useState, useEffect, Fragment } from "react";
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
import GameAbi from "./abis/GamePunk.json";

import img1 from "./images/6.png";
import img2 from "./images/8.png";
import img3 from "./images/7.png";
import img4 from "./images/4.png";
import img5 from "./images/5.png";

// const REGISTRATION_ADDRESS = "0x9f6B8fB16545878d8711F3E7e8fd9B6C570F2FcC";
// const REGISTRATION_ABI = RegistrationPunkAbi.abi;

const GAME_ADDRESS = "0xdbe95A967Ce8fc1a74d4Ae8E67686b091079E73A";
const GAME_ABI = GameAbi.abi;

const punkShips = [
  { name: "Sailing Ship", movement: 6, shoot: 2, image: img1 },
  { name: "Three-master", movement: 5, shoot: 3, image: img2 },
  { name: "Four-master", movement: 4, shoot: 4, image: img3 },
  { name: "Five-master", movement: 3, shoot: 5, image: img4 },
  { name: "Superyacht", movement: 2, shoot: 6, image: img5 },
];

export default function Registration(props) {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [player, setPlayer] = useState(null);
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [showYachtSelectError, setShowYachtSelectError] = useState(false);
  const [testGameId, setTestGameId] = useState(0);

  // useEffect(() => {
  //   const fetchContract = async () => {
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const contract = new ethers.Contract(
  //       REGISTRATION_ADDRESS,
  //       REGISTRATION_ABI,
  //       signer
  //     );
  //     setContract(contract);
  //     setProvider(provider);
  //     setPlayer(signer.address);
  //   };

  //   fetchContract();
  // }, []);


  useEffect(() => {
    const fetchContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(GAME_ADDRESS, GAME_ABI, signer);
      setContract(contract);
      setProvider(provider);
      setPlayer(signer.address);
      // console.log("Player address:", signer.address);
    };

    fetchContract();
  }, []); 

  const handleCardClick = (ship) => {
    setSelectedYacht(ship);
    setShowYachtSelectError(false);
  };

  // const register = async () => {
  //   if (contract !== null) {
  //     console.log("Adding ship");
  //     const tx = await contract
  //       .registerPlayer(selectedYacht.movement, selectedYacht.shoot)
  //       .catch(console.error);
  //     await tx.wait();
  //   }
  //   console.log("Added ship");
  // };

  const register = async () => {
    if (contract !== null) {
      console.log("Adding ship");
      const tx = await contract.addShip(player, testGameId, selectedYacht.movement, selectedYacht.shoot).catch(console.error);
      await tx.wait();
      console.log("Added ship");
  }
}

  return (
    <Fragment>
      <Accordion sx={{ width: '200%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "cyan"}}>
          <Typography variant="h6">Register with Punk Ships</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "cyan"}} >
          <Grid container spacing={2}>
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
    </Fragment>
  )
}


