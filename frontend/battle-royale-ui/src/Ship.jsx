import { Hexagon } from "react-hexgrid";

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

function Tooltip({ q, r, s, range, shotRange, kills, player }) {
  return (
    <Hexagon id={`${player}-ship`} q={q} r={r} s={s} fill="none" style={{ display: 'none' }}>
       <rect x="-10" y="-15" width="29" height="14" stroke="#fff" strokeWidth="0.2" fill="rgba(80, 80, 80, 0.9)" rx="2" ry="2" />

      <text x="-8" y="-8" style={{ fill: 'white', fillOpacity: 1, fontSize: '0.15em' }}>
        <tspan fontWeight="bold">Player {shortenAddress(player)}</tspan>
        <tspan x="-8" dy="1.2em">Movement: {range}, Shot: {shotRange}</tspan>
      </text>
    </Hexagon>
  )
}

const showTooltip = (event, player) => {
  const tooltip = document.getElementById(`${player}-ship`);
  tooltip.style.display = 'block';
}

const hideTooltip = (player) => {
  const tooltip = document.getElementById(`${player}-ship`);
  tooltip.style.display = 'none';
}

export default function Ship({ ship, size }) {
  const { q, r, s, mine, image, state } = ship;

  const shipColor = mine ? "url(#borderGradient)" : "white";
  const b64Image = image.split(",")[1];
  const svgString = atob(b64Image);
  const updatedSvgString = mine ? svgString
    .replace(/.border { fill: #fff }/g, `.border { animation: colorChange 3s infinite ease-in-out; } @keyframes colorChange { 0% { fill: #fff } 50% { fill: #ff0 } 100% { fill: #fff } }`) : svgString;
  const b64UpdatedSvgString = btoa(updatedSvgString);
  const dataURL = `data:image/svg+xml;base64,${b64UpdatedSvgString}`;

  if (ship.state === "active") {
    return (
      <g>
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
          <image href={dataURL} height={size.x} transform={`translate(${-size.x * 4 / 3 / 2} ${-size.y / 2})`} />
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
