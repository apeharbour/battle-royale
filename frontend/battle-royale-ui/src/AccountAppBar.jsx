import * as React from "react";
import { useTheme } from "@emotion/react";
import { useNavigate } from 'react-router-dom';

import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import punkShips from "./images/punkshipsLogo.png";
import punkLogo from "./images/punkLogo.png";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { ConnectKitButton } from "connectkit";


export default function AccountAppBar({ toggleDarkMode }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box
          component="img"
          sx={{ width: "48px" }}
          src={punkLogo}
          alt="Punkships Logo"
          onClick={handleLogoClick}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PUNKSHIPS
        </Typography>
        <IconButton aria-label="darkmode" onClick={toggleDarkMode}>
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <ConnectKitButton />

        {/* {!signer && (
            <Button variant="outlined" onClick={onConnect}>Connect</Button>
        )}
        {signer && (
            <>
            <Typography variant="h6" pr={2} >
              { `${signer.address.slice(0, 5)}...${signer.address.slice(-3)} `}
              </Typography>
            <Button variant="outlined" onClick={onDisconnect}>Disconnect</Button>
            </>
        )} */}
      </Toolbar>
    </AppBar>
  );
}
