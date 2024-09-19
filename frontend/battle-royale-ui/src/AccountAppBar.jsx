import * as React from "react";
import { useTheme } from "@emotion/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import punkLogo from "./images/punkLogo.png";
import yartsLogo from "./images/yartsLogo.svg";
import { useAccount } from "wagmi";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Avatar, ConnectKitButton } from "connectkit";

export default function AccountAppBar({ toggleDarkMode }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const { address } = useAccount();
  const location = useLocation();

  const handleLogoClick = () => {
    if (!address) {
      navigate("/");
    } else {
      navigate("/menu");
    }
  };

  const isActiveRoute = (path) => location.pathname === path;

  const activeButtonStyle = {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box
          sx={{
            width: "180px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={handleLogoClick}
        >
          <Box
            component="img"
            sx={{
              width: "500%",
              height: "450%",
            }}
            src={yartsLogo}
            alt="Punkships Logo"
          />
        </Box>
        {/* <Typography variant="h6" component="div" sx={{ marginLeft: 1 }}>
          PUNKSHIPS
        </Typography> */}
        <Button
          color="inherit"
          onClick={() => navigate("/registration")}
          sx={{
            marginLeft: 2,
            ...(isActiveRoute("/registration") ? activeButtonStyle : {}),
            "& .MuiButton-label": {
              fontSize: "1rem",
            },
          }}
        >
          Registration
        </Button>
        {address && (
          <Button
            color="inherit"
            onClick={() => navigate("/listgames")}
            sx={{
              marginLeft: 2,
              "& .MuiButton-label": {
                fontSize: "1rem",
              },
              ...(isActiveRoute("/listgames") ? activeButtonStyle : {}),
            }}
          >
            Active Games
          </Button>
        )}
        {address && (
          <Button
            color="inherit"
            onClick={() => navigate("/halloffame")}
            sx={{
              marginLeft: 2,
              "& .MuiButton-label": {
                fontSize: "1rem",
              },
              ...(isActiveRoute("/halloffame") ? activeButtonStyle : {}),
            }}
          >
            Hall of Fame
          </Button>
        )}
        {address && (
          <Button
            color="inherit"
            onClick={() => navigate("/spectator")}
            sx={{
              marginLeft: 2,
              "& .MuiButton-label": {
                fontSize: "1rem",
              },
              ...(isActiveRoute("/spectator") ? activeButtonStyle : {}),
            }}
          >
            Spectate
          </Button>
        )}
        {address &&
          address === "0xCd9680dd8318b0df924f0bD47a407c05B300e36f" && (
            <Button
              color="inherit"
              onClick={() => navigate("/admin")}
              sx={{
                marginLeft: 2,
                "& .MuiButton-label": {
                  fontSize: "1rem",
                },
                ...(isActiveRoute("/admin") ? activeButtonStyle : {}),
              }}
            >
              Admin
            </Button>
          )}
        <Box sx={{ flexGrow: 1 }} />
        <IconButton aria-label="darkmode" onClick={toggleDarkMode}>
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        {location.pathname !== "/" && <ConnectKitButton />}
      </Toolbar>
    </AppBar>
  );
}
