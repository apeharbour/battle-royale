import { Grid } from "@mui/material";
import Board from "./Board";
import { useRef } from "react";

export default function MainBoardArea({center, cells, ships, myShip, endpoints, setEndpoints, showCoordinateField, tempTravelEndpoint, setTempTravelEndpoint, tempShotEndpoint, setTempShotEndpoint, round, gameState, deadPlayers}) {

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
        tempTravelEndpoint={tempTravelEndpoint}
        setTempTravelEndpoint={setTempTravelEndpoint}
        tempShotEndpoint={tempShotEndpoint}
        setTempShotEndpoint={setTempShotEndpoint}
        round={round}
        gameState={gameState}
        deadPlayers={deadPlayers}
      />
    </Grid>
  );
}
