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

async function main() {
  const [owner, player1, player2, player3, player4] = await ethers.getSigners();

  const deployedAddresses = {
    "BattleRoyale#MapPunk": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "BattleRoyale#Punkships": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "BattleRoyale#GamePunk": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "BattleRoyale#RegistrationPunk": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  }

  const game = await hre.ethers.getContractAt(
    "GamePunk",
    deployedAddresses["BattleRoyale#GamePunk"]
  );

  const shortenAddress = (address) => {
    return address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length);
  }

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
        console.log(`Committed move for ${shortenAddress(player.address)} in block ${receipt.blockNumber} with hash ${shortenAddress(moveHash)}.`);
      })
      .catch(console.error);
    
    return moveHash;
  }

  const players = [player1, player2, player4];

  const travels = [
    { direction: dir.E, distance: 1 },
    { direction: dir.W, distance: 1 },
    { direction: dir.E, distance: 1 },
  ];

  const shots = [
    { direction: dir.W, distance: 1 },
    { direction: dir.W, distance: 1 },
    { direction: dir.W, distance: 1 },
  ];

  // commit moves
  let hashes = [];
  for (let i = 0; i < players.length; i++) {
    hashes[i] = commitMove(players[i], travels[i], shots[i], SALT, GAME_ID);
  }

  await Promise.all(hashes);


  // submit moves
  const travelDirs = [travels[0].direction, travels[1].direction, travels[2].direction];
  const travelDists = [travels[0].distance, travels[1].distance, travels[2].distance];
  const shotDirs = [shots[0].direction, shots[1].direction, shots[2].direction];
  const shotDists = [shots[0].distance, shots[1].distance, shots[2].distance];
  const secrets = [SALT, SALT, SALT];
  const playerAddresses = [players[0].address, players[1].address, players[2].address];

  await game.submitMove(travelDirs, travelDists, shotDirs, shotDists, secrets, playerAddresses, GAME_ID);
  console.log(`Submitted moves for ${players.length} players.`);

  await game.updateWorld(1)
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(`Updated world in block ${receipt.blockNumber}.`);
    })
    .catch(console.error);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});