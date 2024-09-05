import React, { useState, useEffect, Fragment } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount, useBlockNumber, useAccountEffect } from "wagmi";
import { useSnackbar } from "notistack";

import { Box, Grid, Typography } from "@mui/material";

import MintShipButton from "./MintShipButton";
import RegisterShipButton from "./RegisterShipButton";
import RegistrationCountdown from "./RegistrationCountDown";
import ActiveShip from "./ActiveShip";

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
      registrationStarted {
        blockTimestamp
      }
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
    enabled: !!account.address, // Ensure query only runs when account.address exists
  });

  useEffect(() => {
    if (isError && error) {
      enqueueSnackbar("Error: " + JSON.stringify(error), { variant: "error" });
    }
  }, [isError, error, enqueueSnackbar]);

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
      enqueueSnackbar(
        `Selected ship ${ship.name} ${ship.tokenId} for registration`,
        { variant: "info" }
      );
      setSelectedYacht(ship);
      setShowYachtSelectError(false);
    } else {
      enqueueSnackbar("You cannot select a burned ship", {
        variant: "warning",
      });
    }
  };

  const handleCancelRegistration = () => {
    setSelectedYacht(null);
  };

  const useRegistrationQuery = (select) =>
    useQuery({
      queryKey: ["registrations"],
      queryFn: async () =>
        request(
          import.meta.env.VITE_SUBGRAPH_URL_REGISTRATION,
          registrationQuery,
          {}
        ),
      select,
    });

  const useRegistrationState = () =>
    useRegistrationQuery((data) => {
      return data.registrations.filter(
        (registration) => registration.state === "OPEN"
      );
    });

  const { data: registrationData } = useRegistrationState();


  const isRegistrationOpen = registrationData && registrationData.length > 0;
  const noteColor = isRegistrationOpen ? "#00ffcc" : "red";
  const openRegistrationTimestamp = isRegistrationOpen
    ? parseInt(registrationData[0]?.registrationStarted.blockTimestamp, 10)
    : null;

  return (
    <Fragment>
      <Grid container spacing={2} p={4}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  border: `1px solid ${noteColor}`,
                  borderRadius: "8px",
                  padding: "16px",
                  position: "relative",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h5"
                  color={noteColor}
                  component="div"
                  textAlign="center"
                >
                  {isRegistrationOpen
                    ? "Registration is currently open! Register your ship now."
                    : "Registration is currently closed!"}
                </Typography>
                <Typography
                  variant="h5"
                  color={noteColor}
                  component="div"
                  textAlign="center"
                >
                  {isRegistrationOpen
                    ? "The game screen will be available in the 'Active Games' tab once registration ends."
                    : "Please check back later for more updates."}
                </Typography>
                {isRegistrationOpen && openRegistrationTimestamp ? (
                  <RegistrationCountdown
                    registrationTimestamp={openRegistrationTimestamp}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    textAlign="center"
                  >
                    Loading registration data...
                  </Typography>
                )}
                <Box
                  sx={{
                    position: "absolute",
                    top: "-12px",
                    right: "16px",
                    backgroundColor: "#black",
                    padding: "0 8px",
                    fontWeight: "bold",
                    color: noteColor,
                    borderRadius: "4px",
                  }}
                >
                  NOTE
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12} mt={2} mb={1}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <RegisterShipButton
                  shipId={selectedYacht?.tokenId}
                  burned={selectedYacht?.burned}
                  punkships={punkShips}
                  onCancel={handleCancelRegistration}
                  isRegistrationOpen={isRegistrationOpen}
                />
              </Grid>
              <Grid item>
                <MintShipButton />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {punkShips
          .filter((ship) => showBurnedShips || !ship.burned)
          .map((ship, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ActiveShip
                ship={ship}
                handleCardClick={handleCardClick}
                selectedYacht={selectedYacht}
              />
            </Grid>
          ))}
      </Grid>
    </Fragment>
  );
}
