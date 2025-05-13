import React, { useState, useEffect, useRef } from "react";
import {
  useMediaQuery,
  Box,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { request, gql } from "graphql-request";
import { useInfiniteQuery } from "@tanstack/react-query";
import YartPngDialog from "./YartPngDialog";
import SvgImage from "./SvgImage";

const yartsQuery = gql`
  query Mint($first: Int, $skip: Int) {
    tokens(first: $first, skip: $skip) {
      tokenId
      image
    }
  }
`;

function Gallery() {
  const [pngDialogOpen, setPngDialogOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["Mint"],
      queryFn: async ({ pageParam = 0 }) => {
        const variables = {
          skip: pageParam,
          first: 100,
        };
        const data = await request(
          import.meta.env.VITE_SUBGRAPH_URL_YARTS,
          yartsQuery,
          variables
        );
        const sortedTokens = data.tokens
          .slice()
          .sort((a, b) => parseInt(a.tokenId) - parseInt(b.tokenId));
        return { tokens: sortedTokens };
      },
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.tokens.length < 100) {
          return undefined;
        }
        return pages.length * 100;
      },
      refetchOnWindowFocus: false,
    });

  const tokens = data ? data.pages.flatMap((page) => page.tokens) : [];
  const loadMoreRef = useRef();

  useEffect(() => {
    if (isLoading || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleCardClick = (nft) => {
    setSelectedNft(nft);
    setPngDialogOpen(true);
  };

  if (isLoading && !data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Box
          display="flex"
          flexWrap="wrap"
          gap="0px"
          justifyContent="flex-start"
          margin="0 auto"
          padding="0"
          width="100%"
          ml={isSmallScreen ? 4 : 4}
        >
          {tokens.map((nft) => (
            <Box
              key={nft.tokenId}
              width="90px"
              onClick={() => handleCardClick(nft)}
              sx={{ cursor: "pointer" }}
            >
              <Tooltip title={`yart #${nft.tokenId}`}>
                <SvgImage
                  image={nft.image}
                  alt={`NFT ${nft.tokenId}`}
                  style={{ width: "60%", height: "auto" }}
                />
              </Tooltip>
            </Box>
          ))}
          {isFetchingNextPage && (
            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              padding="20px 0"
            >
              <CircularProgress />
            </Box>
          )}
          <Box ref={loadMoreRef} height="1px" />
        </Box>
      </Grid>
      {selectedNft && (
        <YartPngDialog
          open={pngDialogOpen}
          onClose={() => setPngDialogOpen(false)}
          nft={selectedNft}
        />
      )}
    </>
  );
}

export default Gallery;
