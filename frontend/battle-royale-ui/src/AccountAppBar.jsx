import * as React from "react";
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
import { ConnectKitButton } from "connectkit";
import Master1 from "./images/Master1.svg";
import Master2 from "./images/Master2.svg";
import Master5 from "./images/Master3.svg";
import Master3 from "./images/Master9.svg";
import Master4 from "./images/Master5.svg";

export default function AccountAppBar() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const location = useLocation();
  const [walletConnected, setWalletConnected] = React.useState(false);

  const isActiveRoute = (path) => location.pathname === path;
  const activeButtonStyle = {
    backgroundColor: "gray",
    color: "white",
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

  function shortenAddress(addr) {
    if (!addr) return "";
    return addr.slice(0, 6) + "…" + addr.slice(-4);
  }

  return (
    <AppBar position="absolute" sx={{ backgroundColor: "black" }}>
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
          onClick={() => navigate("/")}
        >
          <Box
            component="img"
            src={yartsLogo}
            alt="yarts logo"
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
              textTransform: "none",
              ...(isActiveRoute("/registration") ? activeButtonStyle : {}),
              "& .MuiButton-label": { fontSize: "1rem" },
            }}
          >
            registration
          </Button>
        )}
        {address && (
          <Button
            color="inherit"
            onClick={() => navigate("/activegames")}
            sx={{
              marginLeft: 2,
              textTransform: "none",
              "& .MuiButton-label": { fontSize: "1rem" },
              ...(isActiveRoute("/activegames") ? activeButtonStyle : {}),
            }}
          >
            active games
          </Button>
        )}
        {address && (
          <Button
            color="inherit"
            onClick={() => navigate("/halloffame")}
            sx={{
              marginLeft: 2,
              textTransform: "none",
              "& .MuiButton-label": { fontSize: "1rem" },
              ...(isActiveRoute("/halloffame") ? activeButtonStyle : {}),
            }}
          >
            hall of fame
          </Button>
        )}
        {address && (
          <Button
            color="inherit"
            onClick={() => navigate("/spectator")}
            sx={{
              marginLeft: 2,
              textTransform: "none",
              "& .MuiButton-label": { fontSize: "1rem" },
              ...(isActiveRoute("/spectator") ? activeButtonStyle : {}),
            }}
          >
            spectate
          </Button>
        )}
        {address &&
          address === "0xCd9680dd8318b0df924f0bD47a407c05B300e36f" && (
            <Button
              color="inherit"
              onClick={() => navigate("/admin")}
              sx={{
                marginLeft: 2,
                textTransform: "none",
                "& .MuiButton-label": { fontSize: "1rem" },
                ...(isActiveRoute("/admin") ? activeButtonStyle : {}),
              }}
            >
              admin
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
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}
            >
              <Typography variant="subtitle1">
                different types of yarts in the game:
              </Typography>
              {ships.map((ship, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    border: "1px solid",
                    borderColor: "black",
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
                    <Typography variant="body2">name: {ship.name}</Typography>
                    <Typography variant="body2">
                      movement: {ship.movement}
                    </Typography>
                    <Typography variant="body2">shoot: {ship.shoot}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Popover>
        </Box>
        {location.pathname !== "/" && (
          <ConnectKitButton.Custom>
            {({ isConnected, show }) => (
              <Button
                onClick={show}
                sx={{
                  "& .MuiButton-label": { fontSize: "1rem" },
                  backgroundColor: "transparent",
                  color: "inherit",
                  border: "1px solid currentColor",
                  textTransform: "none",
                  padding: "6px 18px",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.2s ease-in-out",
                  },
                }}
              >
                {isConnected && address ? shortenAddress(address) : "connect"}
              </Button>
            )}
          </ConnectKitButton.Custom>
        )}
      </Toolbar>
    </AppBar>
  );
}
