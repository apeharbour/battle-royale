// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const [owner] = await ethers.getSigners();

  // Deploy random library
  // const RandomLib = await hre.ethers.getContractFactory('Random')
  // const randomLib = await RandomLib.deploy()
  
  const Map = await hre.ethers.getContractFactory('Map');
  const map = await Map.deploy(owner.address);
  await map.deployed();
  console.log( `Map contract deployed by ${owner.address} to ${map.address}` )
  
  const Game = await hre.ethers.getContractFactory('Game')
  const game = await Game.deploy(map.address)
  await game.deployed();
  console.log( `Game contract deployed by ${owner.address} to ${game.address}` )

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
