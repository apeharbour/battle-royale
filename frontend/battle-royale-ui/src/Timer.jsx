import React, { useState, useEffect, useContext } from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWebSocket } from './contexts/WebSocketContext';

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

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState('');
  const { ws } = useContext(useWebSocket);

  useEffect(() => {
    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);

      // Check for both the initial countdown and subsequent round countdowns
      if (message.action === 'startInitialCountdown' || message.action === 'resetTimer') {
        if (!message.gameId || typeof message.gameId === 'string') {
          startTimer(message.endTime);
        }
      }
    };

    if (ws) {
      ws.addEventListener('message', handleWebSocketMessage);
    }

    return () => {
      if (ws) {
        ws.removeEventListener('message', handleWebSocketMessage);
      }
    };
  }, [ws]);

  // Starts or resets the countdown timer based on the endTime provided
  const startTimer = (endTime) => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("EXPIRED");
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  return (
    <ShipPaper elevation={4}>
      <TopSection>
        <Typography variant="h6" color="black" sx={{ fontWeight: '700' }}>
          Next Move Timer
        </Typography>
      </TopSection>
      <BottomSection>
        <Typography color="red" sx={{ fontWeight: '400'}}>{timeLeft}</Typography>
      </BottomSection>
    </ShipPaper>
  );
}
