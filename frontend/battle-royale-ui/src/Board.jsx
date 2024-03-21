import React, { useEffect, useState } from "react";
import {
  Hex,
  HexGrid,
  HexUtils,
  Hexagon,
  Layout,
  Path,
  Pattern,
} from "react-hexgrid";
import ShipPath from "./ShipPath.jsx";

import * as images from "./assets/tiles/clean/index.js";
// import * as imagesPixel from "./assets/tiles/pixel/index.js";

import Coordinates from "./Coordinates.jsx";
import Ship from "./Ship.jsx";
import ShootPath from "./ShootPath.jsx";
import useResizeObserver from "./utils/useResizeObserver.jsx";
import Point from "react-hexgrid/lib/models/Point.js";
import { Tooltip } from "@mui/material";

const hexagonSize = { x: 5, y: 5 };
const waterSize = { x: 4.33, y: 5 };
const islandSize = { x: 4.33, y: 5 };

const TRAVELLING = 0;
const SHOOTING = 1;
const DONE = 2;

export default function Board({
  center,
  cells,
  ships,
  myShip,
  travelEndpoint,
  setTravelEndpoint,
  shotEndpoint,
  setShotEndpoint,
  parentRef,
}) {
  const [state, setState] = useState(TRAVELLING);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [tempTravelEndpoint, setTempTravelEndpoint] = useState(undefined);
  const [tempShotEndpoint, setTempShotEndpoint] = useState(undefined);
  const [shipPathLength, setShipPathLength] = useState(0);
  const [shootPathLength, setShootPathLength] = useState(0);

  const dimensions = useResizeObserver(parentRef);
  const [hexGridSize, setHexGridSize] = useState(500);

  // const images = design === 0 ? imagesClean : imagesPixel;

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
        if (isHighlighted(cell)) {
          if (state === TRAVELLING) {
            setTempTravelEndpoint(cell);
          } else if (state === SHOOTING) {
            setTempShotEndpoint(cell);
          }
        }
      }
    });
  };

  /* handleMouseClick only sets the travelEndpoint and shotEndpoint
   * a separate useEffect block updates the state of the board 
   * based on the state of travelEndpoint and shotEndpoint */
  const handleMouseClick = (event, source) => {
    const selectedCell = cells.filter((c) =>
      HexUtils.equals(source.state.hex, c)
    )[0];

    if (state === DONE) {
      setTravelEndpoint(undefined);
      setShotEndpoint(undefined);
    } else if (state === TRAVELLING && isHighlighted(selectedCell)) {
      setTravelEndpoint(selectedCell);
    } else if (state === SHOOTING && isHighlighted(selectedCell)) {
      setShotEndpoint(selectedCell);
    }
  };


  /* track the parents dimensions */
  useEffect(() => {
    if (dimensions) {
      console.log(dimensions.width, dimensions.height, window.visualViewport.height, window.visualViewport.width, "dimensions:", Math.min(dimensions.width, dimensions.height, window.visualViewport.height, window.visualViewport.width));
      // setHexGridSize(Math.min(dimensions.width, dimensions.height, window.visualViewport.height, window.visualViewport.width));
      setHexGridSize(Math.min(dimensions.width, window.visualViewport.height, window.visualViewport.width));
    }
  }, [dimensions]);

  /* update state based on the state of travelEndpoint and shotEndpoint */
  useEffect(() => {
    if (!!travelEndpoint && !!shotEndpoint) {
      // SHOOTING -> DONE
      setState(DONE);
      clearHighlights();
    } else if (!travelEndpoint) {
      // DONE -> TRAVELLING
      setState(TRAVELLING);
      clearHighlights();
      setTempTravelEndpoint(undefined);
      setTempShotEndpoint(undefined);
      const highlights = cells.filter((cell) =>
        isReachable(cell, myShip, myShip.range)
      );
      setHighlightedCells([...highlights]);

    } else if (!!travelEndpoint && !shotEndpoint) {
      // TRAVELLING -> SHOOTING
      clearHighlights();
      const highlights = cells.filter((cell) =>
        isReachable(cell, travelEndpoint, myShip.shotRange)
      );
      setHighlightedCells([...highlights]);

      setState(SHOOTING);
    }
  }, [travelEndpoint, shotEndpoint]);

  // update ship path length
  useEffect(() => {
    if (myShip && tempTravelEndpoint) {
      const newLength = HexUtils.distance(myShip, tempTravelEndpoint) * lengthOneHex;
      setShipPathLength(newLength);
    }
  }, [myShip, tempTravelEndpoint]);

  // update shoot path length
  useEffect(() => {
    if (tempTravelEndpoint && tempShotEndpoint) {
      const newLength = HexUtils.distance(tempTravelEndpoint, tempShotEndpoint) * lengthOneHex;
      setShootPathLength(newLength);
    }
  }, [tempTravelEndpoint, tempShotEndpoint]);

  const clearHighlights = () => {
    setHighlightedCells([]);
  };

  const isReachable = (destination, origin, distance) => {
    if (
      HexUtils.equals(origin, destination) ||
      ((origin.q === destination.q ||
        origin.r === destination.r ||
        origin.s === destination.s) &&
        HexUtils.distance(destination, origin) <= distance)
    ) {
      return true;
    }
    return false;
  };

  const isHighlighted = (cell) => {
    return highlightedCells.some((c) => HexUtils.equals(c, cell));
  };

  useEffect(() => {
    if (cells.length > 0) {
      const highlights = cells.filter((cell) =>
        isReachable(cell, myShip, myShip.range)
      );
      setHighlightedCells([...highlights]);
    }
  }, [myShip, cells]);

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
        animation: move-${ship.address} 2s ease-in-out; 
      }`
      const keyFrames = `@keyframes move-${ship.address} { 
        from { transform: translate(${origin.x}px, ${origin.y}px); } 
        to { transform: translate(${destination.x}px, ${destination.y}px); } 
      }`;
      return [styles, keyFrames].join("\n");
    } else {
      return `.ship-${ship.address}: { animation: none; }`;
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
        animation: shot-${ship.address} 2s ease-in-out;
        animation-delay: 2s;
      }`
      const keyFrames = `@keyframes shot-${ship.address} { 
        0% {  transform: translate(${origin.x}px, ${origin.y}px); }
        80% { opacity: 1; }
        70% { opacity: 1; }
        100% { transform: translate(${destination.x}px, ${destination.y}px); } 
      }`;
      return [styles, keyFrames].join(" ");
    } else {
      return `.ship-${ship.address}: { animation: none; }`;
    }
  }).join(" ");

  return (
    <HexGrid width={hexGridSize} height={hexGridSize}>
            <style>
        {`
          ${shipStyles}
          ${canonStyles}
          .ship-path {
            animation: shippathdraw 3s linear forwards infinite;
            stroke: lightgray;
            stroke-width: 0.5;
            stroke-linecap: round;
            stroke-dashoffset: ${shipPathLength};
            stroke-dasharray: ${shipPathLength};
          }

          .shoot-path {
            animation: shippathdraw 3s linear forwards infinite;
            stroke: red;
            stroke-width: 0.5;
            stroke-linecap: round;
            stroke-dashoffset: ${shootPathLength};
            stroke-dasharray: ${shootPathLength};
          }

          .explosion {
            animation: explode 0.5s ease-in forwards;
            animation-delay: 3.5s;
            stroke-linejoin: round;
            stroke-linecap: round;
            stroke-width: 0.1;
            stroke: black;
            fill: yellow;
            transform: scale(0.5);
            opacity: 0;
          }

          .deleted {
            animation: fade-out 3s ease-in forwards;
          }

          @keyframes explode {
            0% {
              transform: scale(0.1);
              opacity: 0;
            }
            50% {
              transform: scale(0.75);
              opacity: 1;
            }
            100% {
              transform: scale(0.75);
              opacity: 0;
            }
          }

          @keyframes shippathdraw {
            to {
              stroke-dashoffset: 0;
            }
          }
          
          @keyframes fade-out {
            0% {
              opacity: 1;
            }
          
            100% {
              opacity: 0;
            }
          }
        `}
      </style>

      <Layout
        size={hexagonSize}
        spacing={1.02}
        flat={false}
        origin={shift}
      >
        {/* cells */}
        {cells.filter(c => !c.deletedPreviously && !c.deletedThisRound).map(({ id, q, r, s, state, deleted, neighborCode }) => (
          <Hexagon
            className={[
              state,
              isHighlighted(new Hex(q, r, s)) ? "highlighted" : "",
            ].join(" ")}
            key={id}
            q={q}
            r={r}
            s={s}
            onMouseEnter={handleMouseEnter}
            onClick={handleMouseClick}
            fill={getFillPattern(state, neighborCode)}
            // onMouseLeave={handleMouseLeave}
          >
            <Coordinates q={q} r={r} />
          </Hexagon>
        ))}

        {/* deleted cells */}
        {cells.filter(c => c.deletedThisRound ).map(({ id, q, r, s }) => (
          <Hexagon
          className={[
            state,
            "deleted"].join(" ")}
            key={id}
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
            <Ship ship={ship} size={hexagonSize} key={index} />
          </React.Fragment>
        ))}

        <ShipPath
          start={myShip}
          end={tempTravelEndpoint}
          ship={myShip && myShip.image ? myShip.image : "" }
          updateShipPath={setShipPathLength}
        />
        <ShootPath
          start={tempTravelEndpoint}
          end={tempShotEndpoint}
          updateShotPath={setShootPathLength}
        />
      </Layout>
    </HexGrid>
  );
}
