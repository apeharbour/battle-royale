import { Hexagon, Pattern } from "react-hexgrid";
import explosion from "./assets/explosion.svg";
import ExplosionIcon from "./ExplosionIcon";

export default function Ship({ ship, size }) {
  const { q, r, s, mine, image, state } = ship;

  // update boder color based on player
  const shipColor = mine ? "url(#borderGradient)" : "white";
  const b64Image = image.split(",")[1];
  const svgString = atob(b64Image);
  const updatedSvgString = svgString
    .replace(/.border { fill: #fff }/g, `.border { fill: ${shipColor} }`)
    .replace(
      RegExp("</linearGradient></defs>", "g"),
      '</linearGradient><linearGradient id="borderGradient" gradientUnits="userSpaceOnUse"> <stop offset="0%" stop-color="yellow"/> <stop offset="100%" stop-color="red"> <animate attributeName="offset" values=".95;.80;.60;.40;.20;0;.20;.40;.60;.80;.95" dur="5s" repeatCount="indefinite" /> </stop> </linearGradient></defs>'
    );
  const b64UpdatedSvgString = btoa(updatedSvgString);
  const dataURL = `data:image/svg+xml;base64,${b64UpdatedSvgString}`;

  const shipSize = { x: size.x - 0.5, y: size.y - 0.5 };

  console.log("ship in comp", ship);

  if (ship.state === "active") {
    return (
      <g>
        <Hexagon
          q={q}
          r={r}
          s={s}
          key={ship.address}
          fill={`pat-${ship.address}`}
          className={`ship-${ship.address}`}
        />
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
              <circle cx="0" cy="0" r={size.x / 4} fill="lightgray" />
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
        <Pattern id={`pat-${ship.address}`} link={dataURL} size={shipSize} />
      </g>
    );
  }

  return null;

  // <foreignObject x={point.x - size / 2} y={point.y - size / 2} height={size} width={size}>
  // <g dangerouslySetInnerHTML={{ __html: stringValue }} />
  // </foreignObject>

  // <svg
  //   x={point.x - size / 2}
  //   y={point.y - size / 2}
  //   height={size}
  //   width={size}
  //   viewBox="0 0 199.502 199.502"
  // >
  //   <defs>
  //     <g id="ship">
  //       {svgString}
  //     </g>
  //   </defs>
  //   <use href="#ship" />
  //   {/* <g>
  //     <path
  //       d="M198.773,118.615c-0.663-0.86-1.687-1.364-2.772-1.364h-54.559c-1.198,0-2.312,0.614-2.955,1.624l-7.858,12.376h-22.128
  // 		V53.122l32.801-13.12c1.328-0.533,2.199-1.82,2.199-3.25s-0.872-2.717-2.199-3.25L108.501,20.38V8.751h-7v14v28v80.5h-24.5v-10.5
  // 		h17.5c1.359,0,2.594-0.786,3.17-2.017c0.576-1.231,0.388-2.683-0.484-3.727c-0.061-0.073-6.186-8.242-6.186-38.006
  // 		c0-29.528,6.175-37.987,6.187-38.006c0.871-1.044,1.059-2.497,0.484-3.727c-0.576-1.23-1.812-2.017-3.17-2.017H42.001
  // 		c-1.313,0-2.514,0.733-3.114,1.901c-0.3,0.588-7.386,14.689-7.386,41.849s7.085,41.262,7.386,41.85
  // 		c0.6,1.167,1.801,1.9,3.114,1.9h14v10.5h-52.5c-1.537,0-2.892,1.001-3.345,2.468c-0.453,1.468,0.104,3.059,1.372,3.924
  // 		l49.528,33.769c15.642,10.664,43.764,19.339,62.691,19.339h64.754c1.589,0,2.981-1.072,3.386-2.61l17.5-66.5
  // 		C199.662,120.592,199.436,119.475,198.773,118.615z M108.501,27.921l22.077,8.83l-22.077,8.83V27.921z M44.3,113.751
  // 		c-1.772-4.505-5.799-16.922-5.799-36.75c0-19.833,4.03-32.254,5.797-36.75h44.551c-2.221,5.898-4.848,17.041-4.848,36.75
  // 		s2.627,30.852,4.849,36.75H73.501h-14H44.3z M70.001,120.751v10.5h-7v-10.5H70.001z M175.803,183.751h-62.055
  // 		c-17.736,0-44.09-8.13-58.746-18.122l-40.155-27.378h44.654h14h28h7h24.052c1.198,0,2.312-0.614,2.955-1.624l7.858-12.376h48.094
  // 		L175.803,183.751z"
  //       style={{ fill: shipColor }}
  //     />
  //     <circle cx="84.001" cy="155.751" r="7" />
  //     <circle cx="115.501" cy="155.751" r="7" />
  //     <circle cx="147.001" cy="155.751" r="7" />
  //   </g> */}
  //   {/* <image href={image} width="100%" height="100%"/> */}
  // </svg>
}
