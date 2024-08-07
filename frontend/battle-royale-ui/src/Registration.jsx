import React, { useState, useEffect, Fragment } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount, useBlockNumber, useAccountEffect } from "wagmi";
import { useSnackbar } from "notistack";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
} from "@mui/material";

import RegistrationPunkAbi from "./abis/RegistrationPunk.json";
import GameAbi from "./abis/GamePunk.json";
import PunkshipsAbi from "./abis/Punkships.json";
import MintShipButton from "./MintShipButton";
import RegisterShipButton from "./RegisterShipButton";
import ToggleBurnedShipsButton from "./ToggleBurnedShipsButton";

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
        burned
        attributes {
          trait
          value
        }
        image
      }
    }
  }
`;

const registrationQuery = gql`
  query registrations {
    registrations {
      firstGameId
      phase
      state
    }
  }
`;

export default function Registration(props) {
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [showYachtSelectError, setShowYachtSelectError] = useState(false);
  const [punkShips, setPunkships] = useState([]);
  const [showBurnedShips, setShowBurnedShips] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    queryClient.invalidateQueries(["ships"]);
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
      setSelectedYacht(null);
    },
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
          burned: ship.burned,
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
    if (!ship.burned) {
      setSelectedYacht(ship);
      setShowYachtSelectError(false);
    } else {
      enqueueSnackbar("You cannot select a burned ship", { variant: "warning" });
    }
  };

  const handleCancelRegistration = () => {
    setSelectedYacht(null);
  };

  const useRegistrationQuery = (select) =>
    useQuery({
      queryKey: ["registrations"],
      queryFn: async () =>
        request(import.meta.env.VITE_SUBGRAPH_URL_REGISTRATION, registrationQuery, {}),
      select,
    });

  const useRegistrationState = () =>
    useRegistrationQuery((data) => {
      return data.registrations.filter((registration) => registration.state === "OPEN");
    });

  const { data: registrationData } = useRegistrationState();

  if (isError) enqueueSnackbar("Error: " + JSON.stringify(error), { variant: "error" });

  return (
    <Fragment>
      <Grid container spacing={2} p={4}>
        <Grid item xs={12}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <RegisterShipButton shipId={selectedYacht?.tokenId} burned={selectedYacht?.burned} punkships={punkShips} onCancel={handleCancelRegistration} />
            </Grid>
            <Grid item>
              <MintShipButton />
            </Grid>
            <Grid item>
              <ToggleBurnedShipsButton
                showBurnedShips={showBurnedShips}
                onToggle={() => setShowBurnedShips(!showBurnedShips)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center" textAlign="center">
            {registrationData && registrationData.length > 0 ? (
              <Typography variant="h6" color="green">
                Registration is now Open!!
              </Typography>
            ) : (
              <Typography variant="h6" color="red">
                Registration is currently closed!!
              </Typography>
            )}
          </Box>
        </Grid>
        {punkShips
          .filter((ship) => showBurnedShips || !ship.burned)
          .map((ship, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  border: selectedYacht === ship ? "2px solid blue" : "none",
                  opacity: ship.burned ? 0.5 : 1,
                  cursor: ship.burned ? "not-allowed" : "pointer",
                }}
                onClick={() => handleCardClick(ship)}
              >
                <CardMedia
                  component="img"
                  alt={ship.name}
                  image={ship.image}
                  title={ship.name}
                  sx={{ height: 140, objectFit: "contain" }}
                />
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {ship.name} {ship.tokenId}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Movement: ${ship.movement}`}
                      sx={{
                        height: '32px',
                        minWidth: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                    <Chip
                      label={`Shoot: ${ship.shoot}`}
                      sx={{
                        height: '32px',
                        minWidth: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                    <Chip
                      label={ship.burned ? "Burned" : "Active"}
                      sx={{
                        height: '32px',
                        minWidth: '100px',
                        backgroundColor: ship.burned ? 'red' : 'green',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Fragment>
  );
}
