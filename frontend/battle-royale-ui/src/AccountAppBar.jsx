import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import punkShips from "./images/punkshipsLogo.png";
import punkLogo from "./images/punkLogo.png";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useTheme } from "@emotion/react";
import { ConnectKitButton } from "connectkit";
import { Stack, Switch } from "@mui/material";


export default function AccountAppBar({ toggleDarkMode, design, toggleDesign, onConnect, onDisconnect, signer }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box
          component="img"
          sx={{ width: "48px" }}
          src={punkLogo}
          alt="Punkships Logo"
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PUNKSHIPS
        </Typography>
        <Stack direction="row" spacing={1} sx={{ verticalAlign: "middle" }}>
          <Typography gutterBottom >Pixel</Typography>
          <Switch checked={design === 0} onChange={toggleDesign} />
          <Typography>Clean</Typography>
        </Stack>
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
