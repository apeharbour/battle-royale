import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import FetchNFT from "./FetchNFT";

export default function Cov() {
  const { gameId } = useParams();

  return (
    <Grid container spacing={2} mt={2}>
      <Grid item size={12}>
        <Typography
          sx={{ fontSize: "1.25rem", fontWeight: "600", textAlign: "center" }}
        >
          Canvas Of Victory for Game #{gameId}
        </Typography>
      </Grid>
      <Grid item size={12}>
      <FetchNFT tokenId={2} />
      </Grid>
    </Grid>
  );
}
