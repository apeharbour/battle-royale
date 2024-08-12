import * as React from "react";
import { useTheme } from "@emotion/react";
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
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
  const location = useLocation();

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
        <Typography variant="h6" component="div" sx={{ marginLeft: 1 }}>
          PUNKSHIPS
        </Typography>
        {address && (
          <Button color="inherit" onClick={() => navigate('/registration')} sx={{ marginLeft: 4, fontSize: '1.2rem' }}>
            Registration
          </Button>
        )}
        {address && (
          <Button color="inherit" onClick={() => navigate('/listgames')} sx={{ marginLeft: 4, fontSize: '1.2rem' }}>
            Active Games
          </Button>
        )}
        {address && (
          <Button color="inherit" onClick={() => navigate('/halloffame')} sx={{ marginLeft: 4, fontSize: '1.2rem' }}>
            Hall of Fame
          </Button>
        )}
        {address && (address === "0xCd9680dd8318b0df924f0bD47a407c05B300e36f") && (
          <Button color="inherit" onClick={() => navigate('/admin')} sx={{ marginLeft: 4, fontSize: '1.2rem' }}>
            Admin
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <IconButton aria-label="darkmode" onClick={toggleDarkMode}>
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        {location.pathname !== '/' && <ConnectKitButton />}
      </Toolbar>
    </AppBar>
  );
}