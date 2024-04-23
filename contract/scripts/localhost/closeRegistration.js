// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const deployedAddresses = require("../../ignition/deployments/chain-1337/deployed_addresses.json")

async function main() {
  const [owner, player1, player2, player3, player4] = await ethers.getSigners();


  const registration = await hre.ethers.getContractAt(
    "RegistrationPunk",
    deployedAddresses["BattleRoyale#RegistrationPunk"]
  );

  const MAX_PLAYERS = 4;
  const RADIUS = 5;

  await registration
    .closeRegistration(MAX_PLAYERS, RADIUS)
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(`Closed registration in block ${receipt.blockNumber}.`);
    })
    .catch(console.error);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
