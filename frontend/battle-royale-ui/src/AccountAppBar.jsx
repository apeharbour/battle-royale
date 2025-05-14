import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Popover,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from "@mui/icons-material/Info";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

import yartsLogo from "./images/yartsLogoTransparent.svg";
import Master1 from "./images/Master1.svg";
import Master2 from "./images/Master2.svg";
import Master3 from "./images/Master9.svg";
import Master4 from "./images/Master5.svg";
import Master5 from "./images/Master3.svg";

export default function AccountAppBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { address } = useAccount();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // popover state
  const [anchorEl, setAnchorEl] = React.useState(null);
  const popoverOpen = Boolean(anchorEl);
  const handlePopoverToggle = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  // drawer state
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // nav items
  const navItems = [
    { label: "registration", path: "/registration" },
    { label: "active games", path: "/activegames" },
    { label: "hall of fame", path: "/halloffame" },
    { label: "spectate", path: "/spectator" },
  ];
  if (address === "0xCd9680dd8318b0df924f0bD47a407c05B300e36f") {
    navItems.push({ label: "admin", path: "/admin" });
  }

  const isActiveRoute = (path) => location.pathname === path;
  const activeButtonStyle = {
    backgroundColor: "gray",
    color: "white",
  };

  // ships data for info popover
  const ships = [
    { image: Master1, name: "Wind Rider", movement: "6", shoot: "2" },
    { image: Master2, name: "Trident Cruiser", movement: "5", shoot: "3" },
    { image: Master3, name: "Four Mast Explorer", movement: "4", shoot: "4" },
    { image: Master4, name: "Royal Five Mast", movement: "3", shoot: "5" },
    { image: Master5, name: "Grand Yacht", movement: "2", shoot: "6" },
  ];

  const shortenAddress = (addr) => {
    if (!addr) return "";
    return addr.slice(0, 6) + "…" + addr.slice(-4);
  };

  // drawer contents
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }} role="presentation">
      <List>
        {navItems.map(({ label, path }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton onClick={() => navigate(path)}>
              <ListItemText
                primary={label}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="absolute" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          {/* Logo */}
          <Box
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <Box
              component="img"
              src={yartsLogo}
              alt="yarts logo"
              sx={{ height: 60, objectFit: "contain" }}
            />
          </Box>

          {/* Mobile: burger menu; Desktop: inline nav */}
          {isMobile ? (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            address && (
              <Box sx={{ ml: 4, display: "flex", gap: 2 }}>
                {navItems.map(({ label, path }) => (
                  <Button
                    key={label}
                    color="inherit"
                    onClick={() => navigate(path)}
                    sx={{
                      textTransform: "none",
                      "& .MuiButton-label": { fontSize: "1rem" },
                      ...(isActiveRoute(path) ? activeButtonStyle : {}),
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
            )
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Info popover */}
          <IconButton aria-label="info" onClick={handlePopoverToggle}>
            <InfoIcon />
          </IconButton>
          <Popover
            open={popoverOpen}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            disableRestoreFocus
          >
            <Box
              sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Typography variant="subtitle1">
                different types of yarts in the game:
              </Typography>
              {ships.map((ship, i) => (
                <Box
                  key={i}
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

          {/* Connect button (not on "/") */}
          {location.pathname !== "/" && (
            <ConnectKitButton.Custom>
              {({ isConnected, show }) => (
                <Button
                  onClick={show}
                  sx={{
                    ml: 2,
                    textTransform: "none",
                    backgroundColor: "transparent",
                    color: "inherit",
                    border: "1px solid currentColor",
                    padding: "6px 18px",
                    "& .MuiButton-label": { fontSize: "1rem" },
                    "&:hover": { transform: "scale(1.05)", transition: "0.2s" },
                  }}
                >
                  {isConnected && address ? shortenAddress(address) : "connect"}
                </Button>
              )}
            </ConnectKitButton.Custom>
          )}
        </Toolbar>
      </AppBar>
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
