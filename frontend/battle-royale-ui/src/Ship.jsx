import skullImage from "./images/skull.png";
import React, { useEffect, useState } from "react";
import { Hexagon } from "react-hexgrid";
import removeYachtBackground from "./RemoveYachtBackground";

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

function Tooltip({ q, r, s, range, shotRange, kills, player }) {
  return (
    <Hexagon
      id={`${player}-ship`}
      q={q}
      r={r}
      s={s}
      fill="none"
      style={{ display: "none" }}
    >
      <rect
        x="-10"
        y="-15"
        width="29"
        height="14"
        stroke="#fff"
        strokeWidth="0.2"
        fill="rgba(80, 80, 80, 0.9)"
        rx="2"
        ry="2"
      />
      <text
        x="-8"
        y="-8"
        style={{ fill: "white", fillOpacity: 1, fontSize: "0.15em" }}
      >
        <tspan fontWeight="bold">Player {shortenAddress(player)}</tspan>
        <tspan x="-8" dy="1.2em">
          Movement: {range}, Shot: {shotRange}
        </tspan>
      </text>
    </Hexagon>
  );
}

const showTooltip = (event, player) => {
  const tooltip = document.getElementById(`${player}-ship`);
  if (tooltip) tooltip.style.display = "block";
};

const hideTooltip = (player) => {
  const tooltip = document.getElementById(`${player}-ship`);
  if (tooltip) tooltip.style.display = "none";
};

export default function Ship({ ship, size, onShipClick, className }) {
  const { q, r, s, mine, image, state } = ship;
  const [isDestroyedDelayed, setIsDestroyedDelayed] = useState(false);
  const [showSkull, setShowSkull] = useState(false);

  let processedDataUrl = removeYachtBackground(image);

  try {
    const base64Part = processedDataUrl.split(",")[1];
    const svgString = atob(base64Part);
    if (mine) {
      const animatedSvgString = svgString.replace(
        /.border\s*\{\s*fill:\s*#fff\s*\}/g,
        `.border { 
          animation: colorChange 3s infinite ease-in-out; 
        }
        @keyframes colorChange { 
          0% { fill: #fff } 
          50% { fill: #ff0 } 
          100% { fill: #fff } 
        }`
      );
      processedDataUrl = `data:image/svg+xml;base64,${btoa(animatedSvgString)}`;
    }
  } catch (error) {
    console.error("Failed to inject border animation:", error);
  }

  // Only trigger the sequence if this is the first time the ship becomes destroyed.
  useEffect(() => {
    if (state === "destroyed" && !isDestroyedDelayed) {
      let skullTimer, grayscaleTimer;
      // Wait 4 seconds after the ship gets destroyed to show the skull overlay.
      skullTimer = setTimeout(() => {
        setShowSkull(true);
        // After 1 second of showing the skull, remove it and set the final grayscale state.
        grayscaleTimer = setTimeout(() => {
          setShowSkull(false);
          setIsDestroyedDelayed(true);
        }, 3000);
      }, 4500);
      return () => {
        clearTimeout(skullTimer);
        clearTimeout(grayscaleTimer);
      };
    } else if (state !== "destroyed") {
      // Reset if ship is not destroyed.
      setShowSkull(false);
      setIsDestroyedDelayed(false);
    }
  }, [state, isDestroyedDelayed]);

  const imageStyle = {};
  if (state === "destroyed" && isDestroyedDelayed) {
    imageStyle.filter = "grayscale(80%)";
    imageStyle.opacity = 0.2;
  }

  return (
    <g>
      <Tooltip
        q={q}
        r={r}
        s={s}
        range={ship.range}
        shotRange={ship.shotRange}
        kills={ship.kills}
        player={ship.address}
      />

      <Hexagon
        q={q}
        r={r}
        s={s}
        fill="none"
        style={{ pointerEvents: "auto" }}
        onMouseOver={(e) => showTooltip(e, ship.address)}
        onMouseOut={() => hideTooltip(ship.address)}
        onClick={(e) => onShipClick(e, { q, r, s })}
        className={className}
      >
        <image
          href={processedDataUrl}
          width={size.x * 2}
          height={size.y * 2}
          x={-size.x}
          y={-size.y}
          style={{
            ...imageStyle,
            pointerEvents: "none",
          }}
        />

        {/* Display imported skull image on top if required */}
        {state === "destroyed" && showSkull && (
          <image
            href={skullImage}
            width={size.x * 1.5}
            height={size.y * 1.5}
            x={-size.x + 0.8}
            y={-size.y + 0.5}
            style={{ pointerEvents: "none" }}
          />
        )}
      </Hexagon>

      {ship.shot && ship.shot.origin && (
        <g>
          <Hexagon
            q={ship.shot.origin.q}
            r={ship.shot.origin.r}
            s={ship.shot.origin.s}
            key={`${ship.address}-shot`}
            fill="none"
            className={`canon-${ship.address}`}
          >
            <circle
              cx="0"
              cy="0"
              r={size.x / 4}
              fill="lightgray"
              stroke="black"
              strokeWidth="0.1"
            />
          </Hexagon>
          <Hexagon
            q={ship.shot.destination.q}
            r={ship.shot.destination.r}
            s={ship.shot.destination.s}
            fill="none"
          >
            <path
              className="explosion"
              d="M -1 -2 l 1 -4 l 1 3 l 4 -1 l -3 3 l 4 2 l -4 0 l 2 4 l -3 -3 l -2 3 l 0 -3 l -2 1 l 1 -3 l -2 -2 z"
            />
          </Hexagon>
        </g>
      )}
    </g>
  );
}
