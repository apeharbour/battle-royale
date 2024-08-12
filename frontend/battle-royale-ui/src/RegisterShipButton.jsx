import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useSnackbar } from "notistack";
import { Box, Button, Stack, Typography } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { styled } from "@mui/material/styles";
import RegistrationPunkAbi from "./abis/RegistrationPunk.json";

const REGISTRATION_ADDRESS = import.meta.env.VITE_REGISTRATION_ADDRESS;
const REGISTRATION_ABI = RegistrationPunkAbi;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function RegisterShipButton({ shipId, burned, punkships, onCancel, isRegistrationOpen }) {
  const [txInFlight, setTxInFlight] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { address, isConnected } = useAccount();

  const navigate = useNavigate();

  const { data: hash, writeContract } = useWriteContract();

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

    if(!isRegistrationOpen) {
      enqueueSnackbar("Registration is closed, check back later!", { variant: "error" });
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

  if (isConfirmed && txInFlight) {
    enqueueSnackbar(`Ship ${shipId} registered`, { variant: "success" });
    console.log(`Ship ${shipId} registered`, receipt);
    setTxInFlight(false);
    setRegistrationDialogOpen(false);
    navigate("/listgames");
  }

  const handleClose = () => {
    setRegistrationDialogOpen(false);
    onCancel();
  };

  const shipData = punkships.find((ship) => ship.tokenId === shipId);

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
        Confirm your registration
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <Box textAlign="left" mr={2}>
            <Typography variant="h5" gutterBottom>
              Name: {shipData.name}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Movement: {shipData.movement}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Shoot: {shipData.shoot}
            </Typography>
          </Box>
          <Box
            component="img"
            src={shipData.image}
            alt={shipData.name}
            sx={{ maxWidth: '25%', height: 'auto', marginLeft: '10px' }}
          />
        </Box>
        <Stack spacing={2} direction="row" justifyContent="center">
          <Button
            variant="contained"
            color="error"
            sx={{ fontSize: '1rem', padding: '10px 20px' }}
            onClick={handleClose}
            disabled={isConfirming}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ fontSize: '1rem', padding: '10px 20px' }}
            onClick={registerShip}
            disabled={!shipId || isConfirming || !isConnected || burned}
          >
            {isConfirming ? "Confirming..." : "Register Ship"}
          </Button>
        </Stack>
      </DialogContent>
    </BootstrapDialog>
  )}
</Fragment>

  );
}
