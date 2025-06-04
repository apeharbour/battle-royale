import React, { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useNavigate } from "react-router-dom";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import yartsLogoTransparent from "./images/yartsLogoTransparent.svg";
import Master4 from "./images/Master4.svg";
import Master6 from "./images/Master6.svg";
import Master7 from "./images/Master7.svg";
import Master8 from "./images/Master8.svg";
import { useAccount } from "wagmi";
import "./App.css";

const svgArray = [
  Master4,
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
    const interval = setInterval(() => {
      setCurrentSvgIndex((prevIndex) => (prevIndex + 1) % svgArray.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Grid
      container
      direction="column" // This ensures vertical alignment
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100vh",
        boxSizing: "border-box",
      }}
      spacing={4}
    >
      <Grid item xs={12}>
        <Box
          component="img"
          src={yartsLogoTransparent}
          alt="Yarts Logo"
          sx={{
            display: "block",
            maxWidth: "100%",
            height: "auto",
            margin: "0 auto",
          }}
        />
      </Grid>

      {/* Changing SVG Image */}
      <Grid item xs={12}>
        <Box
          component="img"
          src={svgArray[currentSvgIndex]}
          alt={`Master ${currentSvgIndex + 1}`}
          sx={{
            width: "90%",
            maxWidth: "180px",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        />
      </Grid>

      {/* Typography */}
      <Grid item xs={12}>
        <Typography sx={{ fontSize: "1.8rem" }} align="center" fontWeight={700}>
          battle. art. onchain.
        </Typography>
      </Grid>

      {/* ConnectKit Button */}
      <Grid item xs={12}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          {/* <ConnectKitButton.Custom>
            {({ isConnected, show }) => {
              if (isConnected && !walletConnected) {
                setWalletConnected(true);
              }

              return (
                <Button
                  onClick={show}
                  sx={{
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    backgroundColor: "transparent",
                    color: "inherit",
                    border: "1px solid currentColor",
                    textTransform: "none",
                    padding: "9px 18px",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.2s ease-in-out",
                    },
                  }}
                >
                  {isConnected ? "connected" : "connect"}
                </Button>
              );
            }}
          </ConnectKitButton.Custom> */}
          <Link href="/registration" underline="none" color="inherit">
            <Button
              sx={{
                fontSize: "1.35rem",
                fontWeight: 700,
                backgroundColor: "transparent",
                color: "inherit",
                border: "1px solid currentColor",
                textTransform: "none",
                padding: "9px 18px",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              game
            </Button>
          </Link>
          <Link href="/gallery" underline="none" color="inherit">
            <Button
              sx={{
                fontSize: "1.35rem",
                fontWeight: 700,
                backgroundColor: "transparent",
                color: "inherit",
                border: "1px solid currentColor",
                textTransform: "none",
                padding: "9px 18px",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              gallery
            </Button>
          </Link>
        </Stack>
      </Grid>
    </Grid>
  );
}
