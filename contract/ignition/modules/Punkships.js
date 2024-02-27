const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Punkships", (m) => {
  const punkships = m.contract("Punkships", [m.getAccount(0)]);

  // m.call(punkships, "tokenURI", [906], {id: 'token906'});
  // m.call(punkships, "tokenURI", [2064], {id: 'token2064'});
  
  return { punkships };
});