import * as React from "react";
import { useTheme } from "@emotion/react";
import { useNavigate, useLocation } from 'react-router-dom';

import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import punkLogo from "./images/punkLogo.png";
import { useAccount } from "wagmi";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { ConnectKitButton } from "connectkit";

export default function AccountAppBar({ toggleDarkMode }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const { address } = useAccount();
  const location = useLocation(); // Get the current location

  const handleLogoClick = () => {
    if (!address) {
      navigate('/');
    } else {
      navigate('/menu');
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box
          component="img"
          sx={{ width: "48px", cursor: "pointer" }}
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

        {location.pathname !== '/' && <ConnectKitButton />}
      </Toolbar>
    </AppBar>
  );
}
