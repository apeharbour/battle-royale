require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("@nomicfoundation/hardhat-ignition-ethers")
require("dotenv").config();

const INFURA_API_KEY = process.env.INFURA_API;
const Alchemy_Key = process.env.ALCHEMY_API_KEY;

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: ["9c0521b8049b9cc6f6c7f6a93b93fc31c9a3738dcaee3ae5a8977652b832d828"],
    },
    hardhat: {
      chainId: 1337,
      mining: {
        auto: false,
        interval: 5000,
      },
    },
  },
};
