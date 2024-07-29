import { Grid } from "@mui/material";
import Board from "./Board";
import { useRef } from "react";

export default function MainBoardArea({center, cells, ships, myShip, endpoints, setEndpoints, showCoordinateField, ...props}) {

    const parentRef = useRef();

  return (
    <Grid item xs={12} sm={4} md={8} ref={parentRef} >
      <Board
        center={center}
        cells={cells}
        ships={ships}
        myShip={myShip}
        endpoints={endpoints}
        setEndpoints={setEndpoints}
        parentRef={parentRef}
        showCoordinateField={showCoordinateField}
      />
    </Grid>
  );
}
