// svgUtils.js

export function removeSvgBackground(svgContent) {
    // Parse the SVG content
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
  
    // Check for parsing errors
    const parseError = svgDoc.querySelector("parsererror");
    if (parseError) {
      console.error("Error parsing SVG content:", parseError.textContent);
      return svgContent; // Return the original SVG if parsing fails
    }
  
    // Remove the background element
    const backgroundElement = svgDoc.querySelector(".background");
    if (backgroundElement) {
      backgroundElement.parentNode.removeChild(backgroundElement);
    }
  
    // Modify any CSS that targets the background
    const styleElement = svgDoc.querySelector("style");
    if (styleElement) {
      let cssText = styleElement.textContent;
      cssText = cssText.replace(
        /\.background\s*{[^}]*}/g,
        ".background { fill: none; }"
      );
      styleElement.textContent = cssText;
    }
  
    // Serialize the modified SVG back to a string
    const serializer = new XMLSerializer();
    const modifiedSvgContent = serializer.serializeToString(svgDoc);
  
    return modifiedSvgContent;
  }
  