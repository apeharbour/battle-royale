const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const Punkships  = require("../ignition/modules/Punkships.js");

describe("Punkships", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployPunkships() {
    const { punkships } = await ignition.deploy(Punkships);
      return { punkships };
  }

  describe("Deployment", function () {
    it("Should set deploy", async function () {
      const { punkships } = await loadFixture(deployPunkships);
      expect(true).to.equal(true);
    });
  });

  describe("#tokenURI", function () {
    it("Should return tokenURI 0", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      const tokenURI = await punkships.tokenURI(0);
      expect(true).to.equal(true);
    });
    it("Should return tokenURI 1", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      const tokenURI = await punkships.tokenURI(1);
      expect(true).to.be.true;
    });
    it("Should return tokenURI 2", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      const tokenURI = await punkships.tokenURI(2);
      expect(true).to.be.true;
    });
    it("Should return tokenURI 3", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      const tokenURI = await punkships.tokenURI(3);
      expect(true).to.be.true;
    });
    it("Should return tokenURI 4", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      const tokenURI = await punkships.tokenURI(4);
      expect(true).to.be.true;
    });
    it("Should return tokenURI 5", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      const tokenURI = await punkships.tokenURI(5);
      expect(true).to.be.true;
    });
  });

});
