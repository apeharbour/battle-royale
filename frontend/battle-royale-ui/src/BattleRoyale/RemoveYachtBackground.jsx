// RemoveYachtBackground.jsx
export default function removeYachtBackground(base64Svg) {
  try {
    // 1. Decode the Base64 SVG
    const svgString = atob(base64Svg.split(',')[1]);
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svg = doc.documentElement;

    // 2. Ensure the core SVG namespaces are declared
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    // 3. If there's no viewBox, infer one from width/height
    if (
      !svg.hasAttribute('viewBox') &&
      svg.hasAttribute('width') &&
      svg.hasAttribute('height')
    ) {
      svg.setAttribute(
        'viewBox',
        `0 0 ${svg.getAttribute('width')} ${svg.getAttribute('height')}`
      );
    }

    // 4. Remove any <rect> that was serving as a white/opaque background
    doc.querySelectorAll('rect').forEach((r) => {
      const fill = r.getAttribute('fill')?.trim().toLowerCase();
      if (
        fill === '#fff' ||
        fill === 'white' ||
        r.classList.contains('background')
      ) {
        r.remove();
      }
    });

    // 5. Serialize back to a string
    const cleanedSvg = new XMLSerializer().serializeToString(svg);

    // 6. URI-encode instead of Base64-encode
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      cleanedSvg
    )}`;
  } catch (error) {
    console.error('Failed to strip SVG background:', error);
    return base64Svg;
  }
}
