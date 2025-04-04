import React, { useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardContent } from "@mui/material";
import { useWebSocket } from "./contexts/WebSocketContext";

export default function Timer({ gameId, gameState }) {
  const [timeLeft, setTimeLeft] = useState(
    "Waiting for transaction to complete..."
  );
  const { ws } = useWebSocket();

  // Function to fetch endTime from the API
  const fetchEndTime = async (retryCount = 3) => {
    try {
      const response = await fetch(
        `https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/game/${gameId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "battleroyale",
          },
        }
      );

      // If the response is unauthorized or forbidden, retry if possible
      if (response.status === 403) {
        console.warn(`API request failed with 403 Forbidden.`);
        if (retryCount > 0) {
          console.log(`Retrying fetch... Attempts left: ${retryCount}`);
          setTimeout(() => fetchEndTime(retryCount - 1), 1000); // Retry after 1 sec
          return;
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.endTime) {
        startTimer(data.endTime);
      } else {
        console.warn("No valid endTime received.");
      }
    } catch (error) {
      console.error("Failed to fetch endTime:", error);
    }
  };

  useEffect(() => {
    fetchEndTime();

    const onMessage = (event) => {
      const message = JSON.parse(event.data);
      if (
        message.action === "startInitialCountdown" ||
        message.action === "resetTimer"
      ) {
        startTimer(message.endTime);
      }
    };

    if (ws) {
      ws.addEventListener("message", onMessage);
    }

    // Clean up
    return () => ws?.removeEventListener("message", onMessage);
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
    const distance = new Date(endTime).getTime() - now;

    if (!endTime || distance < 0) {
      setTimeLeft("Waiting for transaction to complete...");
      return true; // No active countdown
    } else {
      // Calculate total hours, remaining minutes and seconds
      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      return false; // Countdown is active
    }
  };

  // If the game is finished, override the timer text
  const displayTime = gameState === "finished" ? "Game Over" : timeLeft;

  return (
    <Card elevation={4}>
      {/* <CardHeader
        title="Next Move Timer"
        titleTypographyProps={{ fontSize: "1.25rem", fontWeight: "600" }}
      /> */}
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Typography color="warning.main" sx={{ fontSize: "1.25rem", fontWeight: "600" }}>
          {displayTime}
        </Typography>
      </CardContent>
    </Card>
  );
}
