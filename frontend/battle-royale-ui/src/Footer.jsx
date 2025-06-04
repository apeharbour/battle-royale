import React from "react";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  Link as MuiLink,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const provenanceUrl =
    "https://apescan.io/address/0x53792e6562F0823060BD016cC75F7B2997721143";
  const contractAddress = "0x53792e6562F0823060BD016cC75F7B2997721143";
  const provenanceText = isMobile
    ? "provenance"
    : `provenance: ${contractAddress}`;

  return (
    <footer>
      <Box
        sx={{
          width: "100%",
          backgroundColor: theme.palette.background.paper,
          py: 2, // Add padding for better spacing
        }}
      >
        {isMobile ? (
          <Grid container spacing={1} mb={-1.8}>
            <Grid item size={6}>
              <Button
                fullWidth
                variant="text"
                component={Link}
                to="/imprint"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textTransform: "none",
                }}
              >
                imprint
              </Button>
            </Grid>
            <Grid item size={6}>
              <Button
                fullWidth
                variant="text"
                component={Link}
                to="/tandc"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textTransform: "none",
                }}
              >
                terms & conditions
              </Button>
            </Grid>
            <Grid item size={6}>
              <Button
                fullWidth
                variant="text"
                component={Link}
                to="/about"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textTransform: "none",
                }}
              >
                about
              </Button>
            </Grid>
            <Grid item size={6}>
              <Button
                fullWidth
                variant="text"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://x.com/yarts_onchain`, "_blank");
                }}
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textTransform: "none",
                }}
              >
                x
              </Button>
            </Grid>
            <Grid item size={6}>
              <Button
                fullWidth
                variant="text"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    `https://magiceden.io/collections/apechain/0x53792e6562f0823060bd016cc75f7b2997721143`,
                    "_blank"
                  );
                }}
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textTransform: "none",
                }}
              >
                magic eden
              </Button>
            </Grid>
            <Grid item size={6}>
              <MuiLink
                href={provenanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "block",
                  textDecoration: "none",
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
              >
                {provenanceText}
              </MuiLink>
            </Grid>
            {/* <Grid item size={12}>
              <SearchYart />
            </Grid> */}
            <Grid item size={12}>
              <Typography
                component="a"
                href="https://laidback.ventures/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: "none",
                  color: "text.secondary",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
              >
                {`© ${new Date().getFullYear()} laid back ventures`}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={-2.1}
          >
            <Box display="flex" alignItems="center">
              <Button
                variant="text"
                component={Link}
                to="/imprint"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textTransform: "none",
                }}
              >
                imprint
              </Button>
              <Button
                variant="text"
                component={Link}
                to="/tandc"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textTransform: "none",
                }}
              >
                terms & conditions
              </Button>
              <Button
                variant="text"
                component={Link}
                to="/about"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textTransform: "none",
                }}
              >
                about
              </Button>
              <Button
                variant="text"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://x.com/yarts_onchain`, "_blank");
                }}
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textTransform: "none",
                }}
              >
                x
              </Button>
              <Button
                variant="text"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    `https://magiceden.io/collections/apechain/0x53792e6562f0823060bd016cc75f7b2997721143`,
                    "_blank"
                  );
                }}
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  textTransform: "none",
                }}
              >
                magic eden
              </Button>
              <MuiLink
                href={provenanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: "none",
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  wordBreak: "break-word",
                  ml: 2,
                }}
              >
                {provenanceText}
              </MuiLink>
              {/* <SearchYart /> */}
            </Box>
            <Typography
              component="a"
              href="https://laidback.ventures/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: "none",
                color: "text.secondary",
                cursor: "pointer",
                fontSize: "0.8rem",
                textAlign: "center",
              }}
            >
              {`© ${new Date().getFullYear()} laid back ventures`}
            </Typography>
          </Box>
        )}
      </Box>
    </footer>
  );
}
