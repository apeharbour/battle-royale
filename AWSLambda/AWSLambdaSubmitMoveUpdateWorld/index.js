const AWS = require("aws-sdk");
const { KMSClient } = require("@aws-sdk/client-kms");
const { KMSSigner } = require("@rumblefishdev/eth-signer-kms");
const { providers, Contract } = require("ethers");
const { JsonRpcProvider } = providers;

const region = "eu-north-1";

const kmsClient = new KMSClient({ region });

const kmsKeyId =
  "arn:aws:kms:eu-north-1:959450033266:key/dfab230c-5f94-4f00-90a9-fc2c0cff284c";

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region });

const apiGwManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint:
    "https://dm2d6wt8a5.execute-api.eu-north-1.amazonaws.com/production",
});

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_mapAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_yartsshipsAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_covAddress",
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
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "NotOwnerOfShip",
    "type": "error"
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
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "q",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "r",
        "type": "uint8"
      }
    ],
    "name": "ShipAlreadyAdded",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "q",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "r",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "island",
        "type": "bool"
      }
    ],
    "name": "Cell",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "q",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "r",
        "type": "uint8"
      }
    ],
    "name": "CellDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "CommitPhaseStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "GameEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "GameStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bool",
        "name": "gameStatus",
        "type": "bool"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "winnerAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "GameUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "GameWinner",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "radius",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "mapShrink",
        "type": "uint8"
      }
    ],
    "name": "MapInitialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "MapShrink",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
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
        "internalType": "bytes32",
        "name": "moveHash",
        "type": "bytes32"
      }
    ],
    "name": "MoveCommitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
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
        "name": "roundId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "destQ",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "destR",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "shotQ",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "shotR",
        "type": "uint8"
      }
    ],
    "name": "MoveSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "players",
        "type": "address[]"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "MutualShot",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "radius",
        "type": "uint8"
      }
    ],
    "name": "NewRound",
    "type": "event"
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
        "indexed": true,
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
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "q",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "r",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "speed",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "range",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "image",
        "type": "string"
      }
    ],
    "name": "PlayerAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "PlayerDefeated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "captain",
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
        "internalType": "uint8",
        "name": "q",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "r",
        "type": "uint8"
      }
    ],
    "name": "ShipCollidedWithIsland",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "victim",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "attacker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "ShipHit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "captain",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "initialQ",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "initialR",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "q",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "r",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "ShipMoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "captain",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "ShipMovedInGame",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "captain",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "fromQ",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "fromR",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "shotQ",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "shotR",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "ShipShot",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "captain",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "ShipSunk",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "captain",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "ShipSunkOutOfMap",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      }
    ],
    "name": "SubmitPhaseStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "WorldUpdated",
    "type": "event"
  },
  {
    "stateMutability": "nonpayable",
    "type": "fallback"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "playerAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_yartsshipId",
        "type": "uint256"
      }
    ],
    "name": "addShip",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "moveHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "commitMove",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum SharedStructs.Directions",
        "name": "_travelDirection",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_travelDistance",
        "type": "uint8"
      },
      {
        "internalType": "enum SharedStructs.Directions",
        "name": "_shotDirection",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_shotDistance",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_secret",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "_playerAddress",
        "type": "address"
      }
    ],
    "name": "encodeCommitment",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "games",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "shrinkNo",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "mapShrink",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "gameInProgress",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "stopAddingShips",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "letCommitMoves",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "letSubmitMoves",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "q",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "r",
            "type": "uint8"
          }
        ],
        "internalType": "struct SharedStructs.Coordinate",
        "name": "_coord",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "getCell",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "q",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "r",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "island",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          }
        ],
        "internalType": "struct SharedStructs.Cell",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "getCoordinates",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "q",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "r",
            "type": "uint8"
          }
        ],
        "internalType": "struct SharedStructs.Coordinate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "getIslands",
    "outputs": [
      {
        "internalType": "uint8[]",
        "name": "IslandsQ",
        "type": "uint8[]"
      },
      {
        "internalType": "uint8[]",
        "name": "IslandsR",
        "type": "uint8[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "getRadius",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "getShips",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint8",
                "name": "q",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "r",
                "type": "uint8"
              }
            ],
            "internalType": "struct SharedStructs.Coordinate",
            "name": "coordinate",
            "type": "tuple"
          },
          {
            "internalType": "enum SharedStructs.Directions",
            "name": "travelDirection",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "travelDistance",
            "type": "uint8"
          },
          {
            "internalType": "enum SharedStructs.Directions",
            "name": "shotDirection",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "shotDistance",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "publishedMove",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "captain",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "yachtSpeed",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "yachtRange",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "gameId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "yartsshipId",
            "type": "uint256"
          }
        ],
        "internalType": "struct Gameyarts.Ship[]",
        "name": "",
        "type": "tuple[]"
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
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "q",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "r",
            "type": "uint8"
          }
        ],
        "internalType": "struct SharedStructs.Coordinate",
        "name": "_start",
        "type": "tuple"
      },
      {
        "internalType": "enum SharedStructs.Directions",
        "name": "_dir",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_distance",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "move",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "q",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "r",
            "type": "uint8"
          }
        ],
        "internalType": "struct SharedStructs.Coordinate",
        "name": "",
        "type": "tuple"
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
    "inputs": [],
    "name": "registrationContract",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "_registrationContract",
        "type": "address"
      }
    ],
    "name": "setRegistrationContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_gameId",
        "type": "uint256"
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
    "name": "startNewGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum SharedStructs.Directions[]",
        "name": "_travelDirections",
        "type": "uint8[]"
      },
      {
        "internalType": "uint8[]",
        "name": "_travelDistances",
        "type": "uint8[]"
      },
      {
        "internalType": "enum SharedStructs.Directions[]",
        "name": "_shotDirections",
        "type": "uint8[]"
      },
      {
        "internalType": "uint8[]",
        "name": "_shotDistances",
        "type": "uint8[]"
      },
      {
        "internalType": "uint8[]",
        "name": "_secrets",
        "type": "uint8[]"
      },
      {
        "internalType": "address[]",
        "name": "_playerAddresses",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "submitMove",
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
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "q",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "r",
            "type": "uint8"
          }
        ],
        "internalType": "struct SharedStructs.Coordinate",
        "name": "_startCell",
        "type": "tuple"
      },
      {
        "internalType": "enum SharedStructs.Directions",
        "name": "_direction",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_distance",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "travel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "updateWorld",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const contractAddress = "0x1Bd24db02530910A0e05Cb65F4EC3450e48CE3A4";
const rpcUrl = "https://curtis.rpc.caldera.xyz/http";

exports.handler = async (event) => {
  try {
    const { gameId, scheduleRate } = event;
    const numericGameId = Number(gameId);

    const provider = new JsonRpcProvider(rpcUrl, {
      chainId: 33111,
      name: "curtis",
    });
    const signer = new KMSSigner(provider, kmsKeyId, kmsClient);

    const contract = new Contract(contractAddress, contractABI, signer);

    const playerMoves = await fetchPlayerMoves(gameId);
    if (playerMoves.length === 0) {
      console.log(`No player moves for gameId: ${gameId}`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `No player moves found for ${gameId}`,
        }),
      };
    }

    const endTime = getEndTime(scheduleRate);

    const {
      travelDirections,
      travelDistances,
      shotDirections,
      shotDistances,
      secrets,
      playerAddresses,
    } = formatDataForContract(playerMoves);

    console.log("Formatted data for contract:", {
      travelDirections,
      travelDistances,
      shotDirections,
      shotDistances,
      secrets,
      playerAddresses,
    });

    const tx = await contract.submitMove(
      travelDirections,
      travelDistances,
      shotDirections,
      shotDistances,
      secrets,
      playerAddresses,
      gameId
    );
    const receipt = await tx.wait();
    console.log("submitMove executed:", tx.hash, "block:", receipt.blockNumber);

    await deletePlayerMoves(gameId);

    try {
      await updateCountdownState(numericGameId, endTime);
      console.log(
        `Countdown state updated for game ${gameId}, endTime=${endTime}`
      );
    } catch (err) {
      console.error("Error updating countdown:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error updating countdown state" }),
      };
    }

    try {
      await broadcastMessage({
        action: "resetTimer",
        gameId,
        endTime,
      });
      console.log("Broadcast resetTimer action successfully");
    } catch (err) {
      console.error("Error broadcasting resetTimer:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error broadcasting resetTimer" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Moves submitted, timer reset, websockets notified",
      }),
    };
  } catch (error) {
    console.error("Error in main handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function getEndTime(scheduleRate) {
  const durationInMinutes = parseInt(scheduleRate.split(" ")[0], 10);
  return new Date(Date.now() + durationInMinutes * 60_000).getTime();
}

async function fetchPlayerMoves(gameId) {
  const params = {
    TableName: "BattleRoyalePlayerMoves",
    KeyConditionExpression: "gameId = :g",
    ExpressionAttributeValues: {
      ":g": Number(gameId),
    },
  };
  try {
    const data = await dynamoDb.query(params).promise();
    return data.Items || [];
  } catch (error) {
    console.error("DynamoDB fetchPlayerMoves error:", error);
    throw error;
  }
}

function formatDataForContract(playerMoves) {
  const travelDirections = [];
  const travelDistances = [];
  const shotDirections = [];
  const shotDistances = [];
  const secrets = [];
  const playerAddresses = [];

  for (const move of playerMoves) {
    travelDirections.push(move.travelDirection);
    travelDistances.push(move.travelDistance);
    shotDirections.push(move.shotDirection);
    shotDistances.push(move.shotDistance);
    secrets.push(move.secretValue);
    playerAddresses.push(move.playerAddress);
  }

  return {
    travelDirections,
    travelDistances,
    shotDirections,
    shotDistances,
    secrets,
    playerAddresses,
  };
}

async function deletePlayerMoves(gameId) {
  const items = await fetchPlayerMoves(gameId);
  const MAX_BATCH_SIZE = 25;
  let batch = [];

  for (let i = 0; i < items.length; i++) {
    batch.push({
      DeleteRequest: {
        Key: {
          gameId: items[i].gameId,
          playerAddress: items[i].playerAddress,
        },
      },
    });

    if (batch.length === MAX_BATCH_SIZE || i === items.length - 1) {
      const params = {
        RequestItems: {
          BattleRoyalePlayerMoves: batch,
        },
      };
      try {
        await dynamoDb.batchWrite(params).promise();
        console.log("Batch delete success. Items in batch:", batch.length);
      } catch (err) {
        console.error("Batch delete error:", err);
      }
      batch = [];
    }
  }
}

async function broadcastMessage(data) {
  const connectionIds = await fetchAllConnectionIds();

  const postCalls = connectionIds.map(async ({ connectionId }) => {
    try {
      await apiGwManagementApi
        .postToConnection({
          ConnectionId: connectionId,
          Data: JSON.stringify(data),
        })
        .promise();
    } catch (err) {
      if (err.statusCode === 410) {
        await deleteStaleConnection(connectionId);
        console.log(`Removed stale connection: ${connectionId}`);
      } else {
        console.error("Error posting to connection:", connectionId, err);
      }
    }
  });

  await Promise.all(postCalls);
}

async function fetchAllConnectionIds() {
  const params = {
    TableName: "WebSocketConnections",
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    return data.Items || [];
  } catch (error) {
    console.error("Error fetching connections:", error);
    return [];
  }
}

async function deleteStaleConnection(connectionId) {
  const params = {
    TableName: "WebSocketConnections",
    Key: { connectionId },
  };

  try {
    await dynamoDb.delete(params).promise();
  } catch (err) {
    console.error("Error deleting stale connection:", connectionId, err);
  }
}

async function updateCountdownState(gameId, endTime) {
  const params = {
    TableName: "GameCountdowns",
    Item: {
      gameId,
      endTime,
    },
  };
  try {
    await dynamoDb.put(params).promise();
  } catch (err) {
    console.error("Error updating countdown table:", err);
    throw err;
  }
}
