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

import * as imagesClean from "./assets/tiles/clean/index.js";
import * as imagesPixel from "./assets/tiles/pixel/index.js";

import Coordinates from "./Coordinates.jsx";
import Ship from "./Ship.jsx";
import ShootPath from "./ShootPath.jsx";

const hexagonSize = { x: 5, y: 5 };
const waterSize = { x: 4.33, y: 5 };
const islandSize = { x: 4.33, y: 5 };

const TRAVELLING = 0;
const SHOOTING = 1;
const DONE = 2;

export default function Board({
  design,
  center,
  cells,
  ships,
  myShip,
  setCanSubmit,
}) {
  const [travelEndpoint, setTravelEndpoint] = useState(undefined);
  const [shotEndpoint, setShotEndpoint] = useState(undefined);
  const [state, setState] = useState(TRAVELLING);
  const [highlightedCells, setHighlightedCells] = useState([]);

  const images = design === 0 ? imagesClean : imagesPixel;

  const determineDirection = (deltaQ, deltaR) => {
    // Normalize the deltas to -1, 0, or 1
    const sign = (num) => (num === 0 ? 0 : num > 0 ? 1 : -1);
    const normDeltaQ = sign(deltaQ);
    const normDeltaR = sign(deltaR);

    if (normDeltaQ === 1 && normDeltaR === 0) return 0;
    if (normDeltaQ === 1 && normDeltaR === -1) return 1;
    if (normDeltaQ === 0 && normDeltaR === -1) return 2;
    if (normDeltaQ === -1 && normDeltaR === 0) return 3;
    if (normDeltaQ === -1 && normDeltaR === 1) return 4;
    if (normDeltaQ === 0 && normDeltaR === 1) return 5;
    return 6;
  };

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
            setTravelEndpoint(cell);
          } else if (state === SHOOTING) {
            setShotEndpoint(cell);
          }
        }
      }
    });
  };

  const handleMouseClick = (event, source) => {
    const selectedCell = cells.filter((c) =>
      HexUtils.equals(source.state.hex, c)
    )[0];

    if (state === DONE) {
      clearHighlights();
      const highlights = cells.filter((cell) =>
        isReachable(cell, myShip, myShip.range)
      );
      setHighlightedCells([...highlights]);

      setTravelEndpoint(undefined);
      setShotEndpoint(undefined);
      setState(TRAVELLING);
      setCanSubmit(false);
    } else if (state === TRAVELLING && isHighlighted(selectedCell)) {
      console.log(
        `Selected cell (${selectedCell.q},${selectedCell.r}) is highlighted`
      );
      clearHighlights();
      const highlights = cells.filter((cell) =>
        isReachable(cell, selectedCell, myShip.shotRange)
      );
      setHighlightedCells([...highlights]);
      setTravelEndpoint(selectedCell);
      setState(SHOOTING);
      setCanSubmit(false);
    } else if (state === SHOOTING && isHighlighted(selectedCell)) {
      clearHighlights();
      setShotEndpoint(selectedCell);
      setState(DONE);
      setCanSubmit(true);
    }
  };

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
    <HexGrid width={500} height={500}>
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
          end={travelEndpoint}
          ship={myShip && myShip.image ? myShip.image : ""}
        />
        <ShootPath
          start={travelEndpoint}
          end={shotEndpoint}
        />
      </Layout>
    </HexGrid>
  );
}
