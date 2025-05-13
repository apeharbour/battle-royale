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
import "./MintShip.css";

export default function RegistrationAcknowledgementDialog({
  open,
  onClose,
  onAgree,
}) {
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
        }}
      >
        battle royale acknowledgement
      </DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            please acknowledge that you have read and understood the terms and
            conditions before registering your yart.
          </Typography>
          <Box mt={3} textAlign="left">
            <Typography variant="h6" gutterBottom>
              game rules:
            </Typography>
            <Typography variant="body1" gutterBottom>
              1. **shoot and move according to your ship's stats**: your actions
              in the game are governed by your ship's stats. each ship type has
              unique movement and shooting capabilities.
            </Typography>
            <Typography variant="body1" gutterBottom>
              2. **round-based gameplay**: the game is round-based, meaning
              every player gets one turn per round and every round lasts 24 hours, as the game starts.
            </Typography>
            <Typography variant="body1" gutterBottom>
              3. **one life per game**: you have only one life in the game. Make
              your moves wisely.
            </Typography>
            <Typography variant="body1" gutterBottom>
              4. **colliding with an island**: If your ship collides with an
              island, you will be killed.
            </Typography>
            <Typography variant="body1" gutterBottom>
              5. **sailing outside the map**: moving outside the map boundaries
              will result in your ship being killed.
            </Typography>
            <Typography variant="body1" gutterBottom>
              6. **shooting another player**: if you shoot another player, the other player will be killed. 
            </Typography>
            <Typography variant="body1" gutterBottom>
              7. **last man standing**: the last player remaining in the game
              will receive the "canvas of victory."
            </Typography>
            <Typography variant="body1" gutterBottom>
              8. **draw**: in case of draw: noone wins and no canvas of victory will be rewarded to any player for that game."
            </Typography>
            <Typography variant="body1" color="error" gutterBottom sx={{fontWeight: 700}}>
              note: "killed" means your 'yart' nft is burned, please be careful!
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
            label="i have read and agree to the terms and conditions"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
      <Stack spacing={4} direction="row" justifyContent="center">
          <button className="holographic2-button" onClick={onClose}>
            cancel
          </button>
          <button
            className="holographic-button"
            onClick={onAgree}
            disabled={!isChecked} // Disabled until checkbox is checked
          >
            agree
          </button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
