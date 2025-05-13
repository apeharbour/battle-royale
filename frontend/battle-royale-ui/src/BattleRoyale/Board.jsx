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
import * as images from "../assets/tiles/clean/index.js";
import { useSnackbar } from "notistack";
import Ship from "./Ship.jsx";
import ShootPath from "./ShootPath.jsx";
import useResizeObserver from "../utils/useResizeObserver.jsx";
import "./animations.css"; // Import the CSS file

const TRAVELLING = 0;
const SHOOTING = 1;
const DONE = 2;
const MAX_RADIUS = 9;

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
  showCoordinateField,
  tempTravelEndpoint,
  setTempTravelEndpoint,
  tempShotEndpoint,
  setTempShotEndpoint,
  round,
  gameState,
  deadPlayers,
}) {
  const [shipPathLength, setShipPathLength] = useState(0);
  const [shootPathLength, setShootPathLength] = useState(0);
  const [hexGridSize, setHexGridSize] = useState(200);
  const [animationClass, setAnimationClass] = useState("");
  const [animationComplete, setAnimationComplete] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  // console.log("Game state: ", gameState);
  // console.log("Round: ", round);
  // console.log("Temp travel endpoint: ", tempTravelEndpoint);
  // console.log("Temp shot endpoint: ", tempShotEndpoint);
  // console.log("Endpoints: ", endpoints);
  //  console.log("Path Length: ", shipPathLength);
  //  console.log("Shoot Path Length: ", shootPathLength);
  //    console.log("ships: ", ships);

  const calcSize = ({ x, y }, radius, maxRadius) => {
    const factor = 0.9;
    return {
      x: -1 * factor * x * radius + maxRadius,
      y: -1 * factor * y * radius + maxRadius,
    };
  };

  const hexagonSize = calcSize({ x: 1, y: 1 }, center.q, MAX_RADIUS);
  const islandSize = { x: hexagonSize.x * 0.866, y: hexagonSize.y * 1 };
  const waterSize = islandSize;

  const dimensions = useResizeObserver(parentRef);
  const state = !endpoints.travel
    ? TRAVELLING
    : !endpoints.shot
    ? SHOOTING
    : DONE;
  const highlights =
    !!myShip && myShip.state === "active"
      ? cells.filter((cell) =>
          !endpoints.travel
            ? isReachable(cell, myShip, myShip.range)
            : !endpoints.shot
            ? isReachable(cell, endpoints.travel, myShip.shotRange)
            : false
        )
      : [];

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

    // Check if the cell is highlighted or if the click is within the ship/shoot path
    const isValidClick =
      isHighlighted(selectedCell, highlights) ||
      event.target.closest(".ship-path, .shoot-path");

    if (state === TRAVELLING && isValidClick) {
      setEndpoints({ shot: endpoints.shot, travel: selectedCell });
      enqueueSnackbar(
        `Travel destination set to ${selectedCell.q},${selectedCell.r}`,
        { variant: "info" }
      );
    } else if (state === SHOOTING && isValidClick) {
      setEndpoints({ shot: selectedCell, travel: endpoints.travel });
      enqueueSnackbar(
        `Shot destination set to ${selectedCell.q},${selectedCell.r}`,
        { variant: "info" }
      );
    }
  };

  function handleShipClick(event, { q, r, s }) {
    // Construct a mock source object that looks like what handleMouseClick expects
    const mockSource = {
      state: {
        hex: { q, r, s },
      },
    };
    handleMouseClick(event, mockSource); // your existing logic
  }

  const layout = new Layout({
    size: hexagonSize,
    spacing: 1.02,
    flat: false,
    origin: { x: 0, y: 0 },
  });

  const shift = HexUtils.hexToPixel(center, layout.props.value.layout);
  shift.x *= -1;
  shift.y *= -1;

  const lengthOneHex = HexUtils.hexToPixel(
    new Hex(1, 0, -1),
    layout.props.value.layout
  ).x;

  useEffect(() => {
    if (dimensions) {
      setHexGridSize(
        Math.min(
          dimensions.width,
          window.visualViewport.height,
          window.visualViewport.width
        )
      );
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
  }, [myShip, tempTravelEndpoint]);

  useEffect(() => {
    if (tempTravelEndpoint && tempShotEndpoint) {
      const newLength =
        HexUtils.distance(tempTravelEndpoint, tempShotEndpoint) * lengthOneHex;
      setShootPathLength(newLength);
    }
  }, [tempTravelEndpoint, tempShotEndpoint]);

  useEffect(() => {
    if (round === null) return;

    // Trigger the animation
    setAnimationClass("animation-trigger");
    setAnimationComplete(false);

    const timer = setTimeout(() => {
      setAnimationClass("");
      setAnimationComplete(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [round, gameState]);

  // Generate styles for ship movements and cannon shots
  useEffect(() => {
    const shipStyles = ships
      .map((ship) => {
        if (ship.travel && ship.travel.origin && ship.travel.destination) {
          const origin = HexUtils.hexToPixel(
            ship.travel.origin,
            layout.props.value.layout
          );
          const destination = HexUtils.hexToPixel(
            ship.travel.destination,
            layout.props.value.layout
          );
          origin.x += shift.x;
          origin.y += shift.y;
          destination.x += shift.x;
          destination.y += shift.y;

          const styles = `.ship-${ship.address} { 
            animation: move-${ship.address} 2s ease-in-out forwards; 
          }`;
          const keyFrames = `@keyframes move-${ship.address} { 
            from { transform: translate(${origin.x}px, ${origin.y}px); } 
            to { transform: translate(${destination.x}px, ${destination.y}px); } 
          }`;
          return [styles, keyFrames].join("\n");
        } else {
          return `.ship-${ship.address} { animation: none; }`;
        }
      })
      .join("\n");

    const canonStyles = ships
      .map((ship) => {
        if (ship.shot && ship.shot.origin && ship.shot.destination) {
          const origin = HexUtils.hexToPixel(
            ship.shot.origin,
            layout.props.value.layout
          );
          const destination = HexUtils.hexToPixel(
            ship.shot.destination,
            layout.props.value.layout
          );
          origin.x += shift.x;
          origin.y += shift.y;
          destination.x += shift.x;
          destination.y += shift.y;

          const styles = `.canon-${ship.address} { 
            opacity: 0;
            animation: shot-${ship.address} 2s ease-in-out forwards;
            animation-delay: 2s;
          }`;
          const keyFrames = `@keyframes shot-${ship.address} { 
            0% {  transform: translate(${origin.x}px, ${origin.y}px); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translate(${destination.x}px, ${destination.y}px); opacity: 0; } 
          }`;
          return [styles, keyFrames].join(" ");
        } else {
          return `.canon-${ship.address} { animation: none; }`;
        }
      })
      .join(" ");

    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `${shipStyles} ${canonStyles}`;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [ships]);

  return (
    <HexGrid
      width={hexGridSize}
      height={hexGridSize}
      style={{
        "--ship-path-dasharray": shipPathLength,
        "--ship-path-dashoffset": shipPathLength,
        "--ship-path-dashoffset-reverse": -shipPathLength,
        "--shoot-path-dasharray": shootPathLength,
        "--shoot-path-dashoffset": shootPathLength,
        "--shoot-path-dashoffset-reverse": -shootPathLength,
      }}
    >
      <Layout size={hexagonSize} spacing={1.02} flat={false} origin={shift}>
        {/* cells */}
        {cells
          .filter((c) => !c.deletedPreviously && !c.deletedThisRound)
          .map(({ q, r, s, state, neighborCode }) => (
            <Hexagon
              className={[
                state,
                isHighlighted(new Hex(q, r, s), highlights)
                  ? "highlighted"
                  : "",
                animationClass,
              ].join(" ")}
              key={`hex-active-${q}-${r}`}
              q={q}
              r={r}
              s={s}
              onMouseEnter={handleMouseEnter}
              onClick={handleMouseClick}
              fill={getFillPattern(state, neighborCode)}
            >
              {showCoordinateField && (
                <text
                  x="0"
                  y="0.3em"
                  textAnchor="middle"
                  fontSize="0.1em"
                  fill="black"
                >
                  {`${q},${r}`}
                </text>
              )}
            </Hexagon>
          ))}
        {/* deleted cells */}
        {cells
          .filter((c) => c.deletedThisRound)
          .map(({ q, r, s }) => (
            <Hexagon
              className={["water", "deleted", animationClass].join(" ")}
              key={`hex-deleted-${q}-${r}`}
              q={q}
              r={r}
              s={s}
              fill="pat-water0"
            ></Hexagon>
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

        {ships
          .filter((ship) => ship !== null)
          .map((ship, index) => (
            <Ship
              key={`${ship.address}-${round}`}
              ship={ship}
              size={hexagonSize}
              className={`ship-${ship.address} ${
                ship.state === "destroyed" ? "destroyed-ship" : animationClass
              }`}
              onShipClick={handleShipClick}
              animationRound={round > 1 ? round - 1 : round}
              deadPlayers={deadPlayers}
              currentRound={round}
            />
          ))}
        {myShip && myShip.state === "active" && (
          <>
            <ShipPath
              start={new Hex(myShip.q, myShip.r, myShip.r * -1 - myShip.q)}
              end={tempTravelEndpoint}
              ship={myShip && myShip.image ? myShip.image : ""}
              updateShipPath={setShipPathLength}
              size={hexagonSize}
              className={`ship-path ${animationClass}`}
            />
            <ShootPath
              start={tempTravelEndpoint}
              end={tempShotEndpoint}
              updateShotPath={setShootPathLength}
              className={`shoot-path ${animationClass}`}
            />
          </>
        )}
      </Layout>
    </HexGrid>
  );
}