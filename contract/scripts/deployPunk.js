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
  
  // const MapWT = await hre.ethers.getContractFactory('MapWT');
  // const mapWT = await MapWT.deploy(owner.address);
  // await mapWT.deployed();
  // console.log( `MapWT contract deployed by ${owner.address} to ${mapWT.address}` )

  const MapPunk = await hre.ethers.getContractFactory('MapPunk');
  const mapPunk = await MapPunk.deploy(owner.address);
  await mapPunk.deployed();
  console.log( `MapPunk contract deployed by ${owner.address} to ${mapPunk.address}` )

  // const MapNP = await hre.ethers.getContractFactory('MapNP');
  // const mapNP = await MapNP.deploy(owner.address);
  // await mapNP.deployed();
  // console.log( `MapNP contract deployed by ${owner.address} to ${mapNP.address}` )
  
  // const GameWT = await hre.ethers.getContractFactory('GameWT');
  // const gameWT = await GameWT.deploy(mapWT.address);
  // await gameWT.deployed();
  // console.log( `GameWT contract deployed by ${owner.address} to ${gameWT.address}` )

  const GamePunk = await hre.ethers.getContractFactory('GamePunk');
  const gamePunk = await GamePunk.deploy(mapPunk.address);
  await gamePunk.deployed();
  console.log( `GamePunk contract deployed by ${owner.address} to ${gamePunk.address}` )

  // const GameNP = await hre.ethers.getContractFactory('GameNP');
  // const gameNP = await GameNP.deploy(mapNP.address);
  // await gameNP.deployed();
  // console.log( `GameNP contract deployed by ${owner.address} to ${gameNP.address}` )

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
