const { KMSClient } = require("@aws-sdk/client-kms");
const { KMSSigner } = require("@rumblefishdev/eth-signer-kms");
const { providers, Contract, utils } = require("ethers");
const { JsonRpcProvider } = providers;


const kmsClient = new KMSClient({ region: "eu-north-1" });

const kmsKeyId =
  "arn:aws:kms:eu-north-1:959450033266:key/dfab230c-5f94-4f00-90a9-fc2c0cff284c";

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
  const REGISTRATION_ADDRESS = "0x6b115250Af2037433b1c87005910cAD8ade9fa45";

const rpcUrl = "https://curtis.rpc.caldera.xyz/http";

const provider = new JsonRpcProvider(rpcUrl, { chainId: 33111, name: "curtis" });

const signer = new KMSSigner(provider, kmsKeyId, kmsClient);

const contract = new Contract(REGISTRATION_ADDRESS, REGISTRATION_ABI, signer);

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  console.log("Signer address:", await signer.getAddress());


  try {
   
    console.log(
      "startRegistration fragment:",
      contract.interface.getFunction("startRegistration")
    );
    console.log("All fragments:", contract.interface.fragments);

    // (E) Call contract method
    console.log("Calling startRegistration...");
    const tx = await contract.startRegistration();

 const receipt = await tx.wait();
 console.log("Transaction confirmed in block:", receipt.blockNumber);
 console.log("Receipt logs:", receipt.logs);

 return {
   statusCode: 200,
   headers: {
     "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Methods": "POST, OPTIONS",
     "Access-Control-Allow-Headers": "Content-Type,Authorization",
   },
   body: JSON.stringify({
     message: "startRegistration called successfully",
     txHash: tx.hash,
     blockNumber: receipt.blockNumber,
   }),
 };
} catch (error) {
 console.error("Error calling startRegistration:", error);
 return {
   statusCode: 500,
   body: JSON.stringify({ error: error.message }),
 };
}
};