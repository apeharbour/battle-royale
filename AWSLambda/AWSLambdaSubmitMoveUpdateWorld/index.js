const AWS = require("aws-sdk");
const { ethers } = require("ethers");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const region = "eu-north-1";
const secretName = "APHDevWallet";
const secretsClient = new SecretsManagerClient({ region: region });
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: region });

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
        "name": "_punkshipsAddress",
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
        "name": "punkshipId",
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
        "name": "_punkshipId",
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
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "endGame",
    "outputs": [],
    "stateMutability": "nonpayable",
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
          }
        ],
        "internalType": "struct GamePunk.Ship[]",
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
        "name": "gameId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "_radius",
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
const contractAddress = "0xcf79eB6013F05b6EF445cD9ddf1C60179DfF434e";

// Initialize ApiGatewayManagementApi with your WebSocket URL
const apiGwManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: "https://dm2d6wt8a5.execute-api.eu-north-1.amazonaws.com/production"
});

exports.handler = async (event) => {

  const { gameId, scheduleRate } = event;
  const numericGameId = Number(gameId);

  const url =
    "https://eth-sepolia.g.alchemy.com/v2/S1MSWAqlr5h1kcztMrV5h9I3-ibEaQWK";
  let privateKey;

  // Fetch the secret from AWS Secrets Manager
  try {
    const response = await secretsClient.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT",
      })
    );
    const secret = JSON.parse(response.SecretString);
    privateKey = secret.APHPrivateKey;
  } catch (error) {
    console.error("Error retrieving secret:", error);
    throw error;
  }

  const provider = new ethers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  // Fetch player moves from DynamoDB
  const playerMoves = await fetchPlayerMoves(gameId);

  // Check if any player moves were found
  if (playerMoves.length === 0) {
    console.log(
      `No player moves found for gameId: ${gameId}. Exiting function.`
    );
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `No player moves found for gameId: ${gameId}`,
      }),
    };
  }

  // Calculate the end time based on scheduleRate
  const endTime = getEndTime(scheduleRate);

  // Format data for smart contract
  const {
    travelDirections,
    travelDistances,
    shotDirections,
    shotDistances,
    secrets,
    playerAddresses,
  } = formatDataForContract(playerMoves);

  // Log the formatted data for debugging
  console.log("Formatted data for contract:", {
    travelDirections,
    travelDistances,
    shotDirections,
    shotDistances,
    secrets,
    playerAddresses,
  });

  // Call the smart contract function submitMove
  try {
    const tx = await contract.submitMove(
      travelDirections,
      travelDistances,
      shotDirections,
      shotDistances,
      secrets,
      playerAddresses,
      gameId
    );
    await tx.wait();
    console.log("submitMove executed:", tx.hash);

    // Call the smart contract function updateWorld
    const txUpdate = await contract.updateWorld(gameId);
    await txUpdate.wait();
    console.log("updateWorld executed:", txUpdate.hash);

    // After successful smart contract execution, delete player moves
    await deletePlayerMoves(gameId);

    try {
      await updateCountdownState(numericGameId,endTime);
      console.log(`Countdown state updated for game ${gameId} with new endTime: ${endTime}`);
    } catch (error) {
      console.error(`Error updating countdown state for game ${gameId}:`, error);
      return { statusCode: 500, body: JSON.stringify({ message: 'Error updating countdown state' }) };
    }

    // Now, broadcast the message to reset the timer to all connected WebSocket clients
  try {
    await broadcastMessage({
      action: 'resetTimer',
      gameId: gameId,
      endTime: endTime,
    });
    console.log('Broadcast resetTimer action successfully');
  } catch (broadcastError) {
    console.error("Error broadcasting resetTimer action:", broadcastError);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error broadcasting resetTimer action' }) };
  }
  return {
    statusCode: 200,
headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify({ message: 'Contract functions and websocket message broadcasted successfully' }),
};

  } catch (error) {
    console.error(
      "Error executing contract functions or deleting player moves:",
      error
    );
    throw error;
  }
};

