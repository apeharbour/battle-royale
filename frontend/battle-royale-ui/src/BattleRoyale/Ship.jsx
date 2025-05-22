import React, { useEffect, useState } from "react";
import { Hexagon } from "react-hexgrid";
import removeYachtBackground from "./RemoveYachtBackground";

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

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
      <text x="-8" y="-8" style={{ fill: "white", fontSize: "0.15em" }}>
        <tspan fontWeight="bold">Player {shortenAddress(player)}</tspan>
        <tspan x="-8" dy="1.2em">
          Movement: {range}, Shot: {shotRange}
        </tspan>
      </text>
    </Hexagon>
  );
}

function showTooltip(event, player) {
  const tip = document.getElementById(`${player}-ship`);
  if (tip) tip.style.display = "block";
}

function hideTooltip(player) {
  const tip = document.getElementById(`${player}-ship`);
  if (tip) tip.style.display = "none";
}

export default function Ship({
  ship,
  size,
  onShipClick,
  className,
  deadPlayers,
  currentRound,
}) {
  const { q, r, s, mine, image, state, range, shotRange } = ship;
  let processedDataUrl = removeYachtBackground(image);

  const wasDeadPreviously =
    deadPlayers &&
    deadPlayers[ship.address] &&
    currentRound > deadPlayers[ship.address];

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

  // Delay the final “destroyed” styling
  const [isDestroyedDelayed, setIsDestroyedDelayed] = useState(false);
  useEffect(() => {
    if (state === "destroyed" && !wasDeadPreviously && !isDestroyedDelayed) {
      const timer = setTimeout(() => {
        setIsDestroyedDelayed(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
    if (state === "destroyed" && wasDeadPreviously) {
      setIsDestroyedDelayed(true);
    }
  }, [state, wasDeadPreviously, isDestroyedDelayed]);

  // Apply grayscale and lower opacity when destroyed
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
        range={range}
        shotRange={shotRange}
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
        {processedDataUrl && (
          <image
            href={processedDataUrl}
            xlinkHref={processedDataUrl}
            width={size.x * 2}
            height={size.y * 2}
            x={-size.x}
            y={-size.y}
            style={{
              ...imageStyle,
              pointerEvents: "none",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
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
