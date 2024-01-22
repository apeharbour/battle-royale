const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const GAME_ADDRESS = "0x47f321419Aa908bcb090BBF4dc8E9Fc72c47358f";


  const registration = await ethers.deployContract("RegistrationPunk", [GAME_ADDRESS]);
  await registration.waitForDeployment();
  console.log("Registration address:", await registration.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });