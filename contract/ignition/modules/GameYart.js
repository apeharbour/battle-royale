const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const INITIAL_SEED = "0xEeCCd3Ac0314324CEc33780f84880E5bD683447C";

const KMS_ADDRESS = "0x8Ae2f5d479b2C742e2a02E6A5334059765e07a1A";

module.exports = buildModule("BattleRoyale", (m) => {
  const maxSupply = 8900n;

  //Library
  const cellData = m.library("CellData");

  // Deploy the contracts
  const yarts = m.contract("Yarts", [m.getAccount(0), maxSupply]);
  const cov = m.contract("COV", [m.getAccount(0)], { libraries: { CellData: cellData } });
  const map = m.contract("Mapyarts", [INITIAL_SEED]);
  const game = m.contract("Gameyarts", [map, yarts, cov]);
  const registration = m.contract("Registrationyarts", [game, yarts]);

  // Set contract dependencies
  m.call(game, "setRegistrationContract", [registration]);
  m.call(yarts, "setGameContract", [game]);
  m.call(cov, "setGameContract", [game]);
  m.call(registration, "setKmsPublicAddress", [KMS_ADDRESS]);
  m.call(game, "setKmsPublicAddress", [KMS_ADDRESS]);

  return { game, registration, yarts };
});
