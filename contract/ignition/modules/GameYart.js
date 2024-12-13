const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const INITIAL_SEED = "0xEeCCd3Ac0314324CEc33780f84880E5bD683447C";

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

  return { game, registration, yarts };
});