// Assuming scheduleRate is a string like "5 minutes"
function getEndTime(scheduleRate) {
  // Example assumes scheduleRate is like "5 minutes"
  const durationInMinutes = parseInt(scheduleRate.split(" ")[0], 10);
  return new Date(new Date().getTime() + durationInMinutes * 60000).getTime();
}



async function fetchPlayerMoves(gameId) {
  const params = {
    TableName: "BattleRoyalePlayerMoves",
    KeyConditionExpression: "gameId = :gameId",
    ExpressionAttributeValues: { ":gameId": Number(gameId) },
  };

  try {
    const data = await dynamoDb.query(params).promise();
    return data.Items;
  } catch (error) {
    console.error("Error fetching player moves from DynamoDB:", error);
    throw error;
  }
}

function formatDataForContract(playerMoves) {
  let travelDirections = [],
    travelDistances = [],
    shotDirections = [],
    shotDistances = [],
    secrets = [],
    playerAddresses = [];

  playerMoves.forEach((move) => {
    travelDirections.push(move.travelDirection);
    travelDistances.push(move.travelDistance);
    shotDirections.push(move.shotDirection);
    shotDistances.push(move.shotDistance);
    secrets.push(move.secretValue);
    playerAddresses.push(move.playerAddress);
  });

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
  const playerMoves = await fetchPlayerMoves(gameId);
  const MAX_BATCH_SIZE = 25;
  let batchWriteParams = { RequestItems: { BattleRoyalePlayerMoves: [] } };

  for (let i = 0; i < playerMoves.length; i++) {
    batchWriteParams.RequestItems["BattleRoyalePlayerMoves"].push({
      DeleteRequest: {
        Key: {
          gameId: playerMoves[i].gameId,
          playerAddress: playerMoves[i].playerAddress,
        },
      },
    });

    if (
      batchWriteParams.RequestItems["BattleRoyalePlayerMoves"].length ===
        MAX_BATCH_SIZE ||
      i === playerMoves.length - 1
    ) {
      try {
        await dynamoDb.batchWrite(batchWriteParams).promise();
        console.log(`Batch delete successful for batch ending at index ${i}`);
        batchWriteParams.RequestItems["BattleRoyalePlayerMoves"] = []; // Reset the batch
      } catch (error) {
        console.error("Error in batch delete:", error);
      }
    }
  }
}

// Function to broadcast a message to all connected clients
async function broadcastMessage(data) {

  // Fetch all connection IDs from DynamoDB
  const connectionIds = await fetchAllConnectionIds(); 

  const postCalls = connectionIds.map(async ({ connectionId }) => {
    try {
      await apiGwManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(data),
      }).promise();
    } catch (e) {
      if (e.statusCode === 410) {
        await deleteStaleConnection(connectionId);
        console.log(`Stale connection, deleting ${connectionId}`);
      } else {
        throw e;
      }
    }
  });

  try {
    await Promise.all(postCalls);
  } catch (error) {
    console.error("Error broadcasting message:", error);
  }
}

async function fetchAllConnectionIds() {
  const params = {
    TableName: "WebSocketConnections",
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.error("Error fetching connection IDs from DynamoDB:", error);
    throw error;
  }
}

async function deleteStaleConnection(connectionId) {
  const params = {
    TableName: "WebSocketConnections",
    Key: {
      connectionId: connectionId,
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    console.log(`Successfully deleted stale connection ${connectionId}`);
  } catch (error) {
    console.error("Error deleting stale connection:", error);
  }
}

async function updateCountdownState(gameId, endTime) {
  const params = {
    TableName: "GameCountdowns",
    Item: {
      gameId: gameId,
      endTime: endTime
    }
  };

  try {
    await dynamoDb.put(params).promise();
    console.log(`Countdown state updated for game ${gameId}`);
  } catch (error) {
    console.error(`Error updating countdown state for game ${gameId}:`, error);
  }
}


