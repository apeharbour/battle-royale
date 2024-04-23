// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const SHIPS_TO_MINT = 1;

const MAX_PLAYERS = 4;
const RADIUS = 5;

const deployedAddresses = {
  "BattleRoyale#MapPunk": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "BattleRoyale#Punkships": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  "BattleRoyale#GamePunk": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "BattleRoyale#RegistrationPunk": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
}

const shortenAddress = (address) => {
  return address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length);
}

const mintShips = async (contract, numberToMint, owner) => {
  for (let i = 0; i < numberToMint; i++) {
    await contract
      .safeMint(owner)
      .then((tx) => {
        return tx.wait();
      })
      .then((receipt) => {
        console.log(`Minted punkship in block ${receipt.blockNumber} to ${shortenAddress(owner.address)}.`);
      })
      .catch(console.error);
  }
};

const startRegistration = async (contract) => {
  await contract
    .startRegistration()
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(`Started registration in block ${receipt.blockNumber}.`);
    })
    .catch(console.error);
}

const registerPlayer = async(contract, shipId, player) => {
  await contract.connect(player)
    .registerPlayer(shipId)
    .then((tx) => {
      return tx.wait();
    })
    .then((receipt) => {
      console.log(`Registered ${shortenAddress(player.address)} with ship ${shipId} in block ${receipt.blockNumber}.`);
    })
    .catch(console.error);
}

const closeRegistration = async (contract, maxPlayers, radius) => {
  await contract
  .closeRegistration(maxPlayers, radius)
  .then((tx) => {
    return tx.wait();
  })
  .then((receipt) => {
    console.log(`Closed registration in block ${receipt.blockNumber}.`);
  })
  .catch(console.error);
}

async function main() {
  const [owner, player1, player2, player3, player4] = await ethers.getSigners();


  const punkships = await hre.ethers.getContractAt(
    "Punkships",
    deployedAddresses["BattleRoyale#Punkships"]
  );

  const registration = await hre.ethers.getContractAt(
    "RegistrationPunk",
    deployedAddresses["BattleRoyale#RegistrationPunk"]
  );

  await mintShips(punkships, SHIPS_TO_MINT, owner)
  await mintShips(punkships, SHIPS_TO_MINT, player1)
  await mintShips(punkships, SHIPS_TO_MINT, player2)
  await mintShips(punkships, SHIPS_TO_MINT, player3)
  await mintShips(punkships, SHIPS_TO_MINT, player4)

  await startRegistration(registration)

  await registerPlayer(registration, 1, player1);
  await registerPlayer(registration, 2, player2);
  await registerPlayer(registration, 3, player3);
  await registerPlayer(registration, 4, player4);

  await closeRegistration(registration, MAX_PLAYERS, RADIUS)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
