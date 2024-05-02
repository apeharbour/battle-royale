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
  const player1 = "0xC71E2f803586D2Fe6ddCF1243EB14A6A1705D0A0";

  const deployedAddresses = {
    "BattleRoyale#MapPunk": "0xf853df199B698Ee23BDB6CCc13176615457C69BF",
    "BattleRoyale#Punkships": "0xcc846Eb3b8f3f6c2EEd7B42C52Eaf3d130EB9d83",
    "BattleRoyale#GamePunk": "0xB275d5115edcC905944Da33E1eE63b7618CC87A1",
    "BattleRoyale#RegistrationPunk": "0x8b39fE32c7f1415d645D5a3D6bDe734e23A221D6"
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

const registerPlayer = async(shipId, player) => {
  await registration.connect(player)
    .registerPlayer(shipId)
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(`Registered ${player.address} with ship ${shipId} in block ${receipt.blockNumber}.`);
    })
    .catch(console.error);
}

await registerPlayer(0, "0xCd9680dd8318b0df924f0bD47a407c05B300e36f");
await registerPlayer(1, "0xC71E2f803586D2Fe6ddCF1243EB14A6A1705D0A0");


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
