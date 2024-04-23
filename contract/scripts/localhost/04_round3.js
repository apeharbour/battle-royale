// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const deployedAddresses = require("../../ignition/deployments/chain-1337/deployed_addresses.json")

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

const shortenAddress = (address) => {
  return address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length);
}

const commitMove = async (contract, player, travel, shot, salt, gameId) => {
  const moveHash = ethers.solidityPackedKeccak256(
    ["uint8", "uint8", "uint8", "uint8", "uint8", "address"],
    [travel.direction, travel.distance, shot.direction, shot.distance, salt, player.address]
  );

  await contract.connect(player)
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

const submitMoves = async (contract, players, travels, shots, salt, gameId) => {

  const travelDirs = travels.map((travel) => travel.direction);
  const travelDists = travels.map((travel) => travel.distance);
  const shotDirs = shots.map((shot) => shot.direction);
  const shotDists = shots.map((shot) => shot.distance);
  const secrets = Array(players.length).fill(salt);
  const playerAddresses = players.map((player) => player.address);

  await contract
    .submitMove(travelDirs, travelDists, shotDirs, shotDists, secrets, playerAddresses, gameId)
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(`Revealed moves for ${players.length} players in block ${receipt.blockNumber}`);
    })
    .catch(console.error);
}

const updateWorld = async (contract, gameId) => {
  await contract
    .updateWorld(gameId)
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(`Updated world ${gameId} in block ${receipt.blockNumber}`);
    })
    .catch(console.error);
}

async function main() {
  const [owner, player1, player2, player3, player4] = await ethers.getSigners();

  const game = await hre.ethers.getContractAt(
    "GamePunk",
    deployedAddresses["BattleRoyale#GamePunk"]
  );

  const players = [player1, player2, player4];

  const travels = [
    { direction: dir.E, distance: 1 },
    { direction: dir.E, distance: 1 },
    { direction: dir.E, distance: 1 },
  ];

  const shots = [
    { direction: dir.W, distance: 2 },
    { direction: dir.W, distance: 2 },
    { direction: dir.W, distance: 2 },
  ];


  await commitMove(game, players[0], travels[0], shots[0], SALT, GAME_ID);
  await commitMove(game, players[1], travels[1], shots[1], SALT, GAME_ID);
  await commitMove(game, players[2], travels[2], shots[2], SALT, GAME_ID);

  await submitMoves(game, players, travels, shots, SALT, GAME_ID);

  await updateWorld(game, GAME_ID);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
