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

const deployedAddresses = require("../../ignition/deployments/chain-1337/deployed_addresses.json")

async function main() {
  const [owner, player1, player2, player3, player4] = await ethers.getSigners();

  const game = await hre.ethers.getContractAt(
    "GamePunk",
    deployedAddresses["BattleRoyale#GamePunk"]
  );

  const commitMove = async (player, travel, shot, salt, gameId) => {
    const moveHash = ethers.solidityPackedKeccak256(
      ["uint8", "uint8", "uint8", "uint8", "uint8", "address"],
      [travel.direction, travel.distance, shot.direction, shot.distance, salt, player.address]
    );

    await game.connect(player)
      .commitMove(moveHash, gameId)
      .then((tx) => {
        return tx.wait();
      })
      .then((receipt) => {
        console.log(`Committed move for ${player.address} in block ${receipt.blockNumber} with hash ${moveHash}.`);
      })
      .catch(console.error);
    
    return moveHash;
  }

  let hashes = [];
  hashes[0] = commitMove(player1, { direction: dir.NE, distance: 3 }, { direction: dir.W, distance: 1 }, SALT, GAME_ID);
  hashes[2] = commitMove(player2, { direction: dir.SE, distance: 3 }, { direction: dir.E, distance: 2 }, SALT, GAME_ID);
  hashes[3] = commitMove(player3, { direction: dir.E, distance: 1 }, { direction: dir.E, distance: 1 }, SALT, GAME_ID);
  hashes[4] = commitMove(player4, { direction: dir.NW, distance: 1 }, { direction: dir.NW, distance: 2 }, SALT, GAME_ID);

  await Promise.all(hashes);
  console.log("All moves committed.");
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
