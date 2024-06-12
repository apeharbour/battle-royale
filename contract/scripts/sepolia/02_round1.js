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

const SALT = 1;
const GAME_ID = 5;

const deployedAddresses = {
  "BattleRoyale#MapPunk": "0x08472F16772BFdF63d29808A7b5F397115FFB249",
  "BattleRoyale#Punkships": "0xA17f71EB576fEd77296b58E7FD503c8ECc0B4028",
  "BattleRoyale#GamePunk": "0x62e246444f8af3BB010d3d6D9E9b17D2330225ca",
  "BattleRoyale#RegistrationPunk": "0xd60fC37C9bD107D069ad35afc745D426B8646C57"
};

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
  const ownerAddress = "0xCd9680dd8318b0df924f0bD47a407c05B300e36f";
  const player1Address = "0xC71E2f803586D2Fe6ddCF1243EB14A6A1705D0A0";

  const owner = await ethers.getSigner(ownerAddress);
  const player1 = await ethers.getSigner(player1Address);

  const game = await hre.ethers.getContractAt(
    "GamePunk",
    deployedAddresses["BattleRoyale#GamePunk"],
    owner
  );

  const players = [owner, player1];

  const travels = [
    { direction: dir.E, distance: 2 },
    { direction: dir.E, distance: 3 },
  ];

  const shots = [
    { direction: dir.E, distance: 1 },
    { direction: dir.E, distance: 2 },
  ];

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
