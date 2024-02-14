const AWS = require('aws-sdk');
const { ethers } = require('ethers');
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

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
          "internalType": "uint8",
          "name": "gameId",
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
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
          "internalType": "uint8",
          "name": "speed",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "range",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
        }
      ],
      "name": "WorldUpdated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
        },
        {
          "internalType": "address[]",
          "name": "playerAddresses",
          "type": "address[]"
        },
        {
          "internalType": "uint8[]",
          "name": "speeds",
          "type": "uint8[]"
        },
        {
          "internalType": "uint8[]",
          "name": "ranges",
          "type": "uint8[]"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
        }
      ],
      "name": "getCells",
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
              "internalType": "uint8",
              "name": "gameId",
              "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint256[]",
          "name": "secrets",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "playerAddresses",
          "type": "address[]"
        },
        {
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "gameId",
          "type": "uint8"
        }
      ],
      "name": "updateWorld",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]; 
const contractAddress = '0xB29EB360720DE3FC7BB14E6F91bcA6E0bdF50a66';

exports.handler = async (event) => {
    const url = "https://eth-sepolia.g.alchemy.com/v2/S1MSWAqlr5h1kcztMrV5h9I3-ibEaQWK";
    let privateKey;

    // Fetch the secret from AWS Secrets Manager
    try {
        const response = await secretsClient.send(new GetSecretValueCommand({
            SecretId: secretName,
            VersionStage: "AWSCURRENT", 
        }));
        const secret = JSON.parse(response.SecretString);
        privateKey = secret.APHPrivateKey;
    } catch (error) {
        console.error('Error retrieving secret:', error);
        throw error;
    }

    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Parse the gameId from the event
    const { gameId } = JSON.parse(event.body);

    // Fetch player moves from DynamoDB
    const playerMoves = await fetchPlayerMoves(gameId);

    // Check if any player moves were found
    if (playerMoves.length === 0) {
      console.log(`No player moves found for gameId: ${gameId}. Exiting function.`);
      return { statusCode: 404, body: JSON.stringify({ message: `No player moves found for gameId: ${gameId}` }) };
  }

    // Format data for smart contract
    const { travelDirections, travelDistances, shotDirections, shotDistances, secrets, playerAddresses } = formatDataForContract(playerMoves);

    // Call the smart contract function
    try {
        const tx = await contract.submitMove(travelDirections, travelDistances, shotDirections, shotDistances, secrets, playerAddresses, gameId);
        await tx.wait();
        console.log('submitMove executed:', tx.hash);

        // After successful smart contract execution, delete player moves
        await deletePlayerMoves(gameId);
    } catch (error) {
        console.error('Error executing contract function or deleting player moves:', error);
        throw error;
    }
};

async function fetchPlayerMoves(gameId) {
    const params = {
        TableName: 'BattleRoyalePlayerMoves',
        KeyConditionExpression: 'gameId = :gameId',
        ExpressionAttributeValues: { ':gameId': Number(gameId) },
    };

    try {
        const data = await dynamoDb.query(params).promise();
        return data.Items;
    } catch (error) {
        console.error('Error fetching player moves from DynamoDB:', error);
        throw error;
    }
}

function formatDataForContract(playerMoves) {
    let travelDirections = [], travelDistances = [], shotDirections = [], shotDistances = [], secrets = [], playerAddresses = [];

    playerMoves.forEach(move => {
        travelDirections.push(move.travelDirection);
        travelDistances.push(move.travelDistance);
        shotDirections.push(move.shotDirection);
        shotDistances.push(move.shotDistance);
        secrets.push(move.secretValue);
        playerAddresses.push(move.playerAddress);
    });

    return { travelDirections, travelDistances, shotDirections, shotDistances, secrets, playerAddresses };
}

async function deletePlayerMoves(gameId) {
    const playerMoves = await fetchPlayerMoves(gameId);
    const MAX_BATCH_SIZE = 25;
    let batchWriteParams = { RequestItems: { 'BattleRoyalePlayerMoves': [] } };

    for (let i = 0; i < playerMoves.length; i++) {
        batchWriteParams.RequestItems['BattleRoyalePlayerMoves'].push({
            DeleteRequest: { Key: { 'gameId': playerMoves[i].gameId, 'playerAddress': playerMoves[i].playerAddress } }
        });

        if (batchWriteParams.RequestItems['BattleRoyalePlayerMoves'].length === MAX_BATCH_SIZE || i === playerMoves.length - 1) {
            try {
                await dynamoDb.batchWrite(batchWriteParams).promise();
                console.log(`Batch delete successful for batch ending at index ${i}`);
                batchWriteParams.RequestItems['BattleRoyalePlayerMoves'] = []; // Reset the batch
            } catch (error) {
                console.error('Error in batch delete:', error);
            }
        }
    }
}
