import React, { useEffect, useState } from 'react';
import CovAbi from "./abis/Cov.json";
import { useReadContract } from 'wagmi';

const COV_ADDRESS = import.meta.env.VITE_COV_ADDRESS;
const COV_ABI = CovAbi.abi;


function FetchNFT({ tokenId }) {
  const { data: tokenUri, isError, isLoading } = useReadContract({
    address: COV_ADDRESS,
    abi: COV_ABI,
    functionName: 'tokenURI',
    args: [tokenId],
  });

  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (tokenUri) {
      fetch(tokenUri)
        .then((response) => response.json())
        .then((data) => setMetadata(data))
        .catch((error) => console.error('Error fetching metadata:', error));

        console.log("Token URI: ", tokenUri);
    }
  }, [tokenUri]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching token URI</div>;

  return (
    <div>
      {metadata ? (
        <div>
          <img src={metadata.image} alt={metadata.name} />
          <h2>{metadata.name}</h2>
          <p>{metadata.description}</p>
        </div>
      ) : (
        <p>Loading metadata...</p>
      )}
    </div>
  );
}

export default FetchNFT;
