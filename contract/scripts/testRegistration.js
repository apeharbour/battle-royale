// Import ethers from Hardhat package
const { ethers } = require("hardhat");

async function main() {
    // Get the contract's deployed instance
    const registrationPunk = await ethers.getContractAt("RegistrationPunk", "<Your_Contract_Address>");

    // Example: Call startRegistration
    console.log("Starting registration...");
    const startTx = await registrationPunk.startRegistration();
    await startTx.wait(); // Wait for the transaction to be mined
    console.log("Registration started.");

    // Example: Register a player
    console.log("Registering a player...");
    const registerTx = await registrationPunk.registerPlayer(5, 10); // Use your desired speed and range values
    await registerTx.wait(); // Wait for the transaction to be mined
    console.log("Player registered.");

    // Example: Close registration
    console.log("Closing registration...");
    const closeTx = await registrationPunk.closeRegistration();
    await closeTx.wait(); // Wait for the transaction to be mined
    console.log("Registration closed.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
