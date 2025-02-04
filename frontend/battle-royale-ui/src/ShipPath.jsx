// ShipPath.jsx
import React, { useRef, useEffect, useState } from "react";
import { HexUtils, Path } from "react-hexgrid";
import removeYachtBackground from "./RemoveYachtBackground.jsx"; // <-- import your function here

export default function ShipPath({ start, end, ship, size, ...props }) {
  const pathRef = useRef(null);

  // We'll keep the processed ship image in state
  const [processedShip, setProcessedShip] = useState(ship);

  useEffect(() => {
    if (ship) {
      // Apply the background-removal here
      const updatedShipImage = removeYachtBackground(ship);
      setProcessedShip(updatedShipImage);
    }
  }, [ship]);

  return (
    <g ref={pathRef}>
      <defs>
        <marker id="icon" refX="4" refY="5" markerWidth="8" markerHeight="8">
          <image
            href={processedShip}      
            height="10"
            width="10"
            filter="url(#grayscale)"
          />
        </marker>
        <filter id="grayscale">
          <feColorMatrix type="saturate" values="0.10" />
        </filter>
      </defs>

      <Path
        start={start}
        end={end}
        markerEnd="url(#icon)"
        className="ship-path"
      />
    </g>
  );
}
