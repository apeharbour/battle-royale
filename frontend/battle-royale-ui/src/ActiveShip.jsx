import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
} from "@mui/material";

export default function ActiveShip({ ship, handleCardClick, selectedYacht }) {
  // Function to remove the background from SVG
  const modifySvgBackground = (base64Svg) => {
    try {
      // Decode the Base64 SVG
      const svgString = atob(base64Svg.split(",")[1]);
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, "image/svg+xml");

      // Find the <rect> with the "background" class and set its fill to "none"
      const backgroundRect = svgDoc.querySelector(".background");
      if (backgroundRect) {
        backgroundRect.setAttribute("fill", "none");
      }

      // Find the <style> block and modify the .background class
      const styleElement = svgDoc.querySelector("style");
      if (styleElement) {
        const styleContent = styleElement.textContent;
        const modifiedStyleContent = styleContent.replace(
          /\.background\s*{[^}]*fill:[^;]*;/,
          ".background { fill: none;"
        );
        styleElement.textContent = modifiedStyleContent;
      }

      // Serialize the modified SVG back to a string
      const serializer = new XMLSerializer();
      const modifiedSvgString = serializer.serializeToString(svgDoc);

      // Re-encode the SVG to Base64
      return `data:image/svg+xml;base64,${btoa(modifiedSvgString)}`;
    } catch (error) {
      console.error("Failed to modify SVG background:", error);
      return base64Svg; // Return original if modification fails
    }
  };

  const modifiedImage = modifySvgBackground(ship.image);

  return (
    <Card
      sx={{
        border: selectedYacht === ship ? "2px solid blue" : "none",
        cursor: "pointer",
        "&:hover": { border: "2px solid blue" },
      }}
      onClick={() => handleCardClick(ship)}
    >
      <CardMedia
        component="img"
        alt={ship.name}
        image={modifiedImage} // Use the modified SVG with transparent background
        title={ship.name}
        sx={{
          height: 140,
          objectFit: "contain",
          backgroundColor: "transparent",
        }}
      />
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Typography gutterBottom sx={{ fontSize: "1rem", textAlign: "center" }}>
          {ship.name} {ship.tokenId}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Chip
            label={`Movement: ${ship.movement}`}
            sx={{
              height: "32px",
              minWidth: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <Chip
            label={`Shoot: ${ship.shoot}`}
            sx={{
              height: "32px",
              minWidth: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
