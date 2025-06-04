import React from "react";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import AccountAppBar from "./AccountAppBar";

export default function Layout() {
  const { pathname } = useLocation();
  const accountAppBarRoutes = ["/registration", "/activegames" , "/halloffame", "/cov/:gameId", "/spectator", "/spectator/:gameId", "/admin", "/:gameId"];
  const isAccountRoute = accountAppBarRoutes.some((route) =>
    matchPath({ path: route, end: true }, pathname)
  );
  const showHeader = !isAccountRoute || pathname === "/gallery";
  const showAccountAppBar = isAccountRoute && pathname !== "/gallery";
  const headerHeight = location.pathname === "/" ? "230px" : "150px";

  return (
    <Box display="flex" flexDirection="column" height="96dvh">
      {/* only render Header if not on /registration */}
      {showHeader && (
        <Box
          flex="0 0 auto"
          width="100%"
          sx={{
            maxWidth: { xs: "50%", sm: "20%" },
            mx: "auto",
            overflow: "visible",
            height: headerHeight,
          }}
        >
          <Header />
        </Box>
      )}
      {showAccountAppBar && (
        <Box mb={5}>
          <AccountAppBar />
        </Box>
      )}
      {/* Main content */}
      <Box className="hide-scrollbar" flex="1 1 auto" overflow="auto">
        <Outlet />
      </Box>

      {/* Footer (always visible) */}
      <Box flex="0 0 auto" sx={{ textAlign: "center" }}>
        <Footer />
      </Box>
    </Box>
  );
}
