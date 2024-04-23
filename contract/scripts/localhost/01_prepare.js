// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.


const hre = require("hardhat");

const deployedAddresses = require("../../ignition/deployments/chain-1337/deployed_addresses.json")

const SHIPS_TO_MINT = 1;

const MAX_PLAYERS = 4;
const RADIUS = 5;


const shortenAddress = (address) => {
  return address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length);
}

const mintShips = async (contract, numberToMint, owner) => {
    const mintResponses = [...Array(numberToMint).keys()].map((i) =>
      contract.safeMint(owner)
    )

    const mintReceipts = mintResponses.map((tx) => tx.then((tx) => tx.wait()));

    const results = await Promise.all(mintReceipts);

    const blocks = results.map((receipt) => receipt.blockNumber);

    console.log(`Minted ${results.length} ships to ${shortenAddress(owner.address)} in blocks ${blocks}.`);
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
