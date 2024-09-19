import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import "./RegistrationCountDown.css";

// Helper function to calculate time difference
const calculateTimeLeft = (registrationTimestamp) => {
  const now = Math.floor(Date.now() / 1000); // Current time in Unix
  const timeLeft = registrationTimestamp + 24 * 60 * 60 - now; // 24 hours in seconds

  if (timeLeft <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return { hours, minutes, seconds };
};

const RegistrationCountdownTimer = ({ registrationTimestamp }) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(registrationTimestamp)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(registrationTimestamp));
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [registrationTimestamp]);

  return (
    <Grid container spacing={2} justifyContent="center" mt={1} mb={1}>
      {["hours", "minutes", "seconds"].map((unit, index) => (
        <Grid item key={index}>
          <Box
            className="holographic-clock-box"
            sx={{
              textAlign: "center",
              padding: "16px",
              borderRadius: "10px",
              minWidth: "100px",
              position: "relative",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "transform 0.2s ease",
              border: "1.8px solid #00ffcc",
            }}
          >
            <Typography variant="h3" className="glowing-number">
              {timeLeft[unit].toString().padStart(2, "0")}
            </Typography>

            {/* Unit label (Hours, Minutes, Seconds) */}
            <Typography
              sx={{ marginTop: "8px", color: "#00ffcc", fontSize: "1rem" }}
            >
              {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default RegistrationCountdownTimer;
