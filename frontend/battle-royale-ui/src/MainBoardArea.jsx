import { Grid } from "@mui/material";
import Board from "./Board";
import { useRef } from "react";

export default function MainBoardArea({design, center, cells, ships, myShip, travelEndpoint, setTravelEndpoint, shotEndpoint, setShotEndpoint, ...props}) {

    const parentRef = useRef();

  return (
    <Grid item xs={6} ref={parentRef} >
      <Board
        design={design}
        center={center}
        cells={cells}
        ships={ships}
        myShip={myShip}
        travelEndpoint={travelEndpoint}
        setTravelEndpoint={setTravelEndpoint}
        shotEndpoint={shotEndpoint}
        setShotEndpoint={setShotEndpoint}
        parentRef={parentRef}
      />
    </Grid>
  );
}
