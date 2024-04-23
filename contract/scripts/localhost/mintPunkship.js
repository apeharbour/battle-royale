// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const deployedAddresses = require("../../ignition/deployments/chain-1337/deployed_addresses.json")

async function main() {
  const [owner, player1, player2, player3, player4] = await ethers.getSigners();

  const punkships = await hre.ethers.getContractAt(
    "Punkships",
    deployedAddresses["BattleRoyale#Punkships"]
  );

  const SHIPS_TO_MINT = 3;

  const mintShips = async (numberToMint, owner) => {
    const mintResponses = [...Array(numberToMint).keys()].map((i) =>
      punkships.safeMint(owner)
    )

    const mintReceipts = mintResponses.map((tx) => tx.then((tx) => tx.wait()));

    const results = await Promise.all(mintReceipts);

    const blocks = results.map((receipt) => receipt.blockNumber);

    console.log(`Minted ${results.length} ships to ${owner.address} in blocks ${blocks}.`);
  };

  await mintShips(SHIPS_TO_MINT, owner)
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
