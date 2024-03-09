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
import { Web3Provider } from "./Web3Provider";

const DESIGN_CLEAN = 0;
const DESIGN_PIXEL = 1;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [design, setDesign] = useState(DESIGN_CLEAN);

  // create a darkTheme function to handle dark theme using createTheme
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    typography: {
      fontFamily: "Pixelify Sans Variable",
    },
  });

  const toggleDesign = (e) => {
    console.log("toggleDesign: switch to", e.target.checked ? "clean" : "pixel");
    e.target.checked ? setDesign(DESIGN_CLEAN) : setDesign(DESIGN_PIXEL)
  }

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
        <AccountAppBar toggleDarkMode={toggleDarkMode} design={design} toggleDesign={toggleDesign}/>
        {/* <Header /> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ListGames />} />
            <Route path=":gameId" element={<Game design={design} />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;
