const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const INITIAL_SEED = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const map = await ethers.deployContract("MapPunk", [INITIAL_SEED]);
  await map.waitForDeployment();
  console.log("Map address:", await map.getAddress());

  const game = await ethers.deployContract("GamePunk", [map.getAddress()]);
  await game.waitForDeployment();
  console.log("Game address:", await game.getAddress());

  const registration = await ethers.deployContract("RegistrationPunk", [game.getAddress()]);
  await registration.waitForDeployment();
  console.log("Registration address:", await registration.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });