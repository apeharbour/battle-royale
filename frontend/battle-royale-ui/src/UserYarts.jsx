import React, { Fragment, useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useNavigate } from "react-router-dom";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  Box,
  Button,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useSnackbar } from "notistack";
import Yarts from "./Yarts";
import MintAcknowledgement from "./MintAcknowledgement";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid2";
import yartsLogoTransparent from "./images/yartsLogoTransparent.svg";
import Master1 from "./images/Master1.svg";
import Master2 from "./images/Master2.svg";
import Master3 from "./images/Master3.svg";
import Master4 from "./images/Master4.svg";
import Master5 from "./images/Master5.svg";
import Master6 from "./images/Master6.svg";
import Master7 from "./images/Master7.svg";
import Master8 from "./images/Master8.svg";
import { styled } from "@mui/material/styles";
import "./App.css";

import deployed_addresses from "./contract-deployment/deployed_addresses.json";
import yarts_config from "./contract-deployment/Yarts.json";

const YARTS_ABI = yarts_config.abi;
const YARTS_ADDRESS = deployed_addresses["Yarts"];

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

const HolographicButton = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "16px 27px",
  color: "#00ffcc",
  border: "1.8px solid #00ffcc",
  borderRadius: "27px",
  cursor: "pointer",
  overflow: "hidden",
  transition: "transform 0.2s ease",
  marginLeft: { xs: 0, sm: "1rem" }, // Adjusted for spacing when side by side
  fontFamily: theme.typography.fontFamily,
  "&:hover": {
    transform: "scale(1.05)",
    background: "black",
  },
  "&:disabled": {
    cursor: "not-allowed",
    borderColor: "#555",
    color: "#777",
    background: "#333",
  },
}));

const HolographicYellowButton = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "16px 27px",
  color: "#FFD700",
  border: "1.8px solid #FFD700",
  borderRadius: "27px",
  cursor: "pointer",
  overflow: "hidden",
  transition: "transform 0.2s ease",
  marginLeft: { xs: 0, sm: "1rem" },
  fontFamily: theme.typography.fontFamily,
  "&:hover": {
    transform: "scale(1.05)",
    background: "black",
  },
  "&:disabled": {
    cursor: "not-allowed",
    borderColor: "#555",
    color: "#777",
    background: "#333",
  },
}));

export default function Homepage() {
  const [currentSvgIndex, setCurrentSvgIndex] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [txInFlight, setTxInFlight] = useState(false);
  const [numYarts, setNumYarts] = useState(1);
  const [acknowledgementDialogOpen, setAcknowledgementDialogOpen] =
    useState(false);
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  const { enqueueSnackbar } = useSnackbar();

  const RESERVED_MINTED = 100n;
  const OPEN_MINT_AMOUNT = 24000n;

  useEffect(() => {
    if (isConfirmed && txInFlight) {
      console.log("Ship minted", receipt);
      setTxInFlight(false);
    }
  }, [isConfirmed, txInFlight, receipt]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSvgIndex((prevIndex) => (prevIndex + 1) % svgArray.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch the price from the contract
  const { data: price, isLoading: isPriceLoading } = useReadContract({
    abi: YARTS_ABI,
    address: YARTS_ADDRESS,
    functionName: "getPrice",
  });

  const PRICE = price ? BigInt(price) : BigInt(0);

  const { data: mintCount, isLoading: isMintCountLoading } = useReadContract({
    abi: YARTS_ABI,
    address: YARTS_ADDRESS,
    functionName: "getMintedCount",
  });

  const MINT_COUNT = mintCount ? BigInt(mintCount) : BigInt(0);

  const { data: maxSupply, isLoading: isMaxSupplyLoading } = useReadContract({
    abi: YARTS_ABI,
    address: YARTS_ADDRESS,
    functionName: "MAX_SUPPLY",
  });

  const MAX_SUPPLY = maxSupply ? BigInt(maxSupply) : BigInt(0);

  const mintShip = () => {
    if (!isConnected) {
      enqueueSnackbar("Please connect your wallet first", {
        variant: "warning",
      });
      return;
    }
    console.log(
      `Minting ${numYarts} ${numYarts === 1 ? "yart" : "yarts"} for ${address}`
    );
    enqueueSnackbar(
      `Minting ${numYarts} ${numYarts === 1 ? "yart" : "yarts"} for you`,
      { variant: "info" }
    );
    writeContract({
      abi: YARTS_ABI,
      address: YARTS_ADDRESS,
      functionName: "safeMint",
      args: [address, numYarts],
      value: PRICE * BigInt(numYarts),
    });
    setTxInFlight(true);
  };

  const handleAcknowledgementClose = () => {
    setAcknowledgementDialogOpen(false);
  };

  const handleAgree = () => {
    setAcknowledgementDialogOpen(false);
    mintShip();
  };

  const handleMintClick = () => {
    enqueueSnackbar("Please acknowledge the terms and conditions", {
      variant: "info",
    });
    setAcknowledgementDialogOpen(true);
  };

  return (
    <Fragment>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "30vh",
         
        }}
        spacing={4}
      >
        {/* <Grid xs={12}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Box
            component="img"
            src={yartsLogoTransparent}
            alt="Yarts Logo"
            sx={{
              display: "block",
              maxWidth: "90%",
              height: "auto",
              margin: "0 auto",
            }}
          />
          </Link>
        </Grid> */}
        <Grid xs={12}>
          <Box
            component="img"
            src={svgArray[currentSvgIndex]}
            alt={`Master ${currentSvgIndex + 1}`}
            sx={{
              width: "80%",
              maxWidth: "180px",
              height: "auto",
              display: "block",
              margin: "0 auto",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          />
        </Grid>
        {/* Typography */}
        <Grid xs={12}>
          <Typography
            sx={{ fontSize: "1.5rem" }}
            align="center"
            fontWeight={700}
          >
            onchain art on apechain.
          </Typography>
        </Grid>

        {/* ConnectKit Button */}
        <Grid xs={12}>
          <ConnectKitButton.Custom>
            {({ isConnected, show }) => {
              if (isConnected && !walletConnected) {
                setWalletConnected(true);
              }

              return (
                <Button
                  onClick={show}
                  sx={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    backgroundColor: "transparent",
                    color: "inherit",
                    border: "1px solid currentColor",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                    textTransform: "none",
                    padding: "9px 18px",
                  }}
                >
                  {isConnected ? "connected" : "connect"}
                </Button>
              );
            }}
          </ConnectKitButton.Custom>
        </Grid>
        </Grid>
      {isConnected && <Yarts />}
    </Fragment>
  );
}
