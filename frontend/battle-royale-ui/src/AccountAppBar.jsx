import * as React from "react";
import { useTheme } from "@emotion/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import yartsLogo from "./images/yartsLogoTransparent.svg";
import { useAccount } from "wagmi";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Avatar, ConnectKitButton } from "connectkit";
import Master1 from "./images/Master1.svg";
import Master2 from "./images/Master2.svg";
import Master5 from "./images/Master3.svg";
import Master3 from "./images/Master9.svg";
import Master4 from "./images/Master5.svg";

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
      navigate("/registration");
    }
  };

  const isActiveRoute = (path) => location.pathname === path;
  const activeButtonStyle = {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  };

  // Use click to open/close popover
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverToggle = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const popoverOpen = Boolean(anchorEl);

  // Ship data: reference the imported images directly
  const ships = [
    {
      image: Master1,
      name: "Wind Rider",
      movement: "6",
      shoot: "2",
    },
    {
      image: Master2,
      name: "Trident Cruiser",
      movement: "5",
      shoot: "3",
    },
    {
      image: Master3,
      name: "Four Mast Explorer",
      movement: "4",
      shoot: "4",
    },
    {
      image: Master4,
      name: "Royal Five Mast",
      movement: "3",
      shoot: "5",
    },
    {
      image: Master5,
      name: "Grand Yacht",
      movement: "2",
      shoot: "6",
    },
  ];

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            width: "auto",
            height: "auto",
            overflow: "hidden",
          }}
          onClick={handleLogoClick}
        >
          <Box
            component="img"
            src={yartsLogo}
            alt="Punkships Logo"
            sx={{
              maxWidth: "100%",
              height: "60px",
              objectFit: "contain",
            }}
          />
        </Box>
        {/* Navigation Buttons */}
        {address && (
          <Button
            color="inherit"
            onClick={() => navigate("/registration")}
            sx={{
              marginLeft: 4,
              ...(isActiveRoute("/registration") ? activeButtonStyle : {}),
              "& .MuiButton-label": { fontSize: "1rem" },
            }}
          >
            Registration
          </Button>
        )}
        {address && (
          <Button
            color="inherit"
            onClick={() => navigate("/activegames")}
            sx={{
              marginLeft: 2,
              "& .MuiButton-label": { fontSize: "1rem" },
              ...(isActiveRoute("/activegames") ? activeButtonStyle : {}),
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
              "& .MuiButton-label": { fontSize: "1rem" },
              ...(isActiveRoute("/halloffame") ? activeButtonStyle : {}),
            }}
          >
            Hall of Fame
          </Button>
        )}
        <Button
          color="inherit"
          onClick={() => navigate("/spectator")}
          sx={{
            marginLeft: 2,
            "& .MuiButton-label": { fontSize: "1rem" },
            ...(isActiveRoute("/spectator") ? activeButtonStyle : {}),
          }}
        >
          Spectate
        </Button>
        {address &&
          address === "0xCd9680dd8318b0df924f0bD47a407c05B300e36f" && (
            <Button
              color="inherit"
              onClick={() => navigate("/admin")}
              sx={{
                marginLeft: 2,
                "& .MuiButton-label": { fontSize: "1rem" },
                ...(isActiveRoute("/admin") ? activeButtonStyle : {}),
              }}
            >
              Admin
            </Button>
          )}
        <Box sx={{ flexGrow: 1 }} />
        {/* Info icon with click-triggered popover */}
        <Box sx={{ display: "inline-block" }}>
          <IconButton aria-label="info" onClick={handlePopoverToggle}>
            <InfoIcon />
          </IconButton>
          <Popover
            id="info-popover"
            open={popoverOpen}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            disableRestoreFocus
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
            <Typography variant="subtitle1">Different types of yarts in the game:</Typography>
              {ships.map((ship, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    border: "1px solid",
                    borderColor: theme.palette.divider,
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  <Box
                    component="img"
                    src={ship.image}
                    alt={ship.name}
                    sx={{ width: 60, height: 60 }}
                  />
                  <Box>
                    <Typography variant="body2">Name: {ship.name}</Typography>
                    <Typography variant="body2">
                      Movement: {ship.movement}
                    </Typography>
                    <Typography variant="body2">
                      Shoot: {ship.shoot}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Popover>
        </Box>
        <IconButton aria-label="darkmode" onClick={toggleDarkMode}>
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        {location.pathname !== "/" && <ConnectKitButton />}
      </Toolbar>
    </AppBar>
  );
}
