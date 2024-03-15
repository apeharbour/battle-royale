import { useEffect, useState } from "react";
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
      setHexGridSize(Math.min(dimensions.width, dimensions.height));
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

  return (
    <HexGrid width={hexGridSize} height={hexGridSize}>
      <Layout
        size={hexagonSize}
        spacing={1.02}
        flat={false}
        origin={{ x: shift.x * -1, y: shift.y * -1 }}
      >
        {/* cells */}
        {cells.map(({ id, q, r, s, state, neighborCode }) => (
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
            {/* <Coordinates q={q} r={r} /> */}
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
          <Ship ship={ship} size={hexagonSize} key={index} />
        ))}

        <ShipPath
          start={myShip}
          end={tempTravelEndpoint}
          ship={myShip && myShip.image ? myShip.image : ""}
        />
        <ShootPath
          start={tempTravelEndpoint}
          end={tempShotEndpoint}
        />
      </Layout>
    </HexGrid>
  );
}
