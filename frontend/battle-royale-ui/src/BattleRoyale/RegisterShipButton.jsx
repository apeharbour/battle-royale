import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { useSnackbar } from "notistack";
import { Box, DialogActions, Stack, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import RegistrationyartsAbi from "../abis/Registrationyarts.json";
import RegistrationAcknowledgementDialog from "./RegistrationAcknowledgement";
import "./MintShip.css";
import Button from "@mui/material/Button";
import removeYachtBackground from "./RemoveYachtBackground";

const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const REGISTRATION_ABI = RegistrationyartsAbi;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const HolographicButtonGreen = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "16px 27px",
  color: "#00ffcc",
  border: "1.8px solid #00ffcc",
  textTransform: "none",
  borderRadius: "20px",
  "& .MuiButton-label": {
    fontSize: "1rem",
  },
  cursor: "pointer",
  overflow: "hidden",
  transition: "transform 0.2s ease",
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

const HolographicButtonRed = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "16px 27px",
  color: "#ff3366",
  border: "1.8px solid #ff3366",
  textTransform: "none",
  borderRadius: "20px",
  "& .MuiButton-label": {
    fontSize: "1rem",
  },
  cursor: "pointer",
  overflow: "hidden",
  transition: "transform 0.2s ease",
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

export default function RegisterShipButton({
  shipId,
  burned,
  yarts,
  onCancel,
  isRegistrationOpen,
}) {
  const [txInFlight, setTxInFlight] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [acknowledgementDialogOpen, setAcknowledgementDialogOpen] =
    useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  const {
    data: registrationStatus,
    isPending: isCheckingRegistration,
    error: readError,
  } = useReadContract({
    address: REGISTRATION_ADDRESS,
    abi: REGISTRATION_ABI,
    functionName: "registeredPlayers",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const isAlreadyRegistered =
    registrationStatus &&
    (registrationStatus.registered || registrationStatus[0]);

  const { data: hash, writeContract, error: writeError } = useWriteContract();

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (shipId) {
      setRegistrationDialogOpen(true);
    }
  }, [shipId]);

  const registerShip = () => {
    if (!isRegistrationOpen) {
      enqueueSnackbar("Registration is closed, check back later!", {
        variant: "error",
      });
      return;
    }

    enqueueSnackbar(`Registering ship ${shipId} for ${address}`, {
      variant: "info",
    });
    console.log(`Registering ship ${shipId} for ${address}`);
    writeContract({
      abi: REGISTRATION_ABI,
      address: REGISTRATION_ADDRESS,
      functionName: "registerPlayer",
      args: [shipId],
    });
    setTxInFlight(true);
  };

  useEffect(() => {
    if (isConfirmed && txInFlight) {
      enqueueSnackbar(`Ship ${shipId} registered`, { variant: "success" });
      console.log(`Ship ${shipId} registered`, receipt);
      setTxInFlight(false);
      setRegistrationDialogOpen(false);
      navigate("/activegames");
    }
  }, [isConfirmed, txInFlight]);

  useEffect(() => {
    if (writeError) {
      if (writeError.code === 4001) {
        enqueueSnackbar("Transaction rejected by user", { variant: "error" });
      } else {
        enqueueSnackbar("An error occurred during the transaction", {
          variant: "error",
        });
      }
      setTxInFlight(false);
    }
  }, [writeError, enqueueSnackbar]);

  const handleClose = () => {
    enqueueSnackbar("Registration cancelled", { variant: "info" });
    setRegistrationDialogOpen(false);
    onCancel();
  };

  // When the user clicks register, check if they are already registered.
  const handleRegisterClick = () => {
    if (isAlreadyRegistered) {
      enqueueSnackbar("Account already registered", { variant: "info" });
      return;
    }
    enqueueSnackbar("Please acknowledge the terms and conditions", {
      variant: "info",
    });
    setAcknowledgementDialogOpen(true);
  };

  const handleAgree = () => {
    setAcknowledgementDialogOpen(false);
    registerShip();
  };

  const handleAcknowledgementClose = () => {
    setAcknowledgementDialogOpen(false);
    handleClose();
  };

  const shipData = yarts.find((ship) => ship.tokenId === shipId);

  // Early return if no ship data found
  if (!shipData) {
    return null;
  }

  const modifiedImage = removeYachtBackground(shipData.image);

  return (
    <Fragment>
      {shipData && (
        <BootstrapDialog
          open={registrationDialogOpen}
          onClose={handleClose}
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              fontSize: "2rem",
              fontWeight: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            confirm your registration
          </DialogTitle>
          <DialogContent dividers>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={2}
            >
              <Box textAlign="left" mr={2}>
                <Typography gutterBottom sx={{ fontSize: "1rem" }}>
                  name: {shipData.name}
                </Typography>
                <Typography gutterBottom sx={{ fontSize: "1rem" }}>
                  movement: {shipData.movement}
                </Typography>
                <Typography gutterBottom sx={{ fontSize: "1rem" }}>
                  shoot: {shipData.shoot}
                </Typography>
              </Box>
              <Box
                component="img"
                src={modifiedImage}
                alt={shipData.name}
                sx={{ maxWidth: "25%", height: "auto", marginLeft: "10px" }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Stack spacing={4} direction="row" justifyContent="center">
              <HolographicButtonRed
                onClick={handleClose}
                disabled={isConfirming}
              >
                cancel
              </HolographicButtonRed>
              <HolographicButtonGreen
                onClick={handleRegisterClick}
                disabled={
                  !shipId ||
                  isConfirming ||
                  !isConnected ||
                  burned ||
                  isAlreadyRegistered ||
                  isCheckingRegistration
                }
              >
                {isAlreadyRegistered
                  ? "already registered"
                  : isConfirming
                  ? "confirming..."
                  : "register"}
              </HolographicButtonGreen>
            </Stack>
          </DialogActions>
        </BootstrapDialog>
      )}

      <RegistrationAcknowledgementDialog
        open={acknowledgementDialogOpen}
        onClose={handleAcknowledgementClose}
        onAgree={handleAgree}
      />
    </Fragment>
  );
}
