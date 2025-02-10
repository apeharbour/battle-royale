import React, { useEffect, useState } from "react";
import CovAbi from "./abis/Cov.json";
import { useReadContract } from "wagmi";

const COV_ADDRESS = import.meta.env.VITE_COV_ADDRESS;
const COV_ABI = CovAbi.abi;

function FetchNFT({ tokenId }) {
  const {
    data: tokenUri,
    isError,
    isLoading,
  } = useReadContract({
    address: COV_ADDRESS,
    abi: COV_ABI,
    functionName: "tokenURI",
    args: [tokenId],
  });

  console.log("Token Data:", tokenUri);

  const { data: islands } = useReadContract({
    address: COV_ADDRESS,
    abi: COV_ABI,
    functionName: "getIslands",
    args: [tokenId],
  });

  const { data: players } = useReadContract({
    address: COV_ADDRESS,
    abi: COV_ABI,
    functionName: "getPlayers",
    args: [tokenId],
  });

  const { data: movements } = useReadContract({
    address: COV_ADDRESS,
    abi: COV_ABI,
    functionName: "getMovements",
    args: [tokenId],
  });

  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (tokenUri) {
      console.log("Token URI: ", tokenUri);

      const cleanUri = tokenUri.replace("data:application/json;base64,", "");
      const json = JSON.parse(atob(cleanUri));
      setMetadata(json);
    }
  }, [tokenUri]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div>
      {metadata ? (
        <div>
          <img src={metadata.image} alt={metadata.name} />
          <h2>{metadata.name}</h2>
        </div>
      ) : (
        <p>Loading metadata...</p>
      )}
    </div>
  );
}

export default FetchNFT;
