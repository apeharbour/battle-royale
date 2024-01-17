import { Fragment, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ListGames from "./ListGames";
import Game from "./Game";
import Admin from "./Admin";
import Header from "./Header";
import { Box } from '@mui/material';

function App() {
  return (
    <Fragment>
      <Box>
      <Header />
      <div className="mainContent">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListGames />} />
        <Route path=":gameId" element={<Game />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
    </div>
    </Box>
    </Fragment>
  );
}

export default App;
