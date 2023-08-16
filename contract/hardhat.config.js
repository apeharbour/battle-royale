require("@nomicfoundation/hardhat-toolbox");

const INFURA_API_KEY = '6db1336ca92a4314a1cb9bd6deb25103';

const SEPOLIA_PRIVATE_KEY = '9c0521b8049b9cc6f6c7f6a93b93fc31c9a3738dcaee3ae5a8977652b832d828';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};
