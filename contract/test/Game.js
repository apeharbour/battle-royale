const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const GamePunk = require("../ignition/modules/GamePunk");

const dir = {
  E: 0,
  NE: 1,
  NW: 2,
  W: 3,
  SW: 4,
  SE: 5,
};

const GAME_ID = 1;
const RADIUS = 5;
const SALT = 1;

describe("Game", function () {
  async function deployGame() {
    const { game, registration, punkships } = await ignition.deploy(GamePunk);

    // Mint a ship to each player
    const [owner, player1, player2, player3, player4] = await ethers.getSigners();

    await punkships.safeMint(owner.address);
    await punkships.safeMint(player1.address);
    await punkships.safeMint(player2.address);
    await punkships.safeMint(player3.address);
    await punkships.safeMint(player4.address);

    return { game, registration, punkships };
  }

  describe("Map", function () {
    it("should deploy", async function () {
      const { game } = await loadFixture(deployGame);
      expect(game.getRadius(1)).to.be.revertedWith("Game has not started yet");
    });

    it("should deploy and init", async function () {
      const { game } = await loadFixture(deployGame);

      const tx = await game.startNewGame(1, 5);
      await tx.wait();

      const radius = await game.getRadius(1);

      expect(radius).to.equal(5, "Radius does not match for initialized game");
    });

    it("should emit the GameStarted event", async function () {
      const { game, owner } = await loadFixture(deployGame);

      await expect (game.startNewGame(1, 5)).to.emit(game, "GameStarted").withArgs(1);
    })

    it("should init a map with radius 1", async function () {
      const { game } = await loadFixture(deployGame);

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

    it("should put islands on a map with radius 1", async function () {
      const { game } = await loadFixture(deployGame);

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

  });

  describe.only("Game", function () {
    it("should start a game and revert adding a player with the wrong ship", async function () {
      const { game, registration, punkships } = await loadFixture(deployGame);
      const [owner, player1, player2, player3, player4] = await ethers.getSigners();

      const tx = await game.startNewGame(GAME_ID, RADIUS);
      await tx.wait();

      const range = await punkships.getRange(1)
      const shootingRange = await punkships.getShootingRange(1)

      await expect(game.addShip(player1.address, GAME_ID, 2)).to.be.revertedWithCustomError(game, "NotOwnerOfShip").withArgs(player1.address, 2);
    });

    it("should start a game and add player 1 with ship 1", async function () {
      const { game, registration, punkships } = await loadFixture(deployGame);
      const [owner, player1, player2, player3, player4] = await ethers.getSigners();

      const tx = await game.startNewGame(GAME_ID, RADIUS);
      await tx.wait();

      const range = await punkships.getRange(1)
      const shootingRange = await punkships.getShootingRange(1)

      await expect(game.addShip(player1.address, GAME_ID, 1)).to.emit(game, "PlayerAdded").withArgs(player1.address, GAME_ID, 1, anyValue, anyValue, range, shootingRange, anyValue);
    });

    it("should start a game and add four players with their ships", async function () {
      const { game, registration, punkships } = await loadFixture(deployGame);
      const [owner, player1, player2, player3, player4] = await ethers.getSigners();

      const tx = await game.startNewGame(GAME_ID, RADIUS);
      await tx.wait();

      const players = [player1, player2, player3, player4];
      const ranges = [await punkships.getRange(1), await punkships.getRange(2), await punkships.getRange(3), await punkships.getRange(4)];
      const shootingRanges = [await punkships.getShootingRange(1), await punkships.getShootingRange(2), await punkships.getShootingRange(3), await punkships.getShootingRange(4)];

      for (let i = 0; i < 4; i++) {
        await expect(game.addShip(players[i].address, GAME_ID, i + 1)).to.emit(game, "PlayerAdded").withArgs(players[i].address, GAME_ID, i + 1, anyValue, anyValue, ranges[i], shootingRanges[i], anyValue);
      }
    });

    it("should commit the moves of all players", async function () {
      const { game, registration, punkships } = await loadFixture(deployGame);
      const [owner, player1, player2, player3, player4] = await ethers.getSigners();

      const tx = await game.startNewGame(GAME_ID, RADIUS);
      await tx.wait();

      const players = [player1, player2, player3, player4];

      for (let i = 0; i < 4; i++) {
        await game.addShip(players[i].address, GAME_ID, i + 1);
      }

      const travels = [
        { direction: dir.NE, distance: 3 },
        { direction: dir.SE, distance: 3 },
        { direction: dir.E, distance: 1 },
        { direction: dir.NW, distance: 1 },
      ];

      const shots = [
        { direction: dir.W, distance: 1 },
        { direction: dir.E, distance: 2 },
        { direction: dir.E, distance: 1 },
        { direction: dir.NW, distance: 2 },
      ];

      for (let i = 0; i < 4; i++) {
        const moveHash = ethers.solidityPackedKeccak256(
          ["uint8", "uint8", "uint8", "uint8", "uint8", "address"],
          [travels[i].direction, travels[i].distance, shots[i].direction, shots[i].distance, SALT, players[i].address]
        );
        await expect(game.connect(players[i]).commitMove(moveHash, GAME_ID)).to.emit(game, "MoveCommitted").withArgs(players[i].address, GAME_ID, moveHash);
      }
    });

    it("should submit the moves of all players", async function () {
      const { game, registration, punkships } = await loadFixture(deployGame);
      const [owner, player1, player2, player3, player4] = await ethers.getSigners();

      const tx = await game.startNewGame(GAME_ID, RADIUS);
      await tx.wait();

      const players = [player1, player2, player3, player4];

      for (let i = 0; i < 4; i++) {
        await game.addShip(players[i].address, GAME_ID, i + 1);
      }

      const travels = [
        { direction: dir.NE, distance: 3 },
        { direction: dir.SE, distance: 3 },
        { direction: dir.E, distance: 1 },
        { direction: dir.NW, distance: 1 },
      ];

      const shots = [
        { direction: dir.W, distance: 1 },
        { direction: dir.E, distance: 2 },
        { direction: dir.E, distance: 1 },
        { direction: dir.NW, distance: 2 },
      ];

      for (let i = 0; i < 4; i++) {
        const moveHash = ethers.solidityPackedKeccak256(
          ["uint8", "uint8", "uint8", "uint8", "uint8", "address"],
          [travels[i].direction, travels[i].distance, shots[i].direction, shots[i].distance, SALT, players[i].address]
        );
        await game.connect(players[i]).commitMove(moveHash, GAME_ID);
      }

      const travelDirs = [dir.NE, dir.SE, dir.E, dir.NW];
      const travelDists = [3, 3, 1, 1];
      const shotDirs = [dir.W, dir.E, dir.E, dir.NW];
      const shotDists = [1, 2, 1, 2];
      const secrets = [SALT, SALT, SALT, SALT];
      const playerAddresses = [player1.address, player2.address, player3.address, player4.address];


      await expect(game.submitMove(travelDirs, travelDists, shotDirs, shotDists, secrets, playerAddresses, GAME_ID)).to.emit(game, "MoveSubmitted");
    });

  });
});
