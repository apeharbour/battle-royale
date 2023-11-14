
const hre = require("hardhat");

async function main() {

  const [owner] = await ethers.getSigners(); 

  const MapPunk = await hre.ethers.getContractFactory('MapPunk');
  const mapPunk = await MapPunk.deploy(owner.address);
  await mapPunk.deployed();
  console.log( `MapPunk contract deployed by ${owner.address} to ${mapPunk.address}` )

  const GamePunk = await hre.ethers.getContractFactory('GamePunk');
  const gamePunk = await GamePunk.deploy(mapPunk.address);
  await gamePunk.deployed();
  console.log( `GamePunk contract deployed by ${owner.address} to ${gamePunk.address}` )

  const RegistrationPunk = await hre.ethers.getContractFactory('RegistrationPunk');
  const registrationPunk = await RegistrationPunk.deploy(gamePunk.address);
  await registrationPunk.deployed();
  console.log(`Registration contract for Punk Ships deployed by ${owner.address} to ${registrationPunk.address}`)


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
