import React, { useState, useEffect } from 'react';
import { Typography, Card, CardHeader, CardContent } from '@mui/material';
import { useWebSocket } from './contexts/WebSocketContext'; 

export default function Timer({ gameId }) { 
  const [timeLeft, setTimeLeft] = useState('Waiting for countdown...');
  const { ws } = useWebSocket();

  // Function to fetch endTime from the API
  const fetchEndTime = async () => {
    try {
      const response = await fetch(`https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/game/${gameId}`);
      const data = await response.json();
      if (data.endTime) {
        startTimer(data.endTime);
      }
    } catch (error) {
      console.error('Failed to fetch endTime:', error);
    }
  };

  useEffect(() => {
    fetchEndTime();

    const onMessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.action === 'startInitialCountdown' || message.action === 'resetTimer') {
        startTimer(message.endTime);
      }
    };

    if (ws) {
      ws.addEventListener('message', onMessage);
    }

    // Clean up
    return () => ws?.removeEventListener('message', onMessage);
  }, [ws, gameId]);

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
    <Card elevation={4}>
        <CardHeader
          title="Next Move Timer"/>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography variant="h6" color='warning.main' sx={{ fontWeight: '700' }}>
            {timeLeft}
          </Typography>
        </CardContent>
      </Card>

  );
}
