import { request, gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import YartPngDialog from "./YartPngDialog";

const yartsQuery = gql`
  query GetTokensByTokenId($tokenId: BigInt!) {
    tokens(where: { tokenId: $tokenId }) {
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

export default function SearchYart() {
  const [tokenId, setTokenId] = useState("");
  const [searchId, setSearchId] = useState(null);
  const [pngDialogOpen, setPngDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["GetTokensByTokenId", searchId],
    queryFn: async () =>
      request(import.meta.env.VITE_SUBGRAPH_URL_YARTS, yartsQuery, {
        tokenId: searchId,
      }),
    enabled: !!searchId,
  });

  const handleSearch = () => {
    if (tokenId) {
      setSearchId(tokenId);
      console.log(`Searching for token ID: ${tokenId}`);
      if (data?.tokens[0]) {
        setPngDialogOpen(true);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value === "" || (/^\d+$/.test(value) && value >= 1 && value < 8900)) {
      setTokenId(value);
    }
  };

  return (
    <Box>
      <TextField
        label="yart id"
        variant="standard"
        size="small"
        value={tokenId}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: "0.8rem",
            },
          },
          htmlInput: {
            type: "text",
            autoComplete: "off",
          },
        }}
        sx={{
          width: 120,       
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon sx={{ fontSize: 20, mb: 1 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {searchId && (
        <YartPngDialog
          open={pngDialogOpen}
          onClose={() => setPngDialogOpen(false)}
          nft={data?.tokens[0]}
        />
      )}
    </Box>
  );
}
