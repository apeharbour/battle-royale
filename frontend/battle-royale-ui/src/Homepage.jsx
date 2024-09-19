import React, { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import yartsLogo from "./images/yartsLogo.svg";
import Master1 from "./images/Master1.svg";
import Master2 from "./images/Master2.svg";
import Master3 from "./images/Master3.svg";
import Master4 from "./images/Master4.svg";
import Master5 from "./images/Master5.svg";
import Master6 from "./images/Master6.svg";
import Master7 from "./images/Master7.svg";
import Master8 from "./images/Master8.svg";
import { useAccount } from "wagmi";
import "./app.css";

const svgArray = [
  Master1,
  Master2,
  Master3,
  Master4,
  Master5,
  Master6,
  Master7,
  Master8,
];

export default function Homepage() {
  const [currentSvgIndex, setCurrentSvgIndex] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const navigate = useNavigate();
  const { address } = useAccount();

  useEffect(() => {
    if (walletConnected) {
      navigate("/registration");
    }
  }, [walletConnected, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSvgIndex((prevIndex) => (prevIndex + 1) % svgArray.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid
        item
        size={12}
        justifyContent="center"
        alignContent="center"
        alignItems="center"
      >
        <Box
          component="img"
          src={yartsLogo}
          alt="Yarts Logo"
          sx={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: -40,
            marginBottom: -50,
          }}
        />
      </Grid>
      <Grid item size={12}>
        <Box
          component="img"
          src={svgArray[currentSvgIndex]}
          alt={`Master ${currentSvgIndex + 1}`}
          sx={{
            width: "450px",
            height: "300px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 4,
          }}
        />
      </Grid>
      <Grid item size={12}>
        <Typography variant="h5" align="center" fontWeight={700}>
          Battle. Art. Onchain.
        </Typography>
      </Grid>
      <Grid item size={12}>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
          <ConnectKitButton.Custom>
            {({ isConnected, show }) => {
              if (isConnected && !walletConnected) {
                setWalletConnected(true);
              }

              return (
                <Button
                  onClick={show}
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    backgroundColor: "transparent",
                    color: "inherit",
                    border: "none",
                    "&:hover": {
                      border: "1px solid currentColor",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                    textTransform: "none",
                  }}
                >
                  {isConnected ? "Connected" : "Connect"}
                </Button>
              );
            }}
          </ConnectKitButton.Custom>
        </Box>
      </Grid>
    </Grid>
  );
}
