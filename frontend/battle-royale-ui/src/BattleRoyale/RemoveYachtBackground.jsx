export default function removeYachtBackground(base64Svg) {
  try {
    // 1. Decode the Base64 SVG
    const svgString = atob(base64Svg.split(",")[1]);
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");

    // 2. Force transparency on the root SVG element (important for Safari)
    svgDoc.documentElement.setAttribute(
      "style",
      "background-color: transparent;"
    );

    // 3. Find the <rect> with the "background" class and set its fill to "none" and opacity to 0
    const backgroundRect = svgDoc.querySelector(".background");
    if (backgroundRect) {
      backgroundRect.setAttribute("fill", "none");
      backgroundRect.setAttribute("fill-opacity", "0");
    }

    // 4. Find the <style> block and modify the .background class
    const styleElement = svgDoc.querySelector("style");
    if (styleElement) {
      const styleContent = styleElement.textContent;
      const modifiedStyleContent = styleContent.replace(
        /\.background\s*{[^}]*fill:[^;]*;/,
        ".background { fill: none !important; fill-opacity: 0 !important;"
      );
      styleElement.textContent = modifiedStyleContent;
    } else {
      // 5. If no <style> element exists, create one and append it
      const overrideStyle = svgDoc.createElementNS(
        "http://www.w3.org/2000/svg",
        "style"
      );
      overrideStyle.textContent =
        ".background { fill: none !important; fill-opacity: 0 !important; }";
      svgDoc.documentElement.appendChild(overrideStyle);
    }

    // 6. Serialize the modified SVG back to a string
    const serializer = new XMLSerializer();
    const modifiedSvgString = serializer.serializeToString(svgDoc);

    // 7. Re-encode the SVG to Base64
    return `data:image/svg+xml;base64,${btoa(modifiedSvgString)}`;
  } catch (error) {
    console.error("Failed to modify SVG background:", error);
    // If anything goes wrong, return the original image string
    return base64Svg;
  }
}
