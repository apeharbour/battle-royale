import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ListGames from "./ListGames";
import Game from "./Game";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListGames />} />
        <Route path=":gameId" element={<Game />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
