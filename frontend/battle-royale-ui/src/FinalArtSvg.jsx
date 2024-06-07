import React, { Fragment, useEffect, useState } from "react";
import {
  Hex,
  HexGrid,
  HexUtils,
  Hexagon,
  Layout,
  Path,
  Pattern,
  Text,
} from "react-hexgrid";
import ShipPath from "./ShipPath.jsx";

import * as images from "./assets/tiles/clean/index.js";
// import * as imagesPixel from "./assets/tiles/pixel/index.js";

import useResizeObserver from "./utils/useResizeObserver.jsx";
import Point from "react-hexgrid/lib/models/Point.js";

const isReachable = (destination, origin, distance) => {
  const originHex = new Hex(origin.q, origin.r, origin.r * -1 - origin.q);
  const destinationHex = new Hex(
    destination.q,
    destination.r,
    destination.r * -1 - destination.q
  );
  if (
    HexUtils.equals(originHex, destinationHex) ||
    ((originHex.q === destinationHex.q ||
      originHex.r === destinationHex.r ||
      originHex.s === destinationHex.s) &&
      HexUtils.distance(destinationHex, originHex) <= distance)
  ) {
    return true;
  }
  return false;
};

const shortenAddress = (address) => {
  return `${address.slice(2, 6)}\n${address.slice(-4)}`;
};
const addrStart = (address) => {
  return `${address.slice(2, 6)}`;
};

const addrEnd = (address) => {
  return `${address.slice(-4)}`;
};

const isHighlighted = (cell, highlights) => {
  return highlights.some((c) => HexUtils.equals(c, cell));
};

