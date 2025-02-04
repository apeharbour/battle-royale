// RemoveYachtBackground.jsx
export default function removeYachtBackground(base64Svg) {
    try {
      // 1. Decode the Base64 SVG
      const svgString = atob(base64Svg.split(",")[1]);
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  
      // 2. Find the <rect> with the "background" class and set its fill to "none"
      const backgroundRect = svgDoc.querySelector(".background");
      if (backgroundRect) {
        backgroundRect.setAttribute("fill", "none");
      }
  
      // 3. Find the <style> block and modify the .background class
      const styleElement = svgDoc.querySelector("style");
      if (styleElement) {
        const styleContent = styleElement.textContent;
        const modifiedStyleContent = styleContent.replace(
          /\.background\s*{[^}]*fill:[^;]*;/,
          ".background { fill: none;"
        );
        styleElement.textContent = modifiedStyleContent;
      }
  
      // 4. Serialize the modified SVG back to a string
      const serializer = new XMLSerializer();
      const modifiedSvgString = serializer.serializeToString(svgDoc);
  
      // 5. Re-encode the SVG to Base64
      return `data:image/svg+xml;base64,${btoa(modifiedSvgString)}`;
    } catch (error) {
      console.error("Failed to modify SVG background:", error);
      // If anything goes wrong, return the original image string
      return base64Svg;
    }
  }
  