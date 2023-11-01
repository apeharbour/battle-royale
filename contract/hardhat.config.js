require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_API;

module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/S1MSWAqlr5h1kcztMrV5h9I3-ibEaQWK`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
    hardhat: {
      chainId: 1337
    },    
  }
};
