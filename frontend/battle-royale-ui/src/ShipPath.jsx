import React, { useRef, useEffect, useState } from "react";
import { HexUtils, Path } from "react-hexgrid";

export default function ShipPath({ start, end, ship, size, ...props }) {
  // Create a ref to hold the SVG <path> element
  const pathRef = useRef(null);

  return (
    <g ref={pathRef}>
      <defs>
        <marker id="icon" refX="4" refY="4" markerWidth="8" markerHeight="8">
          <image
            href={ship}
            // width="8"
            // height="8"
            height="6"
            filter="url(#grayscale)"
          ></image>
        </marker>
        <filter id="grayscale">
          <feColorMatrix type="saturate" values="0.10" />
        </filter>
      </defs>

      <Path
        start={start}
        end={end}
        // markerMid="url(#icon)"
        markerEnd="url(#icon)"
        className="ship-path"
      />
    </g>
  );
}
