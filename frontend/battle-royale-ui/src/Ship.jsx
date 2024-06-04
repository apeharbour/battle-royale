import { Stack, Typography } from "@mui/material";
import { Hexagon } from "react-hexgrid";


const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

function Tooltip({ q, r, s, range, shotRange, kills, player }) {
  //console.log({ range, shotRange, kills, player });
  return (
    <Hexagon id={`${player}-ship`} q={q} r={r} s={s} fill="none" style={{display:'none'}}>
      <rect x="2" y="-6" width="11" height="4" stroke="#fff" strokeWidth="0.2" fill="rgba(80, 80, 80, 0.9)" rx="1" ry="1" />

      <text x="3" y="-4" style={{fill: 'white', fillOpacity: 1}}>
        <tspan fontWeight="bold">Player {shortenAddress(player)}</tspan>
        <tspan x="3" dy="1">Movement: {range}, Shot: {shotRange}</tspan>
      </text>
    </Hexagon>
  )
}

const showTooltip = (event, player) => {
  //console.log("Show tooltip", event.clientX, event.clientY, `${player}-ship`)
  const tooltip = document.getElementById(`${player}-ship`);
  // tooltip.setAttribute('transform', `translate( ${event.clientX} , ${event.clientY} )`);
  tooltip.style.display = 'block';
}

const hideTooltip = (player) => {
  //console.log("Hide tooltip", `${player}-ship`)
  const tooltip = document.getElementById(`${player}-ship`);
  tooltip.style.display = 'none';
}

export default function Ship({ ship, size }) {
  const { q, r, s, mine, image, state } = ship;

  // update boder color based on player
  const shipColor = mine ? "url(#borderGradient)" : "white";
  const b64Image = image.split(",")[1];
  const svgString = atob(b64Image);
  const updatedSvgString = mine ? svgString
    .replace(/.border { fill: #fff }/g, `.border { animation: colorChange 3s infinite ease-in-out; } @keyframes colorChange { 0% { fill: #fff } 50% { fill: #ff0 } 100% { fill: #fff } }`) : svgString;
    // .replace(
    //   RegExp("</linearGradient></defs>", "g"),
    //   '</linearGradient><linearGradient id="borderGradient" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="yellow"/> <stop offset="100%" stop-color="white"> <animate attributeName="offset" values=".95;.05" dur="5s" repeatCount="indefinite" /> </stop> </linearGradient></defs>'
    // );
  const b64UpdatedSvgString = btoa(updatedSvgString);
  const dataURL = `data:image/svg+xml;base64,${b64UpdatedSvgString}`;

  if (ship.state === "active") {
    return (
      <g>

        {/* <title>range={ship.range} shotRange={ship.shotRange} kills={ship.kills} player={ship.address} </title> */}
        <Tooltip q={q} r={r} s={s} range={ship.range} shotRange={ship.shotRange} kills={ship.kills} player={ship.address} />
        <Hexagon
          q={q}
          r={r}
          s={s}
          key={ship.address}
          fill="none"
          className={`ship-${ship.address}`}
          onMouseOver={(event) => showTooltip(event, ship.address)} onMouseOut={() => hideTooltip(ship.address)}
        >
          <image href={dataURL} height={size.x} transform={`translate(${-size.x*4/3/2} ${-size.y/2})`} />
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
              <circle cx="0" cy="0" r={size.x / 4} fill="lightgray" stroke="black" strokeWidth="0.1" />
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

  return null;
}
