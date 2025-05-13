import React, { useState } from "react";
import { useAccount } from "wagmi";
import { request, gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { useMediaQuery } from "@mui/material";
import YartPngDialog from "./YartPngDialog";
import ExploreIcon from "@mui/icons-material/Explore";
import Tooltip from "@mui/material/Tooltip";
import { CircularProgress } from "@mui/material";
import SvgImage from "./SvgImage";


const yartsQuery = gql`
  query GetTokensByOwner($owner: Bytes!) {
    tokens(where: { owner: $owner }) {
      id
      tokenId
      image
      attributes {
        trait
        value
      }
    }
  }
`;

function Yarts() {
  const { address } = useAccount();

  const [pngDialogOpen, setPngDialogOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);
  const [showFleetView, setShowFleetView] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const { data, isLoading, error } = useQuery({
    queryKey: ["GetTokensByOwner", address],
    queryFn: async () =>
      request(import.meta.env.VITE_SUBGRAPH_URL_YARTS, yartsQuery, {
        owner: address,
      }),
  });

  const handleCardClick = (nft) => {
    setSelectedNft(nft);
    setPngDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    console.error("Error fetching NFTs:", error);
    return <div>Error loading your NFTs.</div>;
  }

  const nfts = data && data.tokens ? data.tokens : [];

  return (
    <React.Fragment>
      <Box
        mt={2}
        sx={{
          textAlign: "center",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={showFleetView}
              onChange={() => setShowFleetView(!showFleetView)}
            />
          }
          label={
            <Typography style={{ fontSize: "1rem" }}>
              {showFleetView ? "fleet view on" : "fleet view off"}
            </Typography>
          }
          sx={{ marginBottom: "32px" }}
        />
      </Box>
      {showFleetView ? (
        <Grid container justifyContent="center" alignItems="center" mb={4}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0px",
              justifyContent: "flex-start",
              margin: "0 auto",
              padding: "0",
              maxWidth: "1200px",
              width: "100%",
              marginTop: "16px",
              marginLeft: isSmallScreen ? "40px" : "64px",
            }}
          >
            {nfts.length > 0
              ? nfts.map((nft) => (
                  <div
                    key={nft.tokenId}
                    style={{
                      width: "90px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCardClick(nft)}
                  >
                    <Tooltip title={`yart #${nft.tokenId}`}>
                      {nft.image ? (
                        <SvgImage
                          image={nft.image}
                          alt={`NFT ${nft.tokenId}`}
                          loading="lazy"
                          style={{ width: "50%", height: "auto" }}
                          onClick={() => handleCardClick(nft)}
                        />
                      ) : (
                        <div
                          style={{
                            width: "50%",
                            height: "50px",
                            background: "#ccc",
                          }}
                        >
                          {/* Optional fallback content */}
                          <Typography variant="caption">No Image</Typography>
                        </div>
                      )}
                    </Tooltip>
                  </div>
                ))
              : null}
          </div>
        </Grid>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{
            height: { xs: "730px", sm: "850px" },
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          {nfts.length > 0
            ? nfts.map((nft) => {
                const { attributes } = nft;
                const shipType =
                  attributes
                    .find((attr) => attr.trait === "type")
                    ?.value.toLowerCase() || "N/A";
                const range =
                  attributes.find((attr) => attr.trait === "range")?.value ||
                  "N/A";
                const movement =
                  attributes.find((attr) => attr.trait === "movement")?.value ||
                  "N/A";

                return (
                  <Grid
                    item
                    size={{ xs: 12, md: 4, sm: 4, lg: 4 }}
                    key={nft.tokenId}
                  >
                    <Box
                      onClick={() => handleCardClick(nft)}
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <Card>
                        <div
                          style={{
                            height: 150,
                            width: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "auto",
                          }}
                        >
                          <SvgImage
                            image={nft.image}
                            alt={`NFT ${nft.tokenId}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              cursor: "pointer",
                            }}
                            onClick={() => handleCardClick(nft)}
                          />
                        </div>
                        <CardContent>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                              textAlign="center"
                            >
                              yart #{nft.tokenId}
                            </Typography>
                            <ExploreIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  `https://apechain.calderaexplorer.xyz/token/0x53792e6562F0823060BD016cC75F7B2997721143/instance/${nft.tokenId}`,
                                  "_blank"
                                );
                              }}
                              sx={{ cursor: "pointer", fontSize: "1.2rem" }}
                            />
                          </Stack>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            mt={2}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Chip label={`type: ${shipType}`} />
                            <Chip
                              label={`range: ${range}`}
                              variant="outlined"
                            />
                            <Chip
                              label={`movement: ${movement}`}
                              variant="outlined"
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                );
              })
            : null}
        </Grid>
      )}
      {selectedNft && (
        <YartPngDialog
        open={pngDialogOpen}
        onClose={() => setPngDialogOpen(false)}
        nft={selectedNft}
      />
      )}
    </React.Fragment>
  );
}

export default Yarts;
