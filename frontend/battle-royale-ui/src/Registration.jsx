import React, { useState, useEffect, Fragment } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount, useBlockNumber, useWriteContract, useConfig, useWaitForTransactionReceipt } from "wagmi";
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
  const {
    writeContract,
    hash,
    isPending: isTxPending,
    isSuccess: isTxSuccess,
    isError: isTxError,
    error: txError,
  } = useWriteContract();

  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } =  useWaitForTransactionReceipt({hash});

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["ships", account.address],
    queryFn: async () =>
      request(import.meta.env.VITE_SUBGRAPH_URL_PUNKSHIPS, GET_SHIPS, {
        accountAddress: account.address,
      }),
  });

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

  const register = () => {
    console.log("Registering ship: ", parseInt(selectedYacht.tokenId));
    writeContract({
      abi: REGISTRATION_ABI,
      address: REGISTRATION_ADDRESS,
      functionName: "registerPlayer",
      args: [parseInt(selectedYacht.tokenId)],
    })

  };

  // if (isFetching) enqueueSnackbar("Loading...", { variant: "info" });
  if (isError) enqueueSnackbar("Error: " + JSON.stringify(error), { variant: "error" });
  // if (isTxPending) enqueueSnackbar("Transaction pending...", { variant: "info" });
  if (isTxConfirming) enqueueSnackbar("Waiting for confirmation...", { variant: "info" });
  if (isTxConfirmed) enqueueSnackbar("Transaction confirmed!", { variant: "success" });
  if (isTxError) { 
    console.log('msg', txError.message)
  } 
  if (isTxSuccess) enqueueSnackbar("Transaction success!", { variant: "success" });
  // enqueueSnackbar("Error: " + txError.message + 'meta:' + txError.metaMessages, { variant: "error" });


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
              <Button
                variant="outlined"
                onClick={register}
                disabled={!selectedYacht || isTxPending}
                // sx={{ backgroundColor: "gray", color: "black" }}
              >
                { isTxPending ? 'Confirming...' : 'Add Ship' }
              </Button>
              { hash && <Typography>Transaction Hash: {hash} </Typography>}
              { isTxConfirming && <Typography>Waiting for confirmation... </Typography>}
              { isTxConfirmed && <Typography>Transaction confirmed! </Typography>}

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
