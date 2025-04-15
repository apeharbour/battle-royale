import { Grid } from "@mui/material";
import SpectateBoard from "./SpectateBoard";
import { useRef } from "react";

export default function SpectateMainBoard({center, cells, ships, myShip, endpoints, setEndpoints, showCoordinateField, tempTravelEndpoint, setTempTravelEndpoint, tempShotEndpoint, setTempShotEndpoint, round, gameState, deadPlayers}) {

    const parentRef = useRef();

  return (
    <Grid item xs={12} sm={4} md={8} ref={parentRef} >
      <SpectateBoard
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
