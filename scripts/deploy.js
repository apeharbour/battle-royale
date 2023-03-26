// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  
  const Map = await hre.ethers.getContractFactory("Map");
  const map = await Map.deploy(1, '0x6d1eb51dE3D3870CF8AF27cFE95CEd96c68aBF42');

  await map.deployed();
  console.log( `Map deployed to ${map.address}` )

  map.getCell(0, -1).then(console.log).catch(console.error)
  map.getCell(1, -1).then(console.log).catch(console.error)

  map.getCell(-1, 0).then(console.log).catch(console.error)
  map.getCell(0, 0).then(console.log).catch(console.error)
  map.getCell(1, 0).then(console.log).catch(console.error)

  map.getCell(0, 1).then(console.log).catch(console.error)
  map.getCell(1, 1).then(console.log).catch(console.error)

  map.getCell(-5, 5).then(r => {console.log('r:', r, 'type:', typeof(r))}).catch(console.error)
  
  // console.log(`new random value: ${Number(result)}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
