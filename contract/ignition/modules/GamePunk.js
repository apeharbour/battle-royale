const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const INITIAL_SEED = "0xCd9680dd8318b0df924f0bD47a407c05B300e36f";

module.exports = buildModule("BattleRoyale", (m) => {

  const punkships = m.contract("Punkships", [m.getAccount(0)]);
  const map = m.contract("MapPunk", [INITIAL_SEED]);
  const game = m.contract("GamePunk", [map, punkships]);
  const registration = m.contract("RegistrationPunk", [game, punkships]);

  m.call(game, "setRegistrationContract", [registration])

  return { game, registration };
});