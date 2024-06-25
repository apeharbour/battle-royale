import React, { useEffect, useState } from "react";
import {
  Hex,
  HexGrid,
  HexUtils,
  Hexagon,
  Layout,
  Pattern,
} from "react-hexgrid";
import ShipPath from "./ShipPath.jsx";
import * as images from "./assets/tiles/clean/index.js";
import Coordinates from "./Coordinates.jsx";
import Ship from "./Ship.jsx";
import ShootPath from "./ShootPath.jsx";
import useResizeObserver from "./utils/useResizeObserver.jsx";
import { Tooltip } from "@mui/material";
import './animations.css'; // Import the CSS file

const TRAVELLING = 0;
const SHOOTING = 1;
const DONE = 2;
const MAX_RADIUS = 9;

const isReachable = (destination, origin, distance) => {
  const originHex = new Hex(origin.q, origin.r, origin.r * -1 - origin.q);
  const destinationHex = new Hex(destination.q, destination.r, destination.r * -1 - destination.q);
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

const isHighlighted = (cell, highlights) => {
  return highlights.some((c) => HexUtils.equals(c, cell));
};

export default function Board({
  center,
  cells,
  ships,
  myShip,
  endpoints,
  setEndpoints,
  parentRef,
}) {
  const [tempTravelEndpoint, setTempTravelEndpoint] = useState(undefined);
  const [tempShotEndpoint, setTempShotEndpoint] = useState(undefined);
  const [shipPathLength, setShipPathLength] = useState(0);
  const [shootPathLength, setShootPathLength] = useState(0);
  const [hexGridSize, setHexGridSize] = useState(200);
  const [animationClass, setAnimationClass] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  const calcSize = ({ x, y }, radius, maxRadius) => {
    const factor = 0.9;
    return { x: -1 * factor * x * radius + maxRadius, y: -1 * factor * y * radius + maxRadius };
  }

  const hexagonSize = calcSize({ x: 1, y: 1 }, center.q, MAX_RADIUS);
  const islandSize = { x: hexagonSize.x * 0.866, y: hexagonSize.y * 1 };
  const waterSize = islandSize;

  const dimensions = useResizeObserver(parentRef);
  const state = !endpoints.travel ? TRAVELLING : !endpoints.shot ? SHOOTING : DONE;
  const highlights = !!myShip ? cells.filter((cell) => !endpoints.travel ? isReachable(cell, myShip, myShip.range) : !endpoints.shot ? isReachable(cell, endpoints.travel, myShip.shotRange) : false) : [];

  const getFillPattern = (state, neighborCode) => {
    if (state === "island") {
      return `pat-island${neighborCode % 15}`;
    } else {
      return `pat-water${neighborCode}`;
    }
  };

  const handleMouseEnter = (event, source) => {
    cells.forEach((cell) => {
      if (HexUtils.equals(source.state.hex, cell)) {
        if (isHighlighted(cell, highlights)) {
          if (state === TRAVELLING) {
            setTempTravelEndpoint(cell);
          } else if (state === SHOOTING) {
            setTempShotEndpoint(cell);
          }
        }
      }
    });
  };

  const handleMouseClick = (event, source) => {
    const selectedCell = cells.filter((c) =>
      HexUtils.equals(source.state.hex, new Hex(c.q, c.r, c.q * -1 - c.r))
    )[0];

    if (state === DONE) {
      setEndpoints({ shot: undefined, travel: undefined });
      setTempShotEndpoint(undefined);
      setTempTravelEndpoint(undefined);
    } else if (state === TRAVELLING && isHighlighted(selectedCell, highlights)) {
      setEndpoints({ shot: endpoints.shot, travel: selectedCell });
    } else if (state === SHOOTING && isHighlighted(selectedCell, highlights)) {
      setEndpoints({ shot: selectedCell, travel: endpoints.travel });
    }
  };

  useEffect(() => {
    if (dimensions) {
      setHexGridSize(Math.min(dimensions.width, window.visualViewport.height, window.visualViewport.width));
    }
  }, [dimensions]);

  useEffect(() => {
    if (myShip && tempTravelEndpoint) {
      const { q, r } = tempTravelEndpoint;
      const endPtHex = new Hex(q, r, q * -1 - r);
      const myShipHex = new Hex(myShip.q, myShip.r, myShip.q * -1 - myShip.r);
      const newLength = HexUtils.distance(myShipHex, endPtHex) * lengthOneHex;
      setShipPathLength(newLength);
    }
  }, [tempTravelEndpoint]);

  useEffect(() => {
    if (tempTravelEndpoint && tempShotEndpoint) {
      const newLength = HexUtils.distance(tempTravelEndpoint, tempShotEndpoint) * lengthOneHex;
      setShootPathLength(newLength);
    }
  }, [tempTravelEndpoint, tempShotEndpoint]);

  useEffect(() => {
    // Trigger animation class toggle
    setAnimationClass('animation-trigger');
    const timer = setTimeout(() => {
      setAnimationClass(''); // Remove the class after animation ends
    }, 3000); // Set this to the duration of your longest animation

    return () => clearTimeout(timer);
  }, [endpoints]);

  const layout = new Layout({
    size: hexagonSize,
    spacing: 1.02,
    flat: false,
    origin: { x: 0, y: 0 },
  });
  const shift = HexUtils.hexToPixel(center, layout.props.value.layout);
  shift.x *= -1;
  shift.y *= -1;

  const lengthOneHex = HexUtils.hexToPixel(new Hex(1, 0, -1), layout.props.value.layout).x;

  const shipStyles = ships.map((ship) => {
    if (ship.travel.origin && ship.travel.destination) {
      const origin = HexUtils.hexToPixel(ship.travel.origin, layout.props.value.layout);
      const destination = HexUtils.hexToPixel(ship.travel.destination, layout.props.value.layout);
      origin.x += shift.x;
      origin.y += shift.y;
      destination.x += shift.x;
      destination.y += shift.y;

      const styles = `.ship-${ship.address} { 
        animation: move-${ship.address} 2s ease-in-out forwards; 
        animation-iteration-count: 1; /* Play the animation once */
      }`
      const keyFrames = `@keyframes move-${ship.address} { 
        from { transform: translate(${origin.x}px, ${origin.y}px); } 
        to { transform: translate(${destination.x}px, ${destination.y}px); } 
      }`;
      return [styles, keyFrames].join("\n");
    } else {
      return `.ship-${ship.address} { animation: none; }`;
    }
  }).join("\n");

  const canonStyles = ships.map((ship) => {
    if (ship.shot.origin && ship.shot.destination) {
      const origin = HexUtils.hexToPixel(ship.shot.origin, layout.props.value.layout);
      const destination = HexUtils.hexToPixel(ship.shot.destination, layout.props.value.layout);
      origin.x += shift.x;
      origin.y += shift.y;
      destination.x += shift.x;
      destination.y += shift.y;

      const styles = `.canon-${ship.address} { 
        opacity: 0;
        animation: shot-${ship.address} 2s ease-in-out forwards;
        animation-delay: 2s;
        animation-iteration-count: 1; /* Play the animation once */
      }`
      const keyFrames = `@keyframes shot-${ship.address} { 
        0% {  transform: translate(${origin.x}px, ${origin.y}px); }
        80% { opacity: 1; }
        70% { opacity: 1; }
        100% { transform: translate(${destination.x}px, ${destination.y}px); } 
      }`;
      return [styles, keyFrames].join(" ");
    } else {
      return `.ship-${ship.address} { animation: none; }`;
    }
  }).join(" ");

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `${shipStyles} ${canonStyles}`;
    document.head.appendChild(styleSheet);

    // Force re-render by changing animationKey
    setAnimationKey(prev => prev + 1);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [myShip]);

  return (
    <HexGrid key={animationKey} width={hexGridSize} height={hexGridSize} 
      style={{
        "--ship-path-dasharray": shipPathLength,
        "--ship-path-dashoffset": shipPathLength,
        "--ship-path-dashoffset-reverse": -shipPathLength,
        "--shoot-path-dasharray": shootPathLength,
        "--shoot-path-dashoffset": shootPathLength,
        "--shoot-path-dashoffset-reverse": -shootPathLength
      }}>
      <Layout
        size={hexagonSize}
        spacing={1.02}
        flat={false}
        origin={shift}
      >
        {/* cells */}
        {cells.filter(c => !c.deletedPreviously && !c.deletedThisRound).map(({ q, r, s, state, deleted, neighborCode }) => (
          <Hexagon
            className={[
              state,
              isHighlighted(new Hex(q, r, s), highlights) ? "highlighted" : "",
              animationClass
            ].join(" ")}
            key={`hex-active-${q}-${r}`}
            q={q}
            r={r}
            s={s}
            onMouseEnter={handleMouseEnter}
            onClick={handleMouseClick}
            fill={getFillPattern(state, neighborCode)}
          >
          </Hexagon>
        ))}

        {/* deleted cells */}
        {cells.filter(c => c.deletedThisRound).map(({ q, r, s }) => (
          <Hexagon
            className={[
              state,
              "deleted",
              animationClass
            ].join(" ")}
            key={`hex-deleted-${q}-${r}`}
            q={q}
            r={r}
            s={s}
            fill="pat-water0"
          >
          </Hexagon>
        ))}

        {/* patterns */}
        {[...Array(64).keys()].map((i) => (
          <Pattern
            id={`pat-water${i}`}
            link={images[`water${i}`]}
            size={waterSize}
            key={`pat-w-${i}`}
          />
        ))}

        {[...Array(15).keys()].map((i) => (
          <Pattern
            id={`pat-island${i}`}
            link={images[`island${i}`]}
            size={islandSize}
            key={`pat-i-${i}`}
          />
        ))}

        {ships.map((ship, index) => (
          <React.Fragment key={index}>
            <Ship ship={ship} size={hexagonSize} className={`ship-${ship.address} ${animationClass}`} />
          </React.Fragment>
        ))}

        {myShip &&
          <ShipPath
            start={new Hex(myShip.q, myShip.r, myShip.r * -1 - myShip.q)}
            end={tempTravelEndpoint}
            ship={myShip && myShip.image ? myShip.image : ""}
            updateShipPath={setShipPathLength}
            size={hexagonSize}
            className={`ship-path ${animationClass}`}
          />
        }

        <ShootPath
          start={tempTravelEndpoint}
          end={tempShotEndpoint}
          updateShotPath={setShootPathLength}
          className={`shoot-path ${animationClass}`}
        />
      </Layout>
    </HexGrid>
  );
}
