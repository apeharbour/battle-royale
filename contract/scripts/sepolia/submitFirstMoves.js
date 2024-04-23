// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

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

  const deployedAddresses = {
    "BattleRoyale#MapPunk": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "BattleRoyale#Punkships": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "BattleRoyale#GamePunk": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "BattleRoyale#RegistrationPunk": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  }

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
