import { Fragment, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./App.css";
import ListGames from "./ListGames";
import Game from "./Game";
import Admin from "./Admin";
import Header from "./Header";
import AccountAppBar from "./AccountAppBar";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { ethers } from "ethers";
import { Web3Provider } from "./Web3Provider";


function App() {
  const [darkMode, setDarkMode] = useState(true);

  // create a darkTheme function to handle dark theme using createTheme
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider theme={theme}>
        <AccountAppBar toggleDarkMode={toggleDarkMode} />
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
  );
}

export default App;
