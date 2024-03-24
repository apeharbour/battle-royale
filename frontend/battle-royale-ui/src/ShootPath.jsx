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

  const shootPathStyle = {
    animation: 'path-draw 2s linear forwards infinite',
    strokeWidth: 0.5, 
    strokeLinecap: "round", 
    strokeLinejoin: "round" , 
    // strokeOpacity: 0.5 
  };


  return (
    <g ref={pathRef}>
      <defs>
        <marker id="shootIcon" refX="5" refY="5" markerWidth="10" markerHeight="10">
          <circle cx="5" cy="5" r="2" fill="lightgray" />
        </marker>
      </defs>

      <Path
        start={start}
        end={end}
        // markerMid="url(#shootIcon)"
        markerEnd="url(#shootIcon)"
        className="shoot-path"

      />
      {/* <circle r="2" fill="red">
        <animateMotion dur="10s" repeatCount="indefinite" path={pathData} />
      </circle> */}
    </g>
  );
}
