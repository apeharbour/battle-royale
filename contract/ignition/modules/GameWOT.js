const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const INITIAL_SEED = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

module.exports = buildModule("GameWOT", (m) => {
  const map = m.contract("MapWOT", [INITIAL_SEED]);
  const game = m.contract("GameWOT", [map]);

  return { game };
});