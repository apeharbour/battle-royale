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
    "BattleRoyale#Punkships": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  };

  const punkships = await hre.ethers.getContractAt(
    "Punkships",
    deployedAddresses["BattleRoyale#Punkships"]
  );

  const SHIPS_TO_MINT = 5;

  const mintShips = async (numberToMint, owner) => {
    for (let i = 0; i < numberToMint; i++) {
      await punkships
        .safeMint(owner)
        .then((tx) => {
          return tx.wait();
        })
        .then((receipt) => {
          console.log(`Minted punkship in block ${receipt.blockNumber} to ${owner.address}.`);
        })
        .catch(console.error);
    }
  };

  await mintShips(SHIPS_TO_MINT, player1)
  await mintShips(SHIPS_TO_MINT, player2)
  await mintShips(SHIPS_TO_MINT, player3)
  await mintShips(SHIPS_TO_MINT, player4)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
