import { Fragment } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import FetchNFT from "./FetchNFT";
import { useAccount } from "wagmi";
import NotConnected from "./NotConnected";

export default function Cov() {
  const { gameId } = useParams();
  const account = useAccount();

  return (
    <Fragment>
      {account?.address ? (
        <Grid container spacing={2} mt={2}>
          <Grid item size={12}>
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              canvas of victory #{gameId}
            </Typography>
          </Grid>
          <Grid item size={12}>
            <FetchNFT tokenId={gameId} />
          </Grid>
        </Grid>
      ) : (
        <NotConnected />
      )}
    </Fragment>
  );
}
