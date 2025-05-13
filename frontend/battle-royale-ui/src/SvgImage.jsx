import React from "react";
import { removeSvgBackground } from "./svgUtil.js";

function SvgImage({ image, alt, loading, style, onClick }) {

  // Extract the base64 string from the data URL
  const base64String = image.replace(/^data:image\/svg\+xml;base64,/, "");

  // Decode the base64 string to get the SVG content
  let svgContent;
  try {
    svgContent = atob(base64String);
  } catch (error) {
    console.error("Error decoding base64 SVG image:", error);
    return null;
  }

  // Remove the background from the SVG content
  const modifiedSvgContent = removeSvgBackground(svgContent);

  // Encode the modified SVG content back to base64
  const modifiedBase64 = btoa(modifiedSvgContent);

  // Create a new data URL
  const modifiedImage = "data:image/svg+xml;base64," + modifiedBase64;

  // Render the image
  return (
    <img
      src={modifiedImage}
      alt={alt}
      loading={loading}
      style={style}
      onClick={onClick}
    />
  );
}

export default SvgImage;
