// ShipStatus.jsx

import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
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

  const ShipPaper = styled(Paper)({
    maxWidth: '240px',
    borderRadius: '30px',
    overflow: 'hidden',
    margin: 'auto auto 40px auto', 
    backgroundColor: 'rgba(195, 208, 243, 0.5)'

  });

  const TopSection = styled('div')({
    backgroundColor: 'rgba(195, 208, 243, 0.5)',
    padding: '16px',
  });

  const BottomSection = styled('div')({
    backgroundColor: 'rgba(215, 227, 249, 0.5)',
    padding: '16px',
  });

const ShipImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
});

const StatTypography = styled(Typography)({
  margin: '4px 0',
});

export default function ShipStatus (props) {
    const ship = punkShips.find(ship => ship.range === props.range && ship.speed === props.speed);
    const shipImage = ship ? ship.image : "./images/6.png";
  return (
    <ShipPaper elevation={4}>
      <TopSection>
        <Typography variant="h6" color="black" sx={{ fontWeight: '700' }}>
          Your Ship
        </Typography>
      </TopSection>
      <BottomSection sx={{ borderTopLeftRadius: '35px', borderTopRightRadius: '35px'}}>
      <ShipImage src={shipImage} alt={ship ? ship.name : "Default Ship"} />
      <StatTypography variant="subtitle1">Range: {props.range}</StatTypography>
      <StatTypography variant="subtitle1">Speed: {props.speed}</StatTypography>
      </BottomSection>
    </ShipPaper>
  );
};
