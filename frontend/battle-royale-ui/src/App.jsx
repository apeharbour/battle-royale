import { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import "@fontsource-variable/pixelify-sans";
import "@fontsource/vt323";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import "./App.css";
import Homepage from "./Homepage";
import ListGames from "./ListGames";
import Game from "./Game";
import Admin from "./Admin";
import AccountAppBar from "./AccountAppBar";
import BackdropComponent from './Backdrop';
import Registration from "./Registration";
import Menu from "./Menu";
import FinalArtData from "./FinalArtData.jsx";
import { Web3Provider } from "./Web3Provider";
import { SnackbarProvider } from "notistack";
import useLocalStorageState from 'use-local-storage-state';
import { WebSocketProvider } from "./contexts/WebSocketContext";

function App() {
  const [darkMode, setDarkMode] = useLocalStorageState('darkMode', { defaultValue: true });

  // create a darkTheme function to handle dark theme using createTheme
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    typography: {
      fontFamily: "VT323, sans-serif",
    },
    shape: {
      borderRadius: 30,
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleDisconnect = () => {
    console.log("handleDisconnect");
    setSigner(null);
    setProvider(null);
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), 1000); // Simulating loading time

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location]);

  return (
    <WebSocketProvider>
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Web3Provider theme={theme}>
            <AccountAppBar toggleDarkMode={toggleDarkMode} />
            <BackdropComponent open={loading} />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/:gameId" element={<Game />} />
              <Route path="/:gameId/finalart" element={<FinalArtData />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/listgames" element={<ListGames />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/menu" element={<Menu />} />
            </Routes>
          </Web3Provider>
        </ThemeProvider>
      </SnackbarProvider>
    </WebSocketProvider>
  );
}

export default App;
