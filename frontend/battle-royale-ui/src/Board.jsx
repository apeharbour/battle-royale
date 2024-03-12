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

import * as imagesClean from "./assets/tiles/clean/index.js";
import * as imagesPixel from "./assets/tiles/pixel/index.js";

import island99 from "./assets/tiles/clean/island99.png";
import Coordinates from "./Coordinates.jsx";
import Ship from "./Ship.jsx";

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
      // return `pat-island99`;
    } else {
      return `pat-water${neighborCode}`;
    }
  };

  const handleMouseEnter = (event, source) => {
    cells.forEach((cell) => {
      if (HexUtils.equals(source.state.hex, cell)) {
        // cell.highlighted = true;
        if (cell.highlighted) {
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
    // console.log(("Mouse click", source))
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
    // const cell = new Hex(q, r, s);
    console.log("Checking if cell is highlighted", cell);
    console.log("Highlighted cells", highlightedCells);
    return highlightedCells.some((c) => HexUtils.equals(c, cell));
  };

  useEffect(() => {
    console.log("Updating highlighted cells");
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
      <defs>
        <marker
          id="arrowheadMove"
          markerWidth="4"
          markerHeight="4"
          refX="2"
          refY="2"
          orient="auto"
        >
          <polyline
            points="0 0, 2 2, 0 4"
            fill="none"
            strokeWidth={1}
            stroke="lightgray"
          />
        </marker>
        <marker
          id="arrowheadShoot"
          markerWidth="4"
          markerHeight="4"
          refX="2"
          refY="2"
          orient="auto"
        >
          <polyline
            points="0 0, 2 2, 0 4"
            fill="none"
            strokeWidth={1}
            stroke="lightgray"
          />
        </marker>
      </defs>
      <rect
        width="100%"
        height="100%"
        stroke="green"
        strokeWidth="0.1"
        fill="none"
      />
      <Layout
        size={hexagonSize}
        spacing={1.02}
        flat={false}
        origin={{ x: shift.x * -1, y: shift.y * -1 }}
      >
        {/* cells */}
        {cells.map(({ id, q, r, s, state, highlighted, neighborCode }) => (
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

        <Pattern id="pat-water0" link={images["water0"]} size={waterSize} />
        <Pattern id="pat-water1" link={images["water1"]} size={waterSize} />
        <Pattern id="pat-water2" link={images["water2"]} size={waterSize} />
        <Pattern id="pat-water3" link={images["water3"]} size={waterSize} />
        <Pattern id="pat-water4" link={images["water4"]} size={waterSize} />
        <Pattern id="pat-water5" link={images["water5"]} size={waterSize} />
        <Pattern id="pat-water6" link={images["water6"]} size={waterSize} />
        <Pattern id="pat-water7" link={images["water7"]} size={waterSize} />
        <Pattern id="pat-water8" link={images["water8"]} size={waterSize} />
        <Pattern id="pat-water9" link={images["water9"]} size={waterSize} />
        <Pattern id="pat-water10" link={images["water10"]} size={waterSize} />
        <Pattern id="pat-water11" link={images["water11"]} size={waterSize} />
        <Pattern id="pat-water12" link={images["water12"]} size={waterSize} />
        <Pattern id="pat-water13" link={images["water13"]} size={waterSize} />
        <Pattern id="pat-water14" link={images["water14"]} size={waterSize} />
        <Pattern id="pat-water15" link={images["water15"]} size={waterSize} />
        <Pattern id="pat-water16" link={images["water16"]} size={waterSize} />
        <Pattern id="pat-water17" link={images["water17"]} size={waterSize} />
        <Pattern id="pat-water18" link={images["water18"]} size={waterSize} />
        <Pattern id="pat-water19" link={images["water19"]} size={waterSize} />
        <Pattern id="pat-water20" link={images["water20"]} size={waterSize} />
        <Pattern id="pat-water21" link={images["water21"]} size={waterSize} />
        <Pattern id="pat-water22" link={images["water22"]} size={waterSize} />
        <Pattern id="pat-water23" link={images["water23"]} size={waterSize} />
        <Pattern id="pat-water24" link={images["water24"]} size={waterSize} />
        <Pattern id="pat-water25" link={images["water25"]} size={waterSize} />
        <Pattern id="pat-water26" link={images["water26"]} size={waterSize} />
        <Pattern id="pat-water27" link={images["water27"]} size={waterSize} />
        <Pattern id="pat-water28" link={images["water28"]} size={waterSize} />
        <Pattern id="pat-water29" link={images["water29"]} size={waterSize} />
        <Pattern id="pat-water30" link={images["water30"]} size={waterSize} />
        <Pattern id="pat-water31" link={images["water31"]} size={waterSize} />
        <Pattern id="pat-water32" link={images["water32"]} size={waterSize} />
        <Pattern id="pat-water33" link={images["water33"]} size={waterSize} />
        <Pattern id="pat-water34" link={images["water34"]} size={waterSize} />
        <Pattern id="pat-water35" link={images["water35"]} size={waterSize} />
        <Pattern id="pat-water36" link={images["water36"]} size={waterSize} />
        <Pattern id="pat-water37" link={images["water37"]} size={waterSize} />
        <Pattern id="pat-water38" link={images["water38"]} size={waterSize} />
        <Pattern id="pat-water39" link={images["water39"]} size={waterSize} />
        <Pattern id="pat-water40" link={images["water40"]} size={waterSize} />
        <Pattern id="pat-water41" link={images["water41"]} size={waterSize} />
        <Pattern id="pat-water42" link={images["water42"]} size={waterSize} />
        <Pattern id="pat-water43" link={images["water43"]} size={waterSize} />
        <Pattern id="pat-water44" link={images["water44"]} size={waterSize} />
        <Pattern id="pat-water45" link={images["water45"]} size={waterSize} />
        <Pattern id="pat-water46" link={images["water46"]} size={waterSize} />
        <Pattern id="pat-water47" link={images["water47"]} size={waterSize} />
        <Pattern id="pat-water48" link={images["water48"]} size={waterSize} />
        <Pattern id="pat-water49" link={images["water49"]} size={waterSize} />
        <Pattern id="pat-water50" link={images["water50"]} size={waterSize} />
        <Pattern id="pat-water51" link={images["water51"]} size={waterSize} />
        <Pattern id="pat-water52" link={images["water52"]} size={waterSize} />
        <Pattern id="pat-water53" link={images["water53"]} size={waterSize} />
        <Pattern id="pat-water54" link={images["water54"]} size={waterSize} />
        <Pattern id="pat-water55" link={images["water55"]} size={waterSize} />
        <Pattern id="pat-water56" link={images["water56"]} size={waterSize} />
        <Pattern id="pat-water57" link={images["water57"]} size={waterSize} />
        <Pattern id="pat-water58" link={images["water58"]} size={waterSize} />
        <Pattern id="pat-water59" link={images["water59"]} size={waterSize} />
        <Pattern id="pat-water60" link={images["water60"]} size={waterSize} />
        <Pattern id="pat-water61" link={images["water61"]} size={waterSize} />
        <Pattern id="pat-water62" link={images["water62"]} size={waterSize} />
        <Pattern id="pat-water63" link={images["water63"]} size={waterSize} />
        <Pattern id="pat-water64" link={images["water64"]} size={waterSize} />

        <Pattern id="pat-island0" link={images["island0"]} size={islandSize} />
        <Pattern id="pat-island1" link={images["island1"]} size={islandSize} />
        <Pattern id="pat-island2" link={images["island2"]} size={islandSize} />
        <Pattern id="pat-island3" link={images["island3"]} size={islandSize} />
        <Pattern id="pat-island4" link={images["island4"]} size={islandSize} />
        <Pattern id="pat-island5" link={images["island5"]} size={islandSize} />
        <Pattern id="pat-island6" link={images["island6"]} size={islandSize} />
        <Pattern id="pat-island7" link={images["island7"]} size={islandSize} />
        <Pattern id="pat-island8" link={images["island8"]} size={islandSize} />
        <Pattern id="pat-island9" link={images["island9"]} size={islandSize} />
        <Pattern
          id="pat-island10"
          link={images["island10"]}
          size={islandSize}
        />
        <Pattern
          id="pat-island11"
          link={images["island11"]}
          size={islandSize}
        />
        <Pattern
          id="pat-island12"
          link={images["island12"]}
          size={islandSize}
        />
        <Pattern
          id="pat-island13"
          link={images["island13"]}
          size={islandSize}
        />
        <Pattern
          id="pat-island14"
          link={images["island14"]}
          size={islandSize}
        />

        <Pattern id="pat-island99" link={island99} size={waterSize} />

        {ships.map((ship, index) => (
          <Ship ship={ship} size={hexagonSize} key={index} />
        ))}

        <Path
          start={myShip}
          end={travelEndpoint}
          markerEnd="url(#arrowheadMove)"
        />
        <Path
          start={travelEndpoint}
          end={shotEndpoint}
          markerEnd="url(#arrowheadShoot)"
          strokeDasharray="1 2"
        />
      </Layout>
    </HexGrid>
  );
}
