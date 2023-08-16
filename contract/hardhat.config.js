require("@nomicfoundation/hardhat-toolbox");

const INFURA_API_KEY = '6db1336ca92a4314a1cb9bd6deb25103';


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
  },
};
