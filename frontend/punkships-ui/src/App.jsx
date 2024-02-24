import React, { useState } from "react";

import { ethers } from "ethers";
import { Buffer } from "buffer";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";

import "./App.css";
import { CssBaseline } from "@mui/material";

import ship1Master from "../../../contract/assets/ship1mast.svg"

function App() {
  const [ships, setShips] = useState([]);

  // const [tokenIds, setTokenIds] = useState(
  //   Array.from({ length: 2 }, (_, i) => i)
  // );

  const tokenIds = Array.from({ length: 100 }, () => Math.floor(Math.random() * 10000));
  // const tokenIds = [906, 2064, 906, 2064, 906, 2064];

    // state to manage the dark mode
    const [toggleDarkMode, setToggleDarkMode] = useState(true);

    // function to toggle the dark mode as true or false
    const toggleDarkTheme = () => {
      setToggleDarkMode(!toggleDarkMode);
    };

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const abi = [
    "function mint(uint256 tokenId) public",
    "function ownerOf(uint256 tokenId) public view returns (address)",
    "function tokenURI(uint256 tokenId) public view returns (string)",
  ];

  React.useEffect(() => {
    async function fetchData() {
      const url = "http://localhost:8545";
      const provider = new ethers.JsonRpcProvider(url, undefined, {
        staticNetwork: true,
      });

      const contract = new ethers.Contract(contractAddress, abi, provider);

      // const tokenIds = Array.from({ length: 100 }, () =>
      //   Math.floor(Math.random() * 10000)
      // );

      // const tokenIds = Array.from({ length: 3 }, (_, i) => i);

      tokenIds.forEach((id) => {
        contract
          .tokenURI(id)
          .then((uri) => {
            return uri.substr(uri.indexOf("base64") + 7);
          })
          .then((data) => {
            return JSON.parse(Buffer.from(data, "base64").toString("ascii"));
          })
          .then((json) => {
            console.log("token", id, "☑️");
            json.tokenId = id;
            setShips((prevShips) => [...prevShips, json]);
          })
          .catch((error) => {
            console.error("token", id, "❌", error);
          });
      });
    }
    fetchData();
  }, []);

  // create a darkTheme function to handle dark theme using createTheme
  const darkTheme = createTheme({
    palette: {
      mode: toggleDarkMode ? "dark" : "light",
    },
  });

  const getAttribute = (attributes, trait_type) => {
    const result = attributes.filter((x) => x.trait_type == trait_type);
    return result[0].value;
  };

  return (
    // <Container maxWidth="xl" sx={{ backgroundColor: "black"}}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid
        container
        spacing={2}
        justifyContent="center"
        // sx={{ color: "black" }}
      >

        <Grid item xs={12}>
          <Switch checked={toggleDarkMode} onChange={toggleDarkTheme} />
        </Grid>


        {ships.map((ship, index) => (
          <Grid item key={`ship${index}`} 
          // sx={{ backgroundColor: "black" }}
          >
            <Card
              key={ship.name}
              className="card"
              // sx={{ backgroundColor: "black" }}
            >
              <CardMedia
                sx={{ width: 320, height: 240 }}
                image={ship.image}
                title={ship.name}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  // sx={{ color: "lightgray" }}
                >
                  {ship.name}
                </Typography>
                <Chip
                  label={`Range ${getAttribute(ship.attributes, "range")}`}
                  color="primary"
                />
                <Chip
                  label={`Shot ${getAttribute(
                    ship.attributes,
                    "shootingRange"
                  )}`}
                  color="secondary"
                />
                <Chip
                  label={`${getAttribute(ship.attributes, "shipType")}`}
                  color="success"
                />
                {/* <Typography variant="body" color="lightgray">
          Range: {getAttribute(ship.attributes, 'range')}, Shot range: {getAttribute(ship.attributes, 'shootingRange')}, Ship type: {getAttribute(ship.attributes, 'shipType')}
        </Typography> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </ThemeProvider>
    // </Container>
  );
}

export default App;
