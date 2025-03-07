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
        Battle Royale Acknowledgement
      </DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            Please acknowledge that you have read and understood the terms and
            conditions before registering your yart.
          </Typography>
          <Box mt={3} textAlign="left">
            <Typography variant="h6" gutterBottom>
              Game Rules:
            </Typography>
            <Typography variant="body1" gutterBottom>
              1. **Shoot and move according to your ship's stats**: Your actions
              in the game are governed by your ship's stats. Each ship type has
              unique movement and shooting capabilities.
            </Typography>
            <Typography variant="body1" gutterBottom>
              2. **Round-based gameplay**: The game is round-based, meaning
              every player gets one turn per round and every round lasts 24 hours, as the game starts.
            </Typography>
            <Typography variant="body1" gutterBottom>
              3. **One life per game**: You have only one life in the game. Make
              your moves wisely.
            </Typography>
            <Typography variant="body1" gutterBottom>
              4. **Colliding with an island**: If your ship collides with an
              island, you will be killed.
            </Typography>
            <Typography variant="body1" gutterBottom>
              5. **Sailing outside the map**: Moving outside the map boundaries
              will result in your ship being killed.
            </Typography>
            <Typography variant="body1" gutterBottom>
              6. **Shooting another player**: If you shoot another player, the other player will be killed. 
            </Typography>
            <Typography variant="body1" gutterBottom>
              7. **Last man standing**: The last player remaining in the game
              will receive the "Canvas of Victory."
            </Typography>
            <Typography variant="body1" gutterBottom>
              8. **Draw**: In case of draw: Noone wins and no canvas of victory will be rewarded to any player for that game."
            </Typography>
            <Typography variant="body1" color="error" gutterBottom sx={{fontWeight: 700}}>
              Note: "Killed" means your 'yart' NFT is burned, please be careful!
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
