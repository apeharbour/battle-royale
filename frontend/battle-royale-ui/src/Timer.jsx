import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWebSocket } from './contexts/WebSocketContext'; // Adjust the import path as necessary

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
  const [timeLeft, setTimeLeft] = useState('Waiting for countdown...');
  const { ws, countdownEndTime } = useWebSocket(); // Adjust based on your context structure

  useEffect(() => {
    if (!ws) return;

    const onMessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      // Adjust the action name and properties according to your actual data structure
      if (message.action === 'startInitialCountdown' || message.action === 'resetTimer') {
        const endTime = message.endTime;
        if (endTime) {
          startTimer(endTime);
        }
      }
    };

    ws.addEventListener('message', onMessage);

    // Optionally, start the timer if countdownEndTime is already set
    if (countdownEndTime) {
      startTimer(countdownEndTime);
    }

    // Clean up
    return () => ws.removeEventListener('message', onMessage);
  }, [ws, countdownEndTime]);

  const startTimer = (endTime) => {
    updateCountdown(endTime);

    const interval = setInterval(() => {
      const isExpired = updateCountdown(endTime);
      if (isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const updateCountdown = (endTime) => {
    const now = Date.now();
    const distance = endTime - now;

    // Check if endTime is not yet available or countdown has not started
    if (!endTime || distance < 0) {
      setTimeLeft("Waiting for countdown...");
      return true; // Indicates no active countdown
    } else {
      // Update countdown time
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
      return false; // Countdown is active
    }
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
