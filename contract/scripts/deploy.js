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

  const MapWOT = await hre.ethers.getContractFactory('MapWOT');
  const mapWOT = await MapWOT.deploy(owner.address);
  await mapWOT.deployed();
  console.log( `MapWOT contract deployed by ${owner.address} to ${mapWOT.address}` )

  // const MapNP = await hre.ethers.getContractFactory('MapNP');
  // const mapNP = await MapNP.deploy(owner.address);
  // await mapNP.deployed();
  // console.log( `MapNP contract deployed by ${owner.address} to ${mapNP.address}` )
  
  // const GameWT = await hre.ethers.getContractFactory('GameWT');
  // const gameWT = await GameWT.deploy(mapWT.address);
  // await gameWT.deployed();
  // console.log( `GameWT contract deployed by ${owner.address} to ${gameWT.address}` )

  const GameWOT = await hre.ethers.getContractFactory('GameWOT');
  const gameWOT = await GameWOT.deploy(mapWOT.address);
  await gameWOT.deployed();
  console.log( `GameWOT contract deployed by ${owner.address} to ${gameWOT.address}` )

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
