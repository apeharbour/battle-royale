import React from "react";
import Grid from "@mui/material/Grid2";
import { Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function About() {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container spacing={2} justifyContent="center" sx={{ padding: isMobile ? 2 : 0 }}>
      <Grid item size={{ xs: 12, sm: 10, md: 12 }} style={{ textAlign: "left" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          about yarts
        </Typography>
        <Typography variant="subtitle2">
          yarts is a pixel art nft project. it is the first fully onchain generated art collection on apechain.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          deployment details
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word", // Break long words
            overflow: "hidden", // Hide overflow
          }}
        >
          contract address: 0x53792e6562F0823060BD016cC75F7B2997721143
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          transaction hash:
          0xe2df0320a38e8e4e4540bb57cef77afa5de75aeeb6067bdd8370a54460085fe1
        </Typography>
        <Typography variant="subtitle2">
          deployment date: november 15, 2024
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          supply and distribution
        </Typography>
        <Typography variant="subtitle2">total supply: 8899 yarts</Typography>
        <Typography variant="subtitle2">
          airdrop allocation: 7909 yarts (all bayc and genesis yacht owners
          received an airdrop on november 22, 2024)
        </Typography>
        <Typography variant="subtitle2">team reserve: 990 yarts</Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          ship types
        </Typography>
        <Typography variant="subtitle2">
          yarts features five distinct ship types:
        </Typography>
        <Typography variant="subtitle2">- wind rider</Typography>
        <Typography variant="subtitle2">- trident cruiser</Typography>
        <Typography variant="subtitle2">- four mast explorer</Typography>
        <Typography variant="subtitle2">- royal five mast</Typography>
        <Typography variant="subtitle2">- grand yacht</Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          design details
        </Typography>
        <Typography variant="subtitle2">
          yarts are fully generated onchain. some ships feature flags, while
          others don't. ship colors are randomly assigned, with each sail
          pattern on sailing ships uniquely generated via the smart contract.
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          y art - onchain
        </Typography>
      </Grid>
    </Grid>
  );
}