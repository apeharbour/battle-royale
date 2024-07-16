import React from 'react';
import { Button } from '@mui/material';

export default function ToggleBurnedShipsButton({ showBurnedShips, onToggle }) {
  return (
    <Button variant="outlined" onClick={onToggle}>
      {showBurnedShips ? "Hide Burned Ships" : "Show Burned Ships"}
    </Button>
  );
}
