const AWS = require("aws-sdk");
const { KMSClient } = require("@aws-sdk/client-kms");
const { KMSSigner } = require("@rumblefishdev/eth-signer-kms");
const { providers, Contract } = require("ethers");
const { JsonRpcProvider } = providers;
const axios = require("axios");

const SUBGRAPH_URL =
  "https://subgraph.satsuma-prod.com/cbc4c5f8e956/nicos-team--278739/registration/api";

async function fetchGameIdsFromSubgraph() {
  // 3a) GraphQL query
  const registrationQuery = `
  query {
    registrations {
      firstGameId
      phase
      state
      players {
        address
        yartsshipId
        state
        gameId
      }
    }
  }
`;

  try {
    const response = await axios.post(SUBGRAPH_URL, {
      query: registrationQuery,
    });

    if (
      !response.data ||
      !response.data.data ||
      !response.data.data.registrations
    ) {
      console.log("No registrations found in subgraph response.");
      return [];
    }

    const allPhases = response.data.data.registrations.map((r) =>
      parseInt(r.phase, 10)
    );
    const highestPhase = Math.max(...allPhases);

    const highestPhaseEntries = response.data.data.registrations.filter(
      (r) => parseInt(r.phase, 10) === highestPhase
    );
    const highestPhaseGameIds = highestPhaseEntries.map((r) => r.firstGameId);

    console.log("Highest phase:", highestPhase);
    console.log("Game IDs in highest phase:", highestPhaseGameIds);

    return highestPhaseGameIds;
  } catch (error) {
    console.error("Error fetching data from the subgraph:", error);
    return [];
  }
}

async function callAfterGameCreatedAPI(gameId) {
  const apiEndpoint =
    "https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/afterGameCreated";

  const postData = {
    gameId: gameId.toString(),
    scheduleRate: "2 minutes",
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: "battleroyale",
  };

  console.log("Sending request with headers:", headers);

  try {
    const response = await axios.post(apiEndpoint, postData, { headers });

    console.log(`API response for Game ID ${gameId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `API call failed for Game ID ${gameId}:`,
      error.response ? error.response.data : error.message
    );
    throw new Error(`API call failed: ${error.message}`);
  }
}

const region = "eu-north-1";
const kmsClient = new KMSClient({ region });

// 4b) Provide your KMS Key
const kmsKeyId =
  "arn:aws:kms:eu-north-1:959450033266:key/dfab230c-5f94-4f00-90a9-fc2c0cff284c";

// 4c) Registration contract info
const REGISTRATION_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_gameyartsAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_yartsAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PlayerAlreadyRegisteredError",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PlayerNotOwnerOfShipError",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "RegistrationClosedError",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "registrationPhase",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "yartsshipId",
        "type": "uint256"
      }
    ],
    "name": "PlayerAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "registrationPhase",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "yartsshipId",
        "type": "uint256"
      }
    ],
    "name": "PlayerRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "registrationPhase",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "RegistrationClosed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "registrationPhase",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "firstGameId",
        "type": "uint256"
      }
    ],
    "name": "RegistrationStarted",
    "type": "event"
  },
  {
    "stateMutability": "nonpayable",
    "type": "fallback"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_maxPlayersPerGame",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_radius",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_mapShrink",
        "type": "uint8"
      }
    ],
    "name": "closeRegistration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameyarts",
    "outputs": [
      {
        "internalType": "contract IGameyarts",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "kmsPublicAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastGameId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_yartsshipId",
        "type": "uint256"
      }
    ],
    "name": "registerPlayer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "registeredPlayers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "registered",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "yartsshipId",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registrationClosed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registrationPhase",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_kmsPublicAddress",
        "type": "address"
      }
    ],
    "name": "setKmsPublicAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startRegistration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "yarts",
    "outputs": [
      {
        "internalType": "contract Iyarts",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const REGISTRATION_ADDRESS = "0x9f6B8fB16545878d8711F3E7e8fd9B6C570F2FcC";

// 4d) RPC URL
const rpcUrl = "https://curtis.rpc.caldera.xyz/http";

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    // (A) Extract parameters from the event
    const requestBody = JSON.parse(event.body); // Parse the body
    const { maxPlayers, radius, mapShrink } = requestBody;

    if (
      maxPlayers === undefined ||
      radius === undefined ||
      mapShrink === undefined
    ) {
      throw new Error("Missing required params: maxPlayers, radius, mapShrink");
    }
    console.log("closeRegistration args:", { maxPlayers, radius, mapShrink });

    // (B) Setup Ethers
    const provider = new JsonRpcProvider(rpcUrl, {
      chainId: 33111,
      name: "curtis",
    });
    const signer = new KMSSigner(provider, kmsKeyId, kmsClient);

    // (C) Create contract instance
    const contract = new Contract(
      REGISTRATION_ADDRESS,
      REGISTRATION_ABI,
      signer
    );

    // (D) Call closeRegistration
    console.log("Calling closeRegistration...");
    const tx = await contract.closeRegistration(maxPlayers, radius, mapShrink);
    console.log("Transaction sent. Hash:", tx.hash);

    // (E) Wait for the transaction to confirm
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // (F) Fetch gameIds from the highest phase & call REST API for each
    try {
      const gameIds = await fetchGameIdsFromSubgraph();
      for (const gameId of gameIds) {
        await callAfterGameCreatedAPI(gameId);
      }
    } catch (err) {
      console.error(
        "Error while fetching or calling subgraph-based game IDs:",
        err
      );
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
      body: JSON.stringify({
        message: "closeRegistration called successfully",
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
      }),
    };
  } catch (error) {
    console.error("Error calling closeRegistration:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
