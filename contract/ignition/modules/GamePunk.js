const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const INITIAL_SEED = "0xCd9680dd8318b0df924f0bD47a407c05B300e36f";

module.exports = buildModule("Game", (m) => {
  const map = m.contract("MapPunk", [INITIAL_SEED]);
  const game = m.contract("GamePunk", [map]);
  const registrationPunk = m.contract("RegistrationPunk", [game]);

  return { game };
});