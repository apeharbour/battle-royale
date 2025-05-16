// RemoveYachtBackground.jsx
export default function removeYachtBackground(base64Svg) {
  return new Promise((resolve) => {
    try {
      // 1. Decode the Base64 SVG
      const svgString = atob(base64Svg.split(",")[1]);
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, "image/svg+xml");

      // 2. Force transparency on the root SVG element
      svgDoc.documentElement.setAttribute(
        "style",
        "background-color: transparent;"
      );

      // 3. Remove any <rect class="background">
      const backgroundRect = svgDoc.querySelector(".background");
      if (backgroundRect) {
        backgroundRect.setAttribute("fill", "none");
        backgroundRect.setAttribute("fill-opacity", "0");
      }

      // 4. Tweak or inject a <style> to nix any .background rules
      const styleEl = svgDoc.querySelector("style");
      if (styleEl) {
        styleEl.textContent = styleEl.textContent.replace(
          /\.background\s*{[^}]*}/g,
          ".background{fill:none!important;fill-opacity:0!important;}"
        );
      } else {
        const override = svgDoc.createElementNS(
          "http://www.w3.org/2000/svg",
          "style"
        );
        override.textContent =
          ".background{fill:none!important;fill-opacity:0!important;}";
        svgDoc.documentElement.appendChild(override);
      }

      // 5. Serialize back to a clean SVG data URL
      const serialized = new XMLSerializer().serializeToString(svgDoc);
      const svgBlobUrl =
        "data:image/svg+xml;base64," + btoa(serialized);

      // 6. Figure out a canvas size (try width/height attrs, else viewBox)
      let width = parseInt(
        svgDoc.documentElement.getAttribute("width") || ""
      );
      let height = parseInt(
        svgDoc.documentElement.getAttribute("height") || ""
      );
      const viewBox = svgDoc.documentElement.getAttribute("viewBox");
      if (
        (!width || !height) &&
        viewBox &&
        viewBox.split(" ").length === 4
      ) {
        const [, , w, h] = viewBox.split(" ").map(Number);
        width = w;
        height = h;
      }
      // fallback to 100×100 if we still don’t have numbers
      if (!width || !height) {
        width = height = 100;
      }

      // 7. Draw the cleaned SVG into a canvas, then export PNG
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const pngDataUrl = canvas.toDataURL("image/png");
        resolve(pngDataUrl);
      };
      img.onerror = () => {
        // if loading the SVG blob fails, just return the original
        resolve(base64Svg);
      };
      img.src = svgBlobUrl;
    } catch (err) {
      console.error("removeYachtBackground failed:", err);
      // On any error, fall back to the original string
      resolve(base64Svg);
    }
  });
}
