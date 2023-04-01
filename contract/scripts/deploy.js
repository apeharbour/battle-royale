// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const [owner] = await ethers.getSigners();

  const RADIUS = 10
  
  const Map = await hre.ethers.getContractFactory("Map");
  const map = await Map.deploy(RADIUS, owner.address);

  await map.deployed();
  const radius = await map.size()
  console.log( `Map with radius ${radius} deployed by ${owner.address} to ${map.address}` )

  await map.initMap()
  console.log('Map initialized')

  await map.createIslands()
  console.log('Islands created')

  // map.getCell(1, 0).then(c => {console.log('(1,0)', c)}).catch(console.error)
  // map.getCell(2, 0).then(c => {console.log('(2,0)', c)}).catch(console.error)

  // map.getCell(0, 1).then(c => {console.log('(0,1)', c)}).catch(console.error)
  // map.getCell(1, 1).then(c => {console.log('(1,1)', c)}).catch(console.error)
  // map.getCell(2, 1).then(c => {console.log('(2,1)', c)}).catch(console.error)
  
  // map.getCell(0, 2).then(c => {console.log('(0,2)', c)}).catch(console.error)
  // map.getCell(1, 2).then(c => {console.log('(1,2)', c)}).catch(console.error)
  
  // map.getCell(RADIUS, RADIUS).then(c => {console.log(`(${RADIUS},${RADIUS}), ${c}`)}).catch(console.error)

  // const c = await map.getCell(RADIUS, RADIUS)
  // console.log(`Radius 0: ${c}`)
  
  // for (let i=1; i<=RADIUS; i++) {
  //   console.log('')
  //   const cells = await map.ring({q: RADIUS, r: RADIUS}, i)
  //   for (let j=0; j<cells.length; j++) {
  //     const c = await map.getCell(cells[j].q, cells[j].r)
  //     console.log(`Radius ${i}: ${c}`)
  //   }
  // }

  // map.getCell(-5, 5).then(r => {console.log('r:', r, 'type:', typeof(r))}).catch(console.error)
  
  // console.log(`new random value: ${Number(result)}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
