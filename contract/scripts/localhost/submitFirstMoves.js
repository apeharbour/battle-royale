// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const deployedAddresses = require("../../ignition/deployments/chain-1337/deployed_addresses.json")

const dir = {
  E: 0,
  NE: 1,
  NW: 2,
  W: 3,
  SW: 4,
  SE: 5,
};

const SALT = 1
const GAME_ID = 1

async function main() {
  const [owner, player1, player2, player3, player4] = await ethers.getSigners();

  const game = await hre.ethers.getContractAt(
    "GamePunk",
    deployedAddresses["BattleRoyale#GamePunk"]
  );

  const travelDirs = [dir.NE, dir.SE, dir.E, dir.NW];
  const travelDists = [3, 3, 1, 1];
  const shotDirs = [dir.W, dir.E, dir.E, dir.NW];
  const shotDists = [1, 2, 1, 2];
  const secrets = [SALT, SALT, SALT, SALT];
  const playerAddresses = [player1.address, player2.address, player3.address, player4.address];


  await game.submitMove(travelDirs, travelDists, shotDirs, shotDists, secrets, playerAddresses, GAME_ID)
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(`Submitted moves in block ${receipt.blockNumber}.`);
    })
    .catch(console.error);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
