import React, { useRef, useEffect, useState } from "react";
import { Path } from "react-hexgrid";

export default function ShootPath({ start, end, ...props }) {
  // Create a ref to hold the SVG <path> element
  const pathRef = useRef(null);
  const [pathData, setPathData] = useState("");
  const [shipMarker, setShipMarker] = useState("");

  useEffect(() => {
    if (pathRef.current) {
      // Access the SVG <path> element directly
      const svgPathElement = pathRef.current.querySelector("path");
      if (svgPathElement) {
        // Now you can access the 'd' attribute or any other attributes
        const pathData = svgPathElement.getAttribute("d");
        setPathData(pathData);
        if (start && start.address) {
          setShipMarker(`url(#pat-${start.address})`);
        }
        // Perform any actions you need with the path data
      }
    }
  }, [start, end]); // Empty dependency array means this runs once after the initial render

  return (
    <g ref={pathRef}>
      <defs>
        <marker
          id="shootArrowhead"
          markerWidth="4"
          markerHeight="4"
          refX="2"
          refY="2"
          orient="auto"
        >
          <polyline
            points="0 0, 2 2, 0 4"
            fill="none"
            strokeWidth={1}
            stroke="lightgray"
          />
        </marker>
        <marker id="shootIcon" refX="5" refY="5" markerWidth="10" markerHeight="10">
          <circle cx="5" cy="5" r="2" fill="lightgray" />
        </marker>
      </defs>

      <Path
        start={start}
        end={end}
        markerMid="url(#shootIcon)"
        markerEnd="url(#shootIcon)"
      />
      {/* <circle r="2" fill="red">
        <animateMotion dur="10s" repeatCount="indefinite" path={pathData} />
      </circle> */}
    </g>
  );
}
