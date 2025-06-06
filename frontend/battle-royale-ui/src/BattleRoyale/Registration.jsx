import React, { useState, useEffect, Fragment } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
import { useAccount, useBlockNumber, useAccountEffect } from "wagmi";
import { useSnackbar } from "notistack";

import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

// import MintShipButton from "./MintShipButton";
import RegisterShipButton from "./RegisterShipButton";
import RegistrationCountdown from "./RegistrationCountDown";
import ActiveShip from "./ActiveShip";
import NotConnected from "./NotConnected";

const GET_SHIPS = gql`
  query getYarts($accountAddress: ID!) {
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
  const [yarts, setyarts] = useState([]);
  const [showBurnedShips, setShowBurnedShips] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

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
      request(import.meta.env.VITE_SUBGRAPH_URL_YARTS, GET_SHIPS, {
        accountAddress: account.address,
      }),
    enabled: !!account.address,
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
      setyarts([]);
    } else if (data.account) {
      const ships = data.account.punkships.map((ship) => {
        const movement = ship.attributes.find(
          (attr) => attr.trait === "movement"
        ).value;
        const shoot = ship.attributes.find(
          (attr) => attr.trait === "range"
        ).value;
        const shipType = ship.attributes.find(
          (attr) => attr.trait === "type"
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

      setyarts(ships);
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
  const noteColor = isRegistrationOpen ? "green" : "red";
  const openRegistrationTimestamp = isRegistrationOpen
    ? parseInt(
        registrationData[0]?.registrationStarted?.blockTimestamp || 0,
        10
      )
    : null;

  return (
    <Fragment>
      {account?.address ? (
        <Grid container spacing={2} p={2}>
          <Grid item size={12}>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item size={{ xs: 12, md: 6 }}>
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
                    sx={{ fontSize: "1rem" }}
                    color={noteColor}
                    component="div"
                    textAlign="center"
                  >
                    {isRegistrationOpen
                      ? "registration is currently open! register your ship now."
                      : "registration is currently closed!"}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "1rem" }}
                    color={noteColor}
                    component="div"
                    textAlign="center"
                  >
                    {isRegistrationOpen
                      ? "the game screen will be available in the 'active games' tab once registration ends."
                      : "please check back later for more updates."}
                  </Typography>
                  {isRegistrationOpen && openRegistrationTimestamp && (
                    <RegistrationCountdown
                      registrationTimestamp={openRegistrationTimestamp}
                    />
                  )}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-12px",
                      right: "16px",
                      backgroundColor: "#000",
                      padding: "0 8px",
                      fontWeight: "bold",
                      color: noteColor,
                      borderRadius: "4px",
                      fontSize: "1rem",
                    }}
                  >
                    note
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item size={12}>
                  <RegisterShipButton
                    shipId={selectedYacht?.tokenId}
                    burned={selectedYacht?.burned}
                    yarts={yarts}
                    onCancel={handleCancelRegistration}
                    isRegistrationOpen={isRegistrationOpen}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {yarts
            .filter((ship) => showBurnedShips || !ship.burned)
            .map((ship, index) => (
              <Grid item size={{ xs: 12, md: 2 }} key={index}>
                <ActiveShip
                  ship={ship}
                  handleCardClick={handleCardClick}
                  selectedYacht={selectedYacht}
                />
              </Grid>
            ))}
        </Grid>
      ) : (
        <NotConnected />
      )}
    </Fragment>
  );
}
