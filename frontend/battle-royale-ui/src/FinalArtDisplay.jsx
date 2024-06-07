import { Box, Container, Grid } from "@mui/material";
import Board from "./Board";
import { useRef } from "react";
import FinalArtSvg from "./FinalArtSvg";

export default function FinalArtDisplay({center, cells, ships, gameId, ...props}) {

    const parentRef = useRef();

    console.log("FinalArtDisplay", center, cells, gameId);

  return (
    <Box ref={parentRef} >
      <FinalArtSvg
        center={center}
        cells={cells}
        gameId={gameId}
        ships={ships}
        parentRef={parentRef}
      />
    </Box>
  );
}
