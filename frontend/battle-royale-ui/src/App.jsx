import { Fragment, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@fontsource-variable/pixelify-sans";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import "./App.css";
import ListGames from "./ListGames";
import Game from "./Game";
import Admin from "./Admin";
import AccountAppBar from "./AccountAppBar";
import { Web3Provider } from "./Web3Provider";
import { SnackbarProvider } from "notistack";
import useLocalStorageState from 'use-local-storage-state';
import { WebSocketProvider } from "./contexts/WebSocketContext";
import useLocalStorageState from 'use-local-storage-state';


function App() {
  const [darkMode, setDarkMode] = useLocalStorageState('darkMode', { defaultValue: true});

  // create a darkTheme function to handle dark theme using createTheme
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    typography: {
      fontFamily: "Pixelify Sans Variable",
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

  return (
    <WebSocketProvider>
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Web3Provider theme={theme}>
          <AccountAppBar
            toggleDarkMode={toggleDarkMode}
          />
          {/* <Header /> */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ListGames />} />
              <Route path=":gameId" element={<Game />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </Web3Provider>
      </ThemeProvider>
    </SnackbarProvider>
    </WebSocketProvider>
  );
}

export default App;
