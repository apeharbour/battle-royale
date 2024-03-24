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
    "BattleRoyale#MapPunk": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "BattleRoyale#Punkships": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "BattleRoyale#GamePunk": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "BattleRoyale#RegistrationPunk": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  }

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

  await registerPlayer(1, player1);
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
