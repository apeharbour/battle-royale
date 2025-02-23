import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Box, Typography } from "@mui/material";

const COV_ADDRESS = import.meta.env.VITE_COV_ADDRESS;

const minimalAbi = ["function tokenURI(uint256 tokenId) view returns (string)"];
const RPC_URL = "https://curtis.rpc.caldera.xyz/http";

function FetchNFT({ tokenId }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTokenURI() {
      try {
        setLoading(true);

        const provider = new ethers.JsonRpcProvider(RPC_URL);

        const contract = new ethers.Contract(COV_ADDRESS, minimalAbi, provider);

        const tokenUri = await contract.tokenURI(tokenId);
    
        const base64Json = tokenUri.replace(
          "data:application/json;base64,",
          ""
        );
        const jsonString = atob(base64Json);
        const data = JSON.parse(jsonString);

        setMetadata(data);
      } catch (err) {
        console.error("Error fetching tokenURI:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (tokenId != null) {
      loadTokenURI();
    }
  }, [tokenId]);

  if (loading) return <div>Loading token metadata…</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!metadata) return <div>No metadata found.</div>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Box
        component="img"
        src={metadata.image}
        alt={metadata.name}
        sx={{ maxWidth: "600px", mt: 2 }}
      />
       <Typography variant="h5">{metadata.name}</Typography>
    </Box>
    
  );
}

export default FetchNFT;