export default function FinalArtSvg({
  center,
  cells,
  ships,
  gameId,
  parentRef,
}) {
  const [hexGridSize, setHexGridSize] = useState(200);

  const calcSize = ({ x, y }, radius, maxRadius) => {
    const factor = 0.9;
    return {
      x: -1 * factor * x * radius + maxRadius,
      y: -1 * factor * y * radius + maxRadius,
    };
  };

  const hexagonSize = calcSize({ x: 1, y: 1 }, center.q, 9);
  const islandSize = { x: hexagonSize.x * 0.866, y: hexagonSize.y * 1 };
  const waterSize = islandSize;

  const SHOT_DURATION = 1;
  const TRAVEL_DURATION = 4;

  const dimensions = useResizeObserver(parentRef);

  /* track the parents dimensions */
  useEffect(() => {
    if (dimensions) {
      setHexGridSize(
        Math.min(
          dimensions.width,
          window.visualViewport.height,
          window.visualViewport.width
        )
      );
      console.log(
        "new Size:",
        Math.min(
          dimensions.width,
          window.visualViewport.height,
          window.visualViewport.width
        )
      );
    }
  }, [dimensions]);

  const layout = new Layout({
    size: hexagonSize,
    spacing: 1.02,
    flat: false,
    origin: { x: 0, y: 0 },
  });
  const shift = HexUtils.hexToPixel(center, layout.props.value.layout);
  shift.x *= -1;
  shift.y *= -1;

  const travelLongs = ships.map((ship) => {
    return ship.travelLong.map((hex) => {
      const point = HexUtils.hexToPixel(hex, layout.props.value.layout);
      return { x: point.x + shift.x, y: point.y + shift.y };
    });
  });

  const shotPaths = ships.map((ship) => {
    return ship.shots.map((shot) => {
      const from = HexUtils.hexToPixel(shot.from, layout.props.value.layout);
      const to = HexUtils.hexToPixel(shot.to, layout.props.value.layout);
      return {
        from: { x: from.x + shift.x, y: from.y + shift.y },
        to: { x: to.x + shift.x, y: to.y + shift.y },
      };
    });
  });

  const travelPaths = ships.map((ship) => {
    return ship.travels.map((travel) => {
      const from = HexUtils.hexToPixel(travel.from, layout.props.value.layout);
      const to = HexUtils.hexToPixel(travel.to, layout.props.value.layout);
      return {
        from: { x: from.x + shift.x, y: from.y + shift.y },
        to: { x: to.x + shift.x, y: to.y + shift.y },
      };
    });
  });

  const createTravelLongPath = (points) => {
    const pointsShifted = points.map((p) => { return {x: p.x -2, y: p.y -2}})
    const intermediatePath = pointsShifted.slice(1).map((p) => `L${p.x} ${p.y} L${p.x} ${p.y}`).join(' ')
    const longPath = `M${pointsShifted[0].x} ${pointsShifted[0].y} ${intermediatePath}`

    console.log('points:', points)
    console.log('path: :', longPath)
    return longPath
  }

  console.log("travelLongs", travelLongs);
  console.log("shotPaths", shotPaths);

  return (
    <HexGrid width={hexGridSize} height={hexGridSize}>
      <style>
        {`
          .hexagon {
            stroke-width: 0;
            stroke: #ccc;
            fill: inherit;
          }
          .art-cells { filter: url(#brushed-effect); }
          // .art-island { stroke:  #cd853f; fill: #cd853f; }
          // .art-water { stroke: #87ceeb; fill: #87ceeb;}
          .art-island { stroke:  none; fill: none; }
          .art-water { stroke: none; fill: none;}
          .ship { stroke: #000; fill: none; }
          .travel-path { stroke: #87ceeb; stroke-width: 0.5;}
          .travel-path-long { stroke: #afa; stroke-width: 0.5; }
          .shipMarker { fill: #ff0; }
          .killed { stroke: #ff0000; fill: none;}
          .shot-path { stroke: #fff; stroke-width: 0.2;}

          text {
            stroke-width: 0;
            fill: black;
            font-size: 0.07em;
        `}
      </style>
      <filter id="squiggle">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01"
          numOctaves="3"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="5"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id="brushed-effect">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.05"
          numOctaves="3"
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
      </filter>
      <symbol id="brushed-x" viewBox="0 0 100 100" refX="50" refY="50">
        <line
          x1="10"
          y1="10"
          x2="90"
          y2="90"
          stroke="black"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#brushed-effect)"
        />
        <line
          x1="90"
          y1="10"
          x2="10"
          y2="90"
          stroke="black"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#brushed-effect)"
        />
      </symbol>
      <symbol id="boatIcon" viewBox="0 0 10 10" refX="4" refY="4">
        <g
          stroke="brown"
          strokeLinejoin="round"
          strokeWidth="0.5"
          strokeLinecap="round"
        >
          <path d="M1 6 h8 l-1 2 h-6 z" />
          <path d="M6 1 v5 v-3 l-2 -1z" />
        </g>
      </symbol>
      <Layout size={hexagonSize} spacing={1.05} flat={false} origin={shift}>
        {/* cells */}
        <g className="art-cells">
          {cells.map(({ q, r, s, state, neighborCode }) => (
            <Hexagon
              className={`art-${state}`}
              key={`hex-${q}-${r}`}
              q={q}
              r={r}
              s={s}
              // filter="url(#squiggle)"
            >
              {state === "island" && (
                <circle
                  r="2"
                  fill="brown"
                  strokeWidth="0"
                  filter="url(#brushed-effect)"
                />
              )}
            </Hexagon>
          ))}

          {/* active ships */}
          {ships
            .filter((s) => !s.killed)
            .map((ship) => (
              // <circle cx="0" cy="0" r="2" fill="none" />
              <Fragment key={`ship-${ship.q}-${ship.r}`}>
                {/* {ship.shots.map((shot) => (
                  <Path
                    key={`shot-${shot.from.q}-${shot.from.r}-${shot.to.q}-${shot.to.r}`}
                    start={shot.from}
                    end={shot.to}
                    className="shot-path"
                  />
                ))} */}
              </Fragment>
            ))}

          {/* travel paths */}
          {travelLongs.map((travelLong, idx) => (
            <React.Fragment>
              <path
                id={`travelLong-${idx}`}
                key={`travelLong-${idx}`}
                d={createTravelLongPath(travelLong)}
                className="travel-path-long"
                strokeDasharray={
                  document.getElementById(`travelLong-${idx}`)
                    ? document
                        .getElementById(`travelLong-${idx}`)
                        .getTotalLength()
                    : 0
                }
                strokeDashoffset={
                  document.getElementById(`travelLong-${idx}`)
                    ? document
                        .getElementById(`travelLong-${idx}`)
                        .getTotalLength()
                    : 0
                }
                fill="none"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  to="0"
                  from={
                    document.getElementById(`travelLong-${idx}`)
                      ? document
                          .getElementById(`travelLong-${idx}`)
                          .getTotalLength()
                      : 0
                  }
                  dur={`${(TRAVEL_DURATION + SHOT_DURATION) * (travelLong.length - 1)}s`}
                  fill="freeze"
                />
              </path>
              <circle cx="0" cy="0" r="2" className="shipMarker">
                <animateMotion
                  dur={`${(TRAVEL_DURATION + SHOT_DURATION) * (travelLong.length - 1)}s`}
                  repeatCount="1"
                  rotate="auto"
                  fill="freeze"
                >
                  <mpath href={`#travelLong-${idx}`} />
                </animateMotion>
              </circle>
            </React.Fragment> 
          ))}

          {/* travel paths */}
          {travelPaths.map((ship, shipIdx) => {
            return ship.map((travelPath, pathIdx) => (
              <React.Fragment>
                <path
                  id={`travelPath-${shipIdx}-${pathIdx}`}
                  key={`travelPath-${shipIdx}-${pathIdx}`}
                  d={`M${travelPath.from.x} ${travelPath.from.y} L${travelPath.to.x} ${travelPath.to.y}`}
                  className="travel-path"
                  strokeDasharray={
                    document.getElementById(`travelPath-${shipIdx}-${pathIdx}`)
                      ? document
                          .getElementById(`travelPath-${shipIdx}-${pathIdx}`)
                          .getTotalLength()
                      : 0
                  }
                  strokeDashoffset={
                    document.getElementById(`travelPath-${shipIdx}-${pathIdx}`)
                      ? document
                          .getElementById(`travelPath-${shipIdx}-${pathIdx}`)
                          .getTotalLength()
                      : 0
                  }
                  fill="none"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    to="0"
                    from={
                      document.getElementById(
                        `travelPath-${shipIdx}-${pathIdx}`
                      )
                        ? document
                            .getElementById(`travelPath-${shipIdx}-${pathIdx}`)
                            .getTotalLength()
                        : 0
                    }
                    dur={`${TRAVEL_DURATION}s`}
                    begin={`${pathIdx * (TRAVEL_DURATION + SHOT_DURATION)}s`}
                    fill="freeze"
                  />
                </path>
                <circle id={`circle${shipIdx}-${pathIdx}`} cx="0" cy="0" r="2" className="shipMarker">
                  <animateMotion
                    dur="4s"
                    repeatCount="1"
                    begin={`${pathIdx * (TRAVEL_DURATION + SHOT_DURATION)}s`}
                    rotate="auto"
                    fill="freeze"
                  >
                    <mpath href={`#travelPath-${shipIdx}-${pathIdx}`} />
                  </animateMotion>
                  <animate dur={`${SHOT_DURATION}s`} begin={`${pathIdx * (TRAVEL_DURATION + SHOT_DURATION) + TRAVEL_DURATION}s`} attributeName="r" values="2;5;2" repeatCount="1" fill="freeze"/>
                  <animate dur="1ms" begin={`${pathIdx * (TRAVEL_DURATION + SHOT_DURATION) + TRAVEL_DURATION + SHOT_DURATION}s`} attributeName="opacity" from="1" to="0" repeatCount="1" fill="freeze"/>
                </circle>
              </React.Fragment>
            ));
          })}

          {/* shot paths */}
          {shotPaths.map((ship, shipIdx) => {
            return ship.map((shotPath, pathIdx) => (
              <React.Fragment>
                <path
                  id={`shotPath-${shipIdx}-${pathIdx}`}
                  key={`shotPath-${shipIdx}-${pathIdx}`}
                  d={`M${shotPath.from.x} ${shotPath.from.y} L${shotPath.to.x} ${shotPath.to.y}`}
                  className="shot-path"
                  strokeDasharray={
                    document.getElementById(`shotPath-${shipIdx}-${pathIdx}`)
                      ? document
                          .getElementById(`shotPath-${shipIdx}-${pathIdx}`)
                          .getTotalLength()
                      : 0
                  }
                  strokeDashoffset={
                    document.getElementById(`shotPath-${shipIdx}-${pathIdx}`)
                      ? document
                          .getElementById(`shotPath-${shipIdx}-${pathIdx}`)
                          .getTotalLength()
                      : 0
                  }
                  fill="none"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    to="0"
                    from={
                      document.getElementById(`shotPath-${shipIdx}-${pathIdx}`)
                        ? document
                            .getElementById(`shotPath-${shipIdx}-${pathIdx}`)
                            .getTotalLength()
                        : 0
                    }
                    dur={`${SHOT_DURATION}s`}
                    begin={`${
                      (pathIdx + 1) * TRAVEL_DURATION + pathIdx * SHOT_DURATION
                    }s`}
                    fill="freeze"
                  />
                </path>
              </React.Fragment>
            ));
          })}

          {/* ships */}

          {/* active ships */}
          {ships
            // .filter((s) => s.killed)
            .map((ship) => {
              
              <Fragment key={`ship-${ship.q}-${ship.r}`}>
                {console.log("ship", ship.q, ship.r, ship.s) }
                <Hexagon
                  id={`ship-hex-${ship.q}-${ship.r}`}
                  key={`ship-${ship.q}-${ship.r}`}
                  q={ship.q}
                  r={ship.r}
                  s={ship.s}
                >
                  <circle id={`ship-${ship.q}-${ship.r}`} cx="20" cy="10" r="3" fill="#00f"/>
                  {/* <use
                    href="#brushed-x"
                    width="2"
                    height="2"
                    transform="translate(-1, -1)"
                  /> */}
                </Hexagon>
                {/* {ship.travels.map((travel) => (
                  <Path
                    key={`travel-${travel.from.q}-${travel.from.r}-${travel.to.q}-${travel.to.r}`}
                    start={travel.from}
                    end={travel.to}
                    className="travel-path killed"
                  />
                ))}

                {ship.shots.map((shot) => (
                  <Path
                    key={`travel-${shot.from.q}-${shot.from.r}-${shot.to.q}-${shot.to.r}`}
                    start={shot.from}
                    end={shot.to}
                    className="shot-path"
                  />
                ))} */}
              </Fragment>
              })}
        </g>

        {/* paths */}
      </Layout>
    </HexGrid>
  );
}
