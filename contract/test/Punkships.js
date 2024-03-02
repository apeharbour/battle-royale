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

  describe("#safeMint", function () {
    it("Should mint 1", async function () {
      const [owner] = await ethers.getSigners()

      const { punkships }  = await loadFixture(deployPunkships);
      await punkships.safeMint(owner.address);

      const balance = await punkships.balanceOf(owner.address);
      expect(balance).to.equal(1, 'Not enough ships.');

    })
  });

  describe("#tokenURI", function () {
    it("Should fail to for non minted tokenURI 0", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      expect(punkships.tokenURI(0)).to.be.revertedWithCustomError(punkships, "ShipNotMinted");
    });

    it("should return for minted tokenURI 0", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      const [owner] = await ethers.getSigners()
      await punkships.safeMint(owner.address);

      const tokenURI = await punkships.tokenURI(0);
      const startOfTokenURI = tokenURI.slice(0, 29);
      expect(startOfTokenURI).to.equal("data:application/json;base64,")
    });
  });

  describe("#getRange", function () {
    it("Should fail to for non minted tokenURI 0", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      expect(punkships.getRange(0)).to.be.revertedWithCustomError(punkships, "ShipNotMinted");
    });

    it("should return for minted tokenURI 0", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      const [owner] = await ethers.getSigners()
      await punkships.safeMint(owner.address);

      const range = await punkships.getRange(0);
      expect(range).to.equal(2)
    });

    it("should return for minted tokenURI 1", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      const [owner] = await ethers.getSigners()
      await punkships.safeMint(owner.address);
      await punkships.safeMint(owner.address);

      const range = await punkships.getRange(1);
      expect(range).to.equal(5)
    });
  });

  describe("#getShootingRange", function () {
    it("Should fail to for non minted tokenURI 0", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      expect(punkships.getShootingRange(0)).to.be.revertedWithCustomError(punkships, "ShipNotMinted");
    });

    it("should return for minted tokenURI 0", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      const [owner] = await ethers.getSigners()
      await punkships.safeMint(owner.address);

      const shootingRange = await punkships.getShootingRange(0);
      expect(shootingRange).to.equal(6)
    });

    it("should return for minted tokenURI 1", async function () {
      const { punkships }  = await loadFixture(deployPunkships);
      const [owner] = await ethers.getSigners()
      await punkships.safeMint(owner.address);
      await punkships.safeMint(owner.address);

      const shootingRange = await punkships.getShootingRange(1);
      expect(shootingRange).to.equal(3)
    });

  });

});

