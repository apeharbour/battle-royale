// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const INITIAL_SEED = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";


async function main() {

  const [owner, player1, player2, player3, player4] = await ethers.getSigners(); 

  // const MapWOT = await hre.ethers.getContractFactory('MapWOT');
  // const mapWOT = await MapWOT.deploy(owner.address);
  // await mapWOT.deployed();

  const map = hre.ethers.deployContract("MapWOT", [INITIAL_SEED])
  await map.waitForDeployment();

  console.log(JSON.stringify(map))

  console.log( `MapWOT contract deployed by ${owner.address} to ${map.target} in block .` )

  // const GameWOT = await hre.ethers.getContractFactory('GameWOT');
  // const gameWOT = await GameWOT.deploy(mapWOT.address);
  // await gameWOT.deployed();
  // console.log( `GameWOT contract deployed by ${owner.address} to ${gameWOT.address} in block ${gameWOT.deployTransaction.blockNumber}.` )

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
