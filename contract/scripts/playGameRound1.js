// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const EAST = 0;
const NORTH_EAST = 1;
const NORTH_WEST = 2;
const WEST = 3;
const SOUTH_WEST = 4;
const SOUTH_EAST = 5;
const NO_MOVE = 6;

const SPEED = 1;
const RANGE = 1;

const RADIUS = 5;
const GAME_ID = 1;
const INITIAL_SEED = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const GAME_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function main() {
  const [owner, player1, player2, player3, player4] = await ethers.getSigners();

  const game = await hre.ethers.getContractAt("GameWOT", GAME_ADDRESS);

  // start new game GAME_ID
  await game
    .startNewGame(GAME_ID)
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(`Started game ${GAME_ID} in block ${receipt.blockNumber}.`);
    })
    .catch(console.error);

  // init with radius RADIUS
  await game
    .initGame(RADIUS, GAME_ID)
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(
        `Initialized game ${GAME_ID} with radius ${RADIUS} in block ${receipt.blockNumber}.`
      );
    })
    .catch(console.error);

  // add players 1-4

  await game.connect(player1).addShip(GAME_ID, SPEED, RANGE).then((tx) => { return tx.wait(); }) .then((receipt) => { console.log( `Added player ${player1.address} in block ${receipt.blockNumber}.` ); }) .catch(console.error);
  await game.connect(player2).addShip(GAME_ID, SPEED, RANGE).then((tx) => { return tx.wait(); }) .then((receipt) => { console.log( `Added player ${player2.address} in block ${receipt.blockNumber}.` ); }) .catch(console.error);
  await game.connect(player3).addShip(GAME_ID, SPEED, RANGE).then((tx) => { return tx.wait(); }) .then((receipt) => { console.log( `Added player ${player3.address} in block ${receipt.blockNumber}.` ); }) .catch(console.error);
  await game.connect(player4).addShip(GAME_ID, SPEED, RANGE).then((tx) => { return tx.wait(); }) .then((receipt) => { console.log( `Added player ${player4.address} in block ${receipt.blockNumber}.` ); }) .catch(console.error);
  
  // allow move submission
  await game
    .allowSubmitMoves(GAME_ID)
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(`Allow move submission in block ${receipt.blockNumber}.`);
    })
    .catch(console.error);

  // moves round 1
  tx = [];
  tx[0] = game.connect(player1).revealMove(EAST, 2, SOUTH_WEST, 1, GAME_ID);
  tx[1] = game.connect(player2).revealMove(NORTH_EAST, 2, WEST, 5, GAME_ID);
  tx[2] = game
    .connect(player3)
    .revealMove(NORTH_WEST, 1, SOUTH_WEST, 1, GAME_ID);
  tx[3] = game.connect(player4).revealMove(NORTH_EAST, 2, EAST, 5, GAME_ID);

  tx = await Promise.all(tx);
  tx = await Promise.all(
    tx.map((tx) => {
      return tx.wait();
    })
  );

  tx.forEach((receipt) => {
    console.log("Submitted move in block", receipt.blockNumber);
  });

  // update world
  await game
    .updateWorld(GAME_ID)
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
