import { Button, Link, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ConnectKitButton } from "connectkit";

export default function NotConnected(props) {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item size={12} mt={2}>
        <Typography sx={{ fontSize: "1.25rem", fontWeight: "600" }}>
          {" "}
          you are not connected, please connect your wallet!
        </Typography>
      </Grid>
      <Grid item size={12} mt={2}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <ConnectKitButton.Custom>
            {({ isConnected, show }) => {
              if (isConnected && !walletConnected) {
                setWalletConnected(true);
              }

              return (
                <Button
                  onClick={show}
                  sx={{
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    backgroundColor: "transparent",
                    color: "inherit",
                    border: "1px solid currentColor",
                    textTransform: "none",
                    padding: "9px 18px",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.2s ease-in-out",
                    },
                  }}
                >
                  {isConnected ? "connected" : "connect"}
                </Button>
              );
            }}
          </ConnectKitButton.Custom>

          <Link href="/spectator" underline="none" color="inherit">
            <Button
              sx={{
                fontSize: "1.35rem",
                fontWeight: 700,
                backgroundColor: "transparent",
                color: "inherit",
                border: "1px solid currentColor",
                textTransform: "none",
                padding: "9px 18px",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              spectate
            </Button>
          </Link>

          <Link href="/gallery" underline="none" color="inherit">
            <Button
              sx={{
                fontSize: "1.35rem",
                fontWeight: 700,
                backgroundColor: "transparent",
                color: "inherit",
                border: "1px solid currentColor",
                textTransform: "none",
                padding: "9px 18px",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              gallery
            </Button>
          </Link>
        </Stack>
      </Grid>
    </Grid>
  );
}
