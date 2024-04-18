// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const [owner, player1, player2, player3, player4] = await ethers.getSigners();

    const deployedAddresses = {
      "BattleRoyale#MapPunk": "0x37C9C3C18D5BD93224C2fF808C9dA7564c9694E5",
      "BattleRoyale#Punkships": "0x595ecB1DbeDaDEB7703c5e98Fd5E3b6DcB87A1e2",
      "BattleRoyale#GamePunk": "0xcf79eB6013F05b6EF445cD9ddf1C60179DfF434e",
      "BattleRoyale#RegistrationPunk": "0x2Ab37C7D1acd2BF04Da5Df57Aa3A0950479f305D"
    }

    const customAddresses = [
      "0xCd9680dd8318b0df924f0bD47a407c05B300e36f",
      "0xC71E2f803586D2Fe6ddCF1243EB14A6A1705D0A0",
    ];

  const punkships = await hre.ethers.getContractAt(
    "Punkships",
    deployedAddresses["BattleRoyale#Punkships"]
  );

  const SHIPS_TO_MINT = 1;

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

  // await mintShips(SHIPS_TO_MINT, owner)
  // await mintShips(SHIPS_TO_MINT, player1)
  // await mintShips(SHIPS_TO_MINT, player2)
  // await mintShips(SHIPS_TO_MINT, player3)
  // await mintShips(SHIPS_TO_MINT, player4)

  await mintShips(SHIPS_TO_MINT, customAddresses[0])
  await mintShips(SHIPS_TO_MINT, customAddresses[1])
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
