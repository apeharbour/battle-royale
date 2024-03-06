import React, { useState, useEffect, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { request, gql } from 'graphql-request'
import { useAccount, useWriteContract } from "wagmi";


import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import img1 from "./images/6.png";
import img2 from "./images/8.png";
import img3 from "./images/7.png";
import img4 from "./images/4.png";
import img5 from "./images/5.png";

const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const PUNKSHIPS_ADDRESS = import.meta.env.VITE_PUNKSHIPS_ADDRESS;
const REGISTRATION_ABI = RegistrationPunkAbi.abi;
const GAME_ABI = GameAbi.abi;
const PUNKSHIPS_ABI = PunkshipsAbi.abi;

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const ACCOUNT_ADDRESS = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

// const GET_SHIPS = graphql(`
const GET_SHIPS = gql`
  query getPunkships($accountAddress: ID!) {
    account(id: $accountAddress) {
      id
      punkships {
        tokenId
        attributes {
          trait
          value
        }
        image
      }
    }
  }
`;

// const punkShips = [
//   { name: "Sailing Ship", movement: 6, shoot: 2, image: img1 },
//   { name: "Three-master", movement: 5, shoot: 3, image: img2 },
//   { name: "Four-master", movement: 4, shoot: 4, image: img3 },
//   { name: "Five-master", movement: 3, shoot: 5, image: img4 },
//   { name: "Superyacht", movement: 2, shoot: 6, image: img5 },
// ];

export default function Registration(props) {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [player, setPlayer] = useState(null);
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [showYachtSelectError, setShowYachtSelectError] = useState(false);
  const [testGameId, setTestGameId] = useState(0);
  const [punkShips, setPunkships] = useState([]);

  // const { loading, error, data, refetch } = useQuery(GET_SHIPS, {
  //   variables: { accountAddress: NULL_ADDRESS },
  // });

  const account = useAccount();

  // const gqlClient = new GraphQLClient(import.meta.env.VITE_SUBGRAPH_URL_GAME);
  // console.log("GQL Client: ", gqlClient);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ships"],
    queryFn: async () =>
      request(import.meta.env.VITE_SUBGRAPH_URL_GAME, GET_SHIPS, {
        accountAddress: account.address,
      }),
  });

  //   useEffect(() => {
  //     const fetchContract = async () => {
  //       console.log("Fetching contract");
  //       console.log("Environment: ", import.meta.env);

  //       const provider = new ethers.BrowserProvider(window.ethereum);
  //       setProvider(provider);

  //       console.log("Provider: ", provider);

  //       const signer = await provider.getSigner();
  //       console.log("Signer addr: ", signer.address);
  //       setPlayer(signer.address);
  // try {

  //   console.log("Registration address: ", REGISTRATION_ADDRESS);
  //   // console.log("Registration ABI: ", REGISTRATION_ABI);

  //   const registrationContract = new ethers.Contract(
  //     REGISTRATION_ADDRESS,
  //     REGISTRATION_ABI,
  //     signer
  //     );
  //     console.log("Registration contract: ", registrationContract);
  //     setRegistrationContract(registrationContract);
  //   } catch (error) {
  //     console.log("Error: ", error);
  //   }
  //     };

  //     fetchContract();
  //   }, []);

  // useEffect(() => {
  //   //refetch if player changes
  //   console.log("Player changed: ", player, ". Refetching...");
  //   if (player) {
  //     refetch({ accountAddress: player });
  //   }
  // }, [player]);

  useEffect(() => {
    console.log("Data changed: ", data, ", player: ", account.address);
    if (!data || (data && !data.account)) {
      setPunkships([]);
    } else if (data.account) {
      const ships = data.account.punkships.map((ship) => {
        const movement = ship.attributes.find(
          (attr) => attr.trait === "range"
        ).value;
        const shoot = ship.attributes.find(
          (attr) => attr.trait === "shootingRange"
        ).value;
        const shipType = ship.attributes.find(
          (attr) => attr.trait === "shipType"
        ).value;
        return {
          tokenId: ship.tokeId,
          movement: movement,
          shoot: shoot,
          name: shipType,
          image: ship.image,
        };
      });

      setPunkships(ships);
    }
  }, [data]);

  const handleCardClick = (ship) => {
    setSelectedYacht(ship);
    setShowYachtSelectError(false);
  };

  const register = () => {
    console.log("Registering ship: ", selectedYacht);
    writeContract({
      abi: REGISTRATION_ABI,
      address: REGISTRATION_ADDRESS,
      functionName: "registerPlayer",
      params: [BigInt(selectedYacht.tokenId)],
    })

    // if (registrationContract !== null) {
    //   console.log("Adding ship");
    //   const tx = await registrationContract
    //     .registerPlayer(selectedYacht.movement, selectedYacht.shoot)
    //     .catch(console.error);
    //   await tx.wait();
    // }
    console.log("Added ship");
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {JSON.stringify(error)}</p>;

  return (
    <Fragment>
      <Accordion sx={{ width: "200%" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ backgroundColor: "cyan" }}
        >
          <Typography variant="h6">Register with Punk Ships</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "cyan" }}>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              {punkShips.map((ship, index) => (
                <Card
                  key={index}
                  sx={{
                    display: "flex",
                    border: selectedYacht === ship ? "2px solid blue" : "none",
                    backgroundColor: "cyan",
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
                sx={{ backgroundColor: "gray", color: "black" }}
              >
                Add Ship
              </Button>
              {showYachtSelectError && (
                <Typography>Please select a yacht first.</Typography>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
}
