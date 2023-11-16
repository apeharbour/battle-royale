require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_API;
const Alchemy_Key = process.env.ALCHEMEY_API_KEY;

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
    }
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,
      // accounts: [process.env.SEPOLIA_PRIVATE_KEY],
      accounts: {
        mnemonic: process.env.SEPOLIA_MNEMONIC
      },
    },
    localhost: {
      url: "http://0.0.0.0:8545",
    },
    hardhat: {
      chainId: 1337,
    },
  },    
};
