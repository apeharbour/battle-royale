import React, { useState, useEffect, Fragment } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount, useBlockNumber, useAccountEffect, useConfig, useWaitForTransactionReceipt } from "wagmi";
import { useSnackbar } from "notistack";

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
  Box,
  Chip,
} from "@mui/material";

import RegistrationPunkAbi from "./abis/RegistrationPunk.json";
import GameAbi from "./abis/GamePunk.json";
import PunkshipsAbi from "./abis/Punkships.json";
import MintShipButton from "./MintShipButton";
import RegisterShipButton from "./RegisterShipButton";

const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const GAME_ADDRESS = import.meta.env.VITE_GAME_ADDRESS;
const PUNKSHIPS_ADDRESS = import.meta.env.VITE_PUNKSHIPS_ADDRESS;
const REGISTRATION_ABI = RegistrationPunkAbi.abi;
const GAME_ABI = GameAbi.abi;
const PUNKSHIPS_ABI = PunkshipsAbi.abi;

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

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

export default function Registration(props) {
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [showYachtSelectError, setShowYachtSelectError] = useState(false);
  const [punkShips, setPunkships] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    console.log("New block: ", blockNumber, "invalidating punkships query");
    queryClient.invalidateQueries(['ships']);
  }, [blockNumber]);

  const account = useAccount();

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["ships", account.address],
    queryFn: async () =>
      request(import.meta.env.VITE_SUBGRAPH_URL_PUNKSHIPS, GET_SHIPS, {
        accountAddress: account.address,
      }),
  });


  useAccountEffect({
    onDisconnect() {
      setSelectedYacht(null)
    },
  })

  useEffect(() => {
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
          tokenId: ship.tokenId,
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


  // if (isFetching) enqueueSnackbar("Loading...", { variant: "info" });
  if (isError) enqueueSnackbar("Error: " + JSON.stringify(error), { variant: "error" });

  return (
    <Fragment>
      <Accordion>
        <AccordionSummary>
          <Typography variant="h6">Register your ship</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {punkShips.map((ship, index) => (
              <Grid item xs={3} key={index}>
                <Card
                  sx={{
                    border: selectedYacht === ship ? "2px solid blue" : "none",
                  }}
                  onClick={() => handleCardClick(ship)}
                >
                  <CardMedia
                    component="img"
                    alt={ship.name}
                    // height={80}
                    image={ship.image}
                    title={ship.name}
                    // sx={{ width: 151 }}
                  />
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {ship.name}
                    </Typography>
                    <Chip label={`Movement: ${ship.movement}`} />
                    <Chip label={`Shoot: ${ship.shoot}`} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item xs={5}>
              <RegisterShipButton shipId={selectedYacht?.tokenId} />
            </Grid>

            <Grid item xs={5}>
              <MintShipButton />
            </Grid>

          </Grid>
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
}
