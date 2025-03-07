import { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import "@fontsource-variable/pixelify-sans";
import "@fontsource/vt323";
import '@fontsource/fira-mono';
import '@fontsource-variable/montserrat';
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import "./App.css";
import Homepage from "./Homepage";
import ActiveGames from "./ActiveGames.jsx";
import Game from "./Game";
import Admin from "./Admin";
import AccountAppBar from "./AccountAppBar";
import BackdropComponent from "./Backdrop";
import Cov from "./Cov.jsx";
import HallOfFame from "./HallOfFame";
import Registration from "./Registration";
import Spectator from "./Spectator";
import SpectateGame from "./SpectateGame";
import FinalArtData from "./FinalArtData.jsx";
import { Web3Provider } from "./Web3Provider";
import { SnackbarProvider } from "notistack";
import useLocalStorageState from "use-local-storage-state";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import CoV_Data from "./CoV_Data";

function App() {
  const [darkMode, setDarkMode] = useLocalStorageState("darkMode", {
    defaultValue: true,
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    typography: {
      fontFamily: "'Montserrat Variable', sans-serif",
    },
    shape: {
      borderRadius: 30,
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location]);

  const isSpectateGameRoute = location.pathname.startsWith("/spectator/");
  const isHomepage = location.pathname === "/";

  return (
    <WebSocketProvider>
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Web3Provider theme={theme}>
            {!isHomepage && <AccountAppBar toggleDarkMode={toggleDarkMode} />}
            {!isSpectateGameRoute && <BackdropComponent open={loading} />}
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/:gameId" element={<Game />} />
              <Route path="/:gameId/finalart" element={<FinalArtData />} />
              <Route path="/:gameId/cov" element={<CoV_Data />} />
              <Route path="/cov/:gameId" element={<Cov />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/activegames" element={<ActiveGames />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/halloffame" element={<HallOfFame />} />
              <Route path="/spectator" element={<Spectator />} />
              <Route path="/spectator/:gameId" element={<SpectateGame />} />
            </Routes>
          </Web3Provider>
        </ThemeProvider>
      </SnackbarProvider>
    </WebSocketProvider>
  );
}

export default App;
