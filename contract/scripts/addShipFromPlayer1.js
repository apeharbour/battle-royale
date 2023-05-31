// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const [owner, player1] = await ethers.getSigners();

  // Deploy random library
  // const RandomLib = await hre.ethers.getContractFactory('Random')
  // const randomLib = await RandomLib.deploy()
  
  const GAME_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const game = await hre.ethers.getContractAt("Game", GAME_ADDRESS, player1);
    
    await game.addShip()

    // const ships = await game.getShips()

    // console.log(ships)

    // const ship = await game.ships(player1.address)

    // console.log(`Added ship for ${player1.address} at ${ship}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
