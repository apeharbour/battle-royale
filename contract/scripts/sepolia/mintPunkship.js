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
    "BattleRoyale#MapPunk": "0x08472F16772BFdF63d29808A7b5F397115FFB249",
    "BattleRoyale#Punkships": "0xA17f71EB576fEd77296b58E7FD503c8ECc0B4028",
    "BattleRoyale#GamePunk": "0x62e246444f8af3BB010d3d6D9E9b17D2330225ca",
    "BattleRoyale#RegistrationPunk":
      "0xd60fC37C9bD107D069ad35afc745D426B8646C57",
  };

    const customAddresses = [
      "0xCd9680dd8318b0df924f0bD47a407c05B300e36f",
      "0xC71E2f803586D2Fe6ddCF1243EB14A6A1705D0A0",
      "0x7156156e73835176d37922b071c80d6cC722A943",
      "0x3d7c5b15742210A01a3ac63Fb2b981B687d41474",
    ];

  const punkships = await hre.ethers.getContractAt(
    "Punkships",
    deployedAddresses["BattleRoyale#Punkships"]
  );

  const SHIPS_TO_MINT = 2;

  const mintShips = async (numberToMint, owner) => {
    const mints = [...Array(numberToMint).keys()].map((i) =>
      punkships.safeMint(owner)
    )

    console.log(mints);

    // const receipts = mints.map((tx) => tx.wait()).catch(console.error);
    // console.log(receipts);

    const results = await Promise.all(mints);

    console.log(results);



      // {
        
      //   console.log(`Minted ${txs.length} ships to ${owner.address}`);
      //   console.log(txs);
      // })
      // .catch(console.error);

    // {

    //   <Pattern
    //   id={`pat-water${i}`}
    //   link={images[`water${i}`]}
    //   size={waterSize}
    //   key={`pat-w-${i}`}
    //   />
    // })

    // for (let i = 0; i < numberToMint; i++) {
    //   await punkships
    //     .safeMint(owner)
    //     .then((tx) => {
    //       return tx.wait();
    //     })
    //     .then((receipt) => {
    //       console.log(`Minted punkship in block ${receipt.blockNumber} to ${owner.address}.`);
    //     })
    //     .catch(console.error);
    // }
  };

  // await mintShips(SHIPS_TO_MINT, owner)
  // await mintShips(SHIPS_TO_MINT, player1)
  // await mintShips(SHIPS_TO_MINT, player2)
  // await mintShips(SHIPS_TO_MINT, player3)
  // await mintShips(SHIPS_TO_MINT, player4)

  await mintShips(SHIPS_TO_MINT, customAddresses[0])
  await mintShips(SHIPS_TO_MINT, customAddresses[1])
  await mintShips(SHIPS_TO_MINT, customAddresses[2])
  await mintShips(SHIPS_TO_MINT, customAddresses[3])
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
