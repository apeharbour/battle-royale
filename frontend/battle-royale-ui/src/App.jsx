// App.jsx
import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import { Web3Provider } from "./Web3Provider";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import useLocalStorageState from "use-local-storage-state";
import { SnackbarProvider } from "notistack";
import "@fontsource-variable/montserrat";
import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";
import "./App.css";

// battle-royale page components
import Layout from "./Layout";
import About from "./About";
import Yarts from "./Yarts";
import TandC from "./TandC";
import Imprint from "./Imprint";
import Gallery from "./Gallery";
import Homepage from "./Homepage";
import Registration from "./BattleRoyale/Registration";
import ActiveGames from "./BattleRoyale/ActiveGames";
import HallOfFame from "./BattleRoyale/HallOfFame";
import Cov from "./BattleRoyale/Cov";
import Spectator from "./BattleRoyale/Spectator";
import SpectateGame from "./BattleRoyale/SpectateGame";
import Admin from "./BattleRoyale/Admin";
import Game from "./BattleRoyale/Game";

function App() {
  // dark/light toggle
  const [darkMode] = useLocalStorageState("darkMode", { defaultValue: true });
  const theme = createTheme({
    palette: { mode: darkMode ? "dark" : "light" },
    typography: { fontFamily: "'Montserrat Variable', sans-serif" },
    shape: { borderRadius: 30 },
  });

  // match the two “fullscreen” routes
  const matchSpectatorGame = useMatch({
    path: "/spectator/:gameId",
    end: true,
  });
  const matchGame = useMatch({ path: "/:gameId", end: true });

  // list out all your single-segment “static” pages so we can ignore them
  const staticPages = new Set([
    "gallery",
    "yarts",
    "tandc",
    "about",
    "imprint",
    "registration",
    "activegames",
    "halloffame",
    "cov",
    "spectator",
    "admin",
  ]);

  // only treat /:gameId as a game if it’s not one of the above
  const isGameScreen =
    Boolean(matchGame) && !staticPages.has(matchGame.params.gameId);
  const isFullscreen = Boolean(matchSpectatorGame) || isGameScreen;

  return (
    <WebSocketProvider>
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Web3Provider theme={theme}>
            <Box
              className={`app-container${isFullscreen ? " fullscreen" : ""}`}
            >
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/yarts" element={<Yarts />} />
                  <Route path="/tandc" element={<TandC />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/imprint" element={<Imprint />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/activegames" element={<ActiveGames />} />
                  <Route path="/halloffame" element={<HallOfFame />} />
                  <Route path="/cov/:gameId" element={<Cov />} />
                  <Route path="/spectator" element={<Spectator />} />
                  <Route path="/spectator/:gameId" element={<SpectateGame />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/:gameId" element={<Game />} />
                </Route>
                <Route path="/" element={<Homepage />} />
              </Routes>
            </Box>
          </Web3Provider>
        </ThemeProvider>
      </SnackbarProvider>
    </WebSocketProvider>
  );
}

export default App;
