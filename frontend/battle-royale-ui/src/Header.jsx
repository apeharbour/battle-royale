import React from "react";
import punkShips from "./images/punkshipsLogo.png";
import "./App.css";
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import { Button } from '@mui/material';

export default function Header() {
    return (
        <div className="headerContainer">
            <VolumeUpRoundedIcon fontSize="large" color="primary" className='volumeIcon' />
            <a href="/">
                <img src={punkShips} className="punkShipsLogo" alt="Punk Ships Logo" />
            </a>
            <Button variant="contained" href="/admin">Admin</Button>
            <Button variant="contained" className="connectButton">Connect</Button>
        </div>
    );
}
