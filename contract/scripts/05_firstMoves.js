// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [owner, player1, player2, player3, player4] = await ethers.getSigners();

  const deployedAddresses = {
    "BattleRoyale#MapPunk": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "BattleRoyale#Punkships": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "BattleRoyale#GamePunk": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "BattleRoyale#RegistrationPunk": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  }

  const registration = await hre.ethers.getContractAt(
    "RegistrationPunk",
    deployedAddresses["BattleRoyale#RegistrationPunk"]
  );

  const game = await hre.ethers.getContractAt(
    "GamePunk",
    deployedAddresses["BattleRoyale#GamePunk"]
  );

  const MAX_PLAYERS = 4;
  const RADIUS = 5;

  const commitMove = async (player, travel, shot, salt, gameId) => {
    const moveHash = ethers.solidityPackedKeccak256(
      ["uint8", "uint8", "uint8", "uint8", "uint256"],
      [travel.direction, travel.distance, shot.direction, shot.distance, BigInt(salt)]
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
  hashes[0] = commitMove(player1, { direction: 1, distance: 1 }, { direction: 1, distance: 1 }, 1, BigInt(1));
  hashes[1] = commitMove(player2, { direction: 0, distance: 1 }, { direction: 0, distance: 1 }, 2, BigInt(1));

  await Promise.all(hashes);
  console.log("All moves committed.");

  console.log("Player1 address: ", player1.address);
  console.log("Player2 address: ", player2.address);

  await game.submitMove([1, 0], [1, 1], [1, 0], [1, 1], [1, 2], [player1.address, player2.address], BigInt(1))
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
