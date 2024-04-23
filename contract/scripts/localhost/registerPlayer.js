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

  const registration = await hre.ethers.getContractAt(
    "RegistrationPunk",
    deployedAddresses["BattleRoyale#RegistrationPunk"]
  );

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

  // await registerPlayer(1, player1);
  await registerPlayer(2, player2);
  await registerPlayer(3, player3);
  await registerPlayer(4, player4);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
