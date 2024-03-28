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
      "BattleRoyale#MapPunk": "0x6186dbAe6FAe67EeEC521EaBe54bd28Eb4A22Aba",
      "BattleRoyale#Punkships": "0xaC12Ba65FFEc95078B763d72c9c9B91A2981826d",
      "BattleRoyale#GamePunk": "0xbd4118becfB663aF6C376e27Fa9370a1177B43B4",
      "BattleRoyale#RegistrationPunk": "0x782dF245894951A9cCbD31401e84267Ec52c1911"
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

  // await mintShips(SHIPS_TO_MINT, player1)
  // await mintShips(SHIPS_TO_MINT, player2)
  // await mintShips(SHIPS_TO_MINT, player3)
  // await mintShips(SHIPS_TO_MINT, player4)
  // await mintShips(SHIPS_TO_MINT, owner)

   // Mint ships for each custom address
   for (const address of customAddresses) {
    await mintShips(SHIPS_TO_MINT, address);
}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
