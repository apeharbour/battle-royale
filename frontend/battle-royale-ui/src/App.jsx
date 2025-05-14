import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Web3Provider } from "./Web3Provider";
import useLocalStorageState from "use-local-storage-state";
import "@fontsource-variable/montserrat";
import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";
import "./App.css";

// Import your components
import Header from "./Header";
import Footer from "./Footer";
import About from "./About";
import Yarts from "./Yarts";
import TandC from "./TandC";
import Imprint from "./Imprint";
import Gallery from "./Gallery";
// import Useryarts from "./UserYarts";

function App() {
  const [darkMode] = useLocalStorageState("darkMode", {
    defaultValue: true,
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    typography: {
      fontFamily: "'Montserrat Variable', sans-serif",
    },
    shape: {
      borderRadius: 30,
    },
  });

  const location = useLocation();
  const headerHeight = location.pathname === "/" ? "230px" : "150px";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider theme={theme}>
        {/* Full-height container */}
        <Box
          display="flex"
          flexDirection="column"
          height="96vh" // Full viewport height
        >
          {/* Header */}
          <Box
            flex="0 0 auto"
            width="100%"
            sx={{
              maxWidth: {
                xs: "50%", // Allow the header to grow beyond 100% for mobile
                sm: "20%", // Keep 90% for larger screens
              },
              mx: "auto", // Centers the Box horizontally
              overflow: "visible", // Ensure no clipping
              height: headerHeight,
            }}
          >
            <Header />
          </Box>
          {/* Main content (scrollable) */}
          <Box
            className="hide-scrollbar"
            flex="1 1 auto"
            overflow="auto" // Allows scrolling within this section
          >
            <Routes>
              <Route path="/yarts" element={<Yarts />} />
              <Route path="/tandc" element={<TandC />} />
              <Route path="/about" element={<About />} />
              <Route path="/imprint" element={<Imprint />} />
              <Route path="/" element={<Gallery />} />
              {/* <Route path="/youryarts" element={<Useryarts />} /> */}
            </Routes>
          </Box>
          {/* Footer */}
          <Box
            flex="0 0 auto"
            sx={{
              textAlign: "center",
            }}
          >
            <Footer />
          </Box>
        </Box>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;
