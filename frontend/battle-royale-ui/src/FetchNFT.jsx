import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Replace with your contract address (ensure this matches your network)
const COV_ADDRESS = import.meta.env.VITE_COV_ADDRESS;

// Minimal ABI that includes tokenURI with its output type defined
const minimalAbi = [
  "function tokenURI(uint256 tokenId) view returns (string)"
];

function FetchNFT({ tokenId }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTokenURI() {
      try {
        setLoading(true);

        // Create a provider.
        // If using an injected provider like MetaMask:
        if (!window.ethereum) {
          throw new Error("No Ethereum provider found");
        }
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Create a contract instance using the minimal ABI
        const contract = new ethers.Contract(COV_ADDRESS, minimalAbi, provider);

        // Call the tokenURI function
        const tokenUri = await contract.tokenURI(tokenId);
        // console.log("tokenURI:", tokenUri);

        // Remove the prefix and decode the Base64 string
        const base64Json = tokenUri.replace("data:application/json;base64,", "");
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
    <div>
      <h2>{metadata.name}</h2>
      <img src={metadata.image} alt={metadata.name} style={{ maxWidth: "300px" }} />
      <p>{metadata.description}</p>
    </div>
  );
}

export default FetchNFT;
