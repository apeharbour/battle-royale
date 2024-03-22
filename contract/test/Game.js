const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const GamePunk = require("../ignition/modules/GamePunk");

describe("Game", function () {
  async function deployGame() {
    const { game, registration } = await ignition.deploy(GamePunk);
    return { game, registration };
  }

  describe("Map", function () {
    it("should deploy", async function () {
      const { game, owner } = await loadFixture(deployGame);
      expect(game.getRadius(1)).to.be.revertedWith("Game has not started yet");
    });

    it("should deploy and init", async function () {
      const { game, owner } = await loadFixture(deployGame);

      const tx = await game.startNewGame(1, 5);
      await tx.wait();

      const radius = await game.getRadius(1);

      expect(radius).to.equal(5, "Radius does not match for initialized game");
    });

    it("should init a map with radius 1", async function () {
      const { game, owner } = await loadFixture(deployGame);

      const tx = await game.startNewGame(1, 1);
      await tx.wait();

      const coordinates = await game.getCoordinates(1);

      expect(coordinates[0]).to.deep.equal(
        [1n, 1n],
        "coordinates[0] (center) is wrong"
      );
      expect(coordinates[1]).to.deep.equal([0n, 2n], "coordinates[1] is wrong");
      expect(coordinates[2]).to.deep.equal([1n, 2n], "coordinates[2] is wrong");
      expect(coordinates[3]).to.deep.equal([2n, 1n], "coordinates[3] is wrong");
      expect(coordinates[4]).to.deep.equal([2n, 0n], "coordinates[4] is wrong");
      expect(coordinates[5]).to.deep.equal([1n, 0n], "coordinates[5] is wrong");
      expect(coordinates[6]).to.deep.equal([0n, 1n], "coordinates[6] is wrong");
    });

    it("should put islands a map with radius 1", async function () {
      const { game, owner } = await loadFixture(deployGame);

      const tx = await game.startNewGame(1, 1);
      await tx.wait();

      const coordinates = await game.getCoordinates(1);

      let cells = [];

      for (let i = 0; i < 7; i++) {
        const coord = { q: coordinates[i][0], r: coordinates[i][1] };
        cells[i] = await game.getCell(coord, 1);
      }

      expect(cells[0]).to.deep.equal(
        [1n, 1n, false, true],
        "cells[0] (center) is wrong"
      );
      expect(cells[1]).to.deep.equal([0n, 2n, true, true], "cells[1] is wrong");
      expect(cells[2]).to.deep.equal(
        [1n, 2n, false, true],
        "cells[2] is wrong"
      );
      expect(cells[3]).to.deep.equal([2n, 1n, true, true], "cells[3] is wrong");
      expect(cells[4]).to.deep.equal(
        [2n, 0n, false, true],
        "cells[4] is wrong"
      );
      expect(cells[5]).to.deep.equal(
        [1n, 0n, false, true],
        "cells[5] is wrong"
      );
      expect(cells[6]).to.deep.equal(
        [0n, 1n, false, true],
        "cells[6] is wrong"
      );
    });

    // describe('Ships', function () {
    //   it('should add a ship', async function () {
    //     const { game, owner } = await loadFixture(deployGameAndInitMap)
    //     const tx = await game.addShip()
    //     await tx.wait()

    //     const ship = await game.ships(owner.address)

    //     expect (ship.coordinate.q).to.equal(4)
    //     expect (ship.coordinate.r).to.equal(8)
    //   })

    //   it('should add two ships', async function () {
    //     const { game, owner, player1 } = await loadFixture(deployGameAndInitMap)
    //     const tx = await game.addShip()
    //     await tx.wait()

    //     const tx2 = await game.connect(player1).addShip()
    //     await tx.wait()

    //     const ships = await game.getShips()

    //     expect (ships[0].coordinate.q).to.equal(4)
    //     expect (ships[0].coordinate.r).to.equal(8)

    //     expect (ships[1].coordinate.q).to.equal(6)
    //     expect (ships[1].coordinate.r).to.equal(6)

    //     // console.log(ships)

    //   })

    // })

    // describe.only('Hashing', function () {
    //   it('should hash a move', async function () {
    //     const [owner, player1, player2] = await ethers.getSigners()

    //     const { game } = await loadFixture(deployGame);
    //     const moveHash = await game.encodeCommitment(1, 1, 1, 1, 1, player1.address);

    //     console.log('solidity #:', moveHash);

    //     const ethersHash = ethers.solidityPackedKeccak256(
    //       ["uint8", "uint8", "uint8", "uint8", "uint8", "address"],
    //       [1, 1, 1, 1, 1, player1.address]
    //     );

    //     console.log('ethers #:', ethersHash);

    //     expect(moveHash).to.equal(ethersHash);
    //   })
    // })
  });
});
