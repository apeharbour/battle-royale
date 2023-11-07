require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_API;
const Alchemy_Key = process.env.ALCHEMEY_API;

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
      url: `https://eth-sepolia.g.alchemy.com/v2/${Alchemy_Key}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
    hardhat: {
      chainId: 1337
    },    
  }
};
