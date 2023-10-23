const express = require('express');
const cors = require("cors");
const app = express();
app.use(express.json()); // for parsing application/json

// Mock database
let pathsData = {};

app.use(cors({
    origin: ['https://localhost:3000', 'https://apeharbour.com', 'https://beta.apeharbour.com', 'https://main.d2clhd270spzjd.amplifyapp.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'],
    credentials: true,
    maxAge: 86400
  }));

// Endpoint to retrieve pathsData
app.get('/paths', (req, res) => {
  res.json(pathsData);
});

// Endpoint to update pathsData
app.post('/paths', (req, res) => {
  const { playerId, path } = req.body;
  if (playerId && path) {
    pathsData[playerId] = path; // Update the path for the specified player
    res.json({ status: 'success', data: pathsData });
  } else {
    res.status(400).send('Player ID and path are required');
  }
});

// Export your express server so you can import it in the lambda function
module.exports = app;
