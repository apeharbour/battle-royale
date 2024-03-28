// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const [owner, player1, player2, player3, player4] = await ethers.getSigners();

  const owner = "0xCd9680dd8318b0df924f0bD47a407c05B300e36f";

  const deployedAddresses = {
    "BattleRoyale#MapPunk": "0x6186dbAe6FAe67EeEC521EaBe54bd28Eb4A22Aba",
    "BattleRoyale#Punkships": "0xaC12Ba65FFEc95078B763d72c9c9B91A2981826d",
    "BattleRoyale#GamePunk": "0xbd4118becfB663aF6C376e27Fa9370a1177B43B4",
    "BattleRoyale#RegistrationPunk": "0x782dF245894951A9cCbD31401e84267Ec52c1911"
  }


  const registration = await hre.ethers.getContractAt(
    "RegistrationPunk",
    deployedAddresses["BattleRoyale#RegistrationPunk"]
  );

  await registration
    .startRegistration()
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(`Started registration in block ${receipt.blockNumber}.`);
    })
    .catch(console.error);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
