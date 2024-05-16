import { Hexagon } from "react-hexgrid";

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
        <Hexagon
          q={q}
          r={r}
          s={s}
          key={ship.address}
          fill="none"
          className={`ship-${ship.address}`}
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
