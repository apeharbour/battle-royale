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
const GAME_ID = 4

const deployedAddresses = {
 "BattleRoyale#MapPunk": "0x37C9C3C18D5BD93224C2fF808C9dA7564c9694E5",
"BattleRoyale#Punkships": "0x595ecB1DbeDaDEB7703c5e98Fd5E3b6DcB87A1e2",
"BattleRoyale#GamePunk": "0xcf79eB6013F05b6EF445cD9ddf1C60179DfF434e",
"BattleRoyale#RegistrationPunk": "0x2Ab37C7D1acd2BF04Da5Df57Aa3A0950479f305D",
}

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
  // const [owner, player1, player2, player3, player4] = await ethers.getSigners();

  const [owner, player1] = await ethers.getSigners();

  const game = await hre.ethers.getContractAt(
    "GamePunk",
    deployedAddresses["BattleRoyale#GamePunk"],
    owner
  );

  // const players = [player1, player2, player3, player4];
  const players = [owner, player1];

  // const travels = [
  //   { direction: dir.NE, distance: 3 },
  //   { direction: dir.SE, distance: 3 },
  //   { direction: dir.E, distance: 1 },
  //   { direction: dir.NW, distance: 1 },
  // ];

  // const shots = [
  //   { direction: dir.W, distance: 1 },
  //   { direction: dir.E, distance: 2 },
  //   { direction: dir.E, distance: 1 },
  //   { direction: dir.NW, distance: 2 },
  // ];

  const travels = [
    { direction: dir.SW, distance: 2 },
    { direction: dir.NE, distance: 3 },
  ];

  const shots = [
    { direction: dir.W, distance: 1 },
    { direction: dir.E, distance: 2 },
  ];


  // await commitMove(game, players[0], travels[0], shots[0], SALT, GAME_ID);
  // await commitMove(game, players[1], travels[1], shots[1], SALT, GAME_ID);
  // await commitMove(game, players[2], travels[2], shots[2], SALT, GAME_ID);
  // await commitMove(game, players[3], travels[3], shots[3], SALT, GAME_ID);

  for (let i = 0; i < players.length; i++) {
    await commitMove(game, players[i], travels[i], shots[i], SALT, GAME_ID);
  }

  await submitMoves(game, players, travels, shots, SALT, GAME_ID);

  await updateWorld(game, GAME_ID);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
