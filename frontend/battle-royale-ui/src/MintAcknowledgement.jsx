import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
} from "@mui/material";
import "./Button.css";
import { Link } from "react-router-dom";

export default function MintAcknowledgement({ open, onClose, onAgree }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          fontSize: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: 700,
        }}
      >
        Confirmation
      </DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center">
          <Box mt={3} textAlign="left">
            <Typography variant="body1" gutterBottom>
              You are about to mint an{" "}
              <strong style={{ fontWeight: 700 }}>onchain art NFT</strong> on
              ApeChain. By proceeding, you confirm that you have read and agree
              to the{" "}
              <Link
                to="/tandc"
                style={{
                  textDecoration: "underline",
                  color: "inherit",
                  fontWeight: 700,
                }}
              >
                Terms and Conditions
              </Link>
              . This minting process is final and non-refundable.
            </Typography>
          </Box>
        </Box>
        <Box mt={2} textAlign="center">
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="I have read and agree to the terms and conditions"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Stack spacing={4} direction="row" justifyContent="center">
          <button className="holographic2-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="holographic-button"
            onClick={onAgree}
            disabled={!isChecked} // Disabled until checkbox is checked
          >
            Agree
          </button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
