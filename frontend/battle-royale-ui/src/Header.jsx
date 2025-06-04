import React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router-dom";
import yartsLogoTransparent from "./images/yartsLogoTransparent.svg";
import SearchYart from "./SearchYart";

function Header() {
  const location = useLocation();
  // const destination = location.pathname === "/youryarts" ? "/" : "/youryarts";
  const headerHeight = location.pathname === "/" ? "230px" : "150px";

  return (
    <Grid
      container
      sx={{
        height: headerHeight,
        alignItems: "center",
      }}
    >
      <Grid
        item
        size={12}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <Box
            component="img"
            src={yartsLogoTransparent}
            alt="Yarts Logo"
            sx={{
              display: "block",
              maxWidth: "100%",
              height: "auto",
              cursor: "pointer",
            }}
          />
        </Link>
      </Grid>
      {location.pathname === "/gallery" && (
        <Grid item size={12} mt={-5}>
          <SearchYart />
        </Grid>
      )}
    </Grid>
  );
}

export default Header;
