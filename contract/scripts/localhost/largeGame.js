// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.


const hre = require("hardhat");

const deployedAddresses = require("../../ignition/deployments/chain-1337/deployed_addresses.json")

const SHIPS_TO_MINT = 1;

const MAX_PLAYERS = 20;
const RADIUS = 8;


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
  // const [owner, player1, player2, player3, player4] = await ethers.getSigners();
  const players = await ethers.getSigners();
  const owner = players.shift();


  const punkships = await hre.ethers.getContractAt(
    "Punkships",
    deployedAddresses["BattleRoyale#Punkships"]
  );

  const registration = await hre.ethers.getContractAt(
    "RegistrationPunk",
    deployedAddresses["BattleRoyale#RegistrationPunk"]
  );

  const tx = await punkships.safeMint(owner.address)
  await tx.wait()

  for (let i = 0; i < players.length; i++) {
    const tx = await punkships.safeMint(players[i].address)
    const receipt = await tx.wait()
    console.log(`Minted for ${players[i].address} in block ${receipt.blockNumber}`)
  }

  // await mintShips(punkships, SHIPS_TO_MINT, owner)
  // await players.forEach(async (player) => { 
  //   const tx = await punkships.safeMint(player.address)
  //   await tx.wait()

  //   // mintShips(punkships, SHIPS_TO_MINT, player)
  // })
  console.log("Minted ships for all players")

  // checking if all players have ships
  // for (let i = 0; i < players.length + 1; i++) {
  //   const ownerOf = await punkships.ownerOf(i )
  //   console.log(`Owner of ship ${i} is ${shortenAddress(ownerOf)}`)
  // }

  // await mintShips(punkships, SHIPS_TO_MINT, owner)
  // await mintShips(punkships, SHIPS_TO_MINT, player1)
  // await mintShips(punkships, SHIPS_TO_MINT, player2)
  // await mintShips(punkships, SHIPS_TO_MINT, player3)
  // await mintShips(punkships, SHIPS_TO_MINT, player4)

  await startRegistration(registration)

  for (let i = 0; i < players.length; i++) {
    const tx = await registration.connect(players[i]).registerPlayer(i + 1)
    const receipt = await tx.wait()
    console.log(`Registered ${shortenAddress(players[i].address)} with ship ${i + 1} in block ${receipt.blockNumber}`)
  }

  // const registrations = players.map((player, i) => registerPlayer(registration, i + 1, player))
  // await Promise.all(registrations)
  // await registerPlayer(registration, 1, player1);
  // await registerPlayer(registration, 2, player2);
  // await registerPlayer(registration, 3, player3);
  // await registerPlayer(registration, 4, player4);

  await closeRegistration(registration, MAX_PLAYERS, RADIUS)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
