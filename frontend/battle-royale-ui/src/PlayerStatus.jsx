// PlayerStatus.jsx

import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import img1 from "./images/6.png";
import img2 from "./images/8.png";
import img3 from "./images/7.png";
import img4 from "./images/4.png";
import img5 from "./images/5.png";

const punkShips = [
  { name: "Sailing Ship", range: 6, speed: 2, image: img1 },
  { name: "Three-master", range: 5, speed: 3, image: img2 },
  { name: "Four-master", range: 4, speed: 4, image: img3 },
  { name: "Five-master", range: 3, speed: 5, image: img4 },
  { name: "Superyacht", range: 2, speed: 6, image: img5 },
];

const PlayerPaper = styled(Paper)({
  maxWidth: '240px',  
  borderRadius: '45px',
  overflow: 'hidden',
  backgroundColor: 'rgba(195, 208, 243, 0.9)',
  margin: '60px auto auto auto',
});

const ShipImage = styled('img')({
  width: '60%',
  height: 'auto',
});

const PlayerStatus = ({ ships }) => { 
  
  const findShipImage = (range, speed) => {
    const ship = punkShips.find(ship => ship.range === range && ship.speed === speed);
    return ship ? ship.image : null;
  };

  return (
    <Box>
      <PlayerPaper elevation={4}>
        <Typography variant="h6" component="div" sx={{ p: 2, backgroundColor: 'rgba(195, 208, 243, 0.9)', color: 'black', fontWeight: '700' }}>
          Player Status
        </Typography>
        <TableContainer component={Paper} sx={{ borderTopLeftRadius: '35px', borderTopRightRadius: '35px', backgroundColor: 'rgba(215, 227, 249, 0.8)'}}>
          <Table sx={{ minWidth: 'auto' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Player</TableCell>
                <TableCell align="right">Range</TableCell>
                <TableCell align="right">Speed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ships.map((player, index) => (
                <TableRow
                  key={index}
                >
                  <TableCell component="th" scope="row">
                    <ShipImage src={player.image} alt={`Player Ship`} />
                  </TableCell>
                  <TableCell align="right">{player.range}</TableCell>
                  <TableCell align="right">{player.shotRange}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PlayerPaper>
    </Box>
  );
};

export default PlayerStatus;
