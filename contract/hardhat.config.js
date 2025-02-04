require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("@nomicfoundation/hardhat-ignition-ethers")
require("hardhat-gas-reporter");
require("dotenv").config();

const INFURA_API_KEY = process.env.INFURA_API;
const Alchemy_Key = process.env.ALCHEMY_API_KEY;

module.exports = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 50,
      },
      viaIR: true,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
    hardhat: {
      chainId: 1337,
    },
    base: {
      url: process.env.BASE_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY, process.env.PLAYER1_PRIVATE_KEY],
    },
    curtis: {
      url: "https://curtis.rpc.caldera.xyz/http",
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
  },
  gasReporter: {
    currency: 'EUR',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    enabled: (process.env.REPORT_GAS) ? true : false
  }
};
