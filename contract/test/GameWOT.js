const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");


const EAST = 0;
const NORTH_EAST = 1;
const NORTH_WEST = 2;
const WEST = 3;
const SOUTH_WEST = 4;
const SOUTH_EAST = 5;
const NO_MOVE = 6;

const INITIAL_SEED = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'



describe("Game", function () {
  async function deployGame() {
    const RADIUS = 5;
    const GAME_ID = 1;

    const [owner, player1, player2] = await ethers.getSigners();

    const Map = await hre.ethers.getContractFactory("MapWOT");
    const map = await Map.deploy(INITIAL_SEED);

    const Game = await hre.ethers.getContractFactory("GameWOT");
    const game = await Game.deploy(map.address);

    const startTx = await game.startNewGame(GAME_ID);
    await startTx.wait();

    return { game };
  }

  async function deployGameAndInitMap() {
    // Contracts are deployed using the first signer/account by default
    const [owner, player1, player2, player3, player4] =
      await ethers.getSigners();

    const RADIUS = 5;
    const GAME_ID = 1;

    const Map = await hre.ethers.getContractFactory("MapWOT");
    const map = await Map.deploy(INITIAL_SEED);

    const Game = await hre.ethers.getContractFactory("GameWOT");
    const game = await Game.deploy(map.address);

    const startTx = await game.startNewGame(GAME_ID);
    await startTx.wait();

    const initTx = await game.initGame(RADIUS, GAME_ID);
    await initTx.wait();

    return { game, owner, player1, player2, player3, player4, GAME_ID, RADIUS };
  }

  describe("Map", function () {
    it("should deploy and init", async function () {
      const { game, owner } = await loadFixture(deployGame);

      const RADIUS = 5;
      const GAME_ID = 1;

      const tx = await game.initGame(RADIUS, GAME_ID);
      await tx.wait();

      const radius = await game.getRadius(GAME_ID);

      expect(radius).to.equal(
        RADIUS,
        "Radius does not match for uninitialized game"
      );
    });

    it("should emit island events", async function () {
      const { game, owner } = await loadFixture(deployGame);

      const RADIUS = 5;
      const GAME_ID = 1;

      const tx = game.initGame(RADIUS, GAME_ID);

      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 5, 5);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 6, 5);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 6, 4);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 3, 7);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 4, 7);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 1, 9);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 5, 9);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 9, 1);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 8, 1);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 3, 3);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 2, 4);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 1, 6);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 5, 0);
      await expect(tx).to.emit(game, "Island").withArgs(GAME_ID, 2, 3);

      // const cells = await game.getCells(GAME_ID)
      // console.log(cells.map(c => {return {q: c.q, r: c.r}}))
      // console.log(cells.length, 'cells')

      // const cells2 = await Promise.all(cells.map(cell => game.getCell({q: cell.q, r: cell.r}, GAME_ID)))

      // const islands = cells2.filter(cell => cell.island)
      // console.log({islands})

      // const radius = await game.getRadius(GAME_ID);

      // expect(radius).to.equal(
      //   RADIUS,
      //   "Radius does not match for uninitialized game"
      // );
    });

    it("should init a map with radius 1", async function () {
      const { game, owner } = await loadFixture(deployGame);

      const RADIUS = 1;
      const GAME_ID = 1;

      const tx = await game.initGame(RADIUS, GAME_ID);
      await tx.wait();

      const cells = await game.getCells(GAME_ID);

      expect(cells[0].q).to.equal(1, "q for center cell is wrong");
      expect(cells[0].r).to.equal(1, "r for center cell is wrong");

      expect(cells[1].q).to.equal(0, "q for cell[1] is wrong");
      expect(cells[1].r).to.equal(2, "r for cell[1] is wrong");

      expect(cells[2].q).to.equal(1, "q for cell[2] is wrong");
      expect(cells[2].r).to.equal(2, "r for cell[2] is wrong");

      expect(cells[3].q).to.equal(2, "q for cell[3] is wrong");
      expect(cells[3].r).to.equal(1, "r for cell[3] is wrong");

      expect(cells[4].q).to.equal(2, "q for cell[4] is wrong");
      expect(cells[4].r).to.equal(0, "r for cell[4] is wrong");

      expect(cells[5].q).to.equal(1, "q for cell[5] is wrong");
      expect(cells[5].r).to.equal(0, "r for cell[5] is wrong");

      expect(cells[6].q).to.equal(0, "q for cell[6] is wrong");
      expect(cells[6].r).to.equal(1, "r for cell[6] is wrong");
    });
  });

  describe("Ships", function () {
    it("should add a ship", async function () {
      const SPEED = 1;
      const RANGE = 1;

      const { game, owner, RADIUS, GAME_ID } = await loadFixture(
        deployGameAndInitMap
      );
      const tx = await game.addShip(GAME_ID, SPEED, RANGE);
      await tx.wait();

      const ships = await game.getShips(GAME_ID);

      expect(ships[0].coordinate.q).to.equal(4);
      expect(ships[0].coordinate.r).to.equal(8);
    });

    it("should add two ships", async function () {
      const SPEED = 1;
      const RANGE = 1;

      const { game, owner, player1, RADIUS, GAME_ID } = await loadFixture(
        deployGameAndInitMap
      );
      const tx = await game.addShip(GAME_ID, SPEED, RANGE);
      await tx.wait();

      const tx2 = await game.connect(player1).addShip(GAME_ID, SPEED, RANGE);
      await tx.wait();

      const ships = await game.getShips(GAME_ID);

      expect(ships[0].coordinate.q).to.equal(4);
      expect(ships[0].coordinate.r).to.equal(8);

      expect(ships[1].coordinate.q).to.equal(6);
      expect(ships[1].coordinate.r).to.equal(6);
    });

    it("should add four ships", async function () {
      const SPEED = 1;
      const RANGE = 1;

      const { game, player1, player2, player3, player4, GAME_ID } =
        await loadFixture(deployGameAndInitMap);
      await game.connect(player1).addShip(GAME_ID, SPEED, RANGE);
      await game.connect(player2).addShip(GAME_ID, SPEED, RANGE);
      await game.connect(player3).addShip(GAME_ID, SPEED, RANGE);
      await game.connect(player4).addShip(GAME_ID, SPEED, RANGE);

      const ships = await game.getShips(GAME_ID);

      expect(ships[0].coordinate.q).to.equal(4);
      expect(ships[0].coordinate.r).to.equal(8);

      expect(ships[1].coordinate.q).to.equal(6);
      expect(ships[1].coordinate.r).to.equal(6);

      expect(ships[2].coordinate.q).to.equal(3);
      expect(ships[2].coordinate.r).to.equal(8);

      expect(ships[3].coordinate.q).to.equal(9);
      expect(ships[3].coordinate.r).to.equal(6);
    });

    it("should add four ships and emit events for them", async function () {
      const SPEED = 1;
      const RANGE = 1;

      const { game, player1, player2, player3, player4, GAME_ID } =
        await loadFixture(deployGameAndInitMap);
      const tx1 = game.connect(player1).addShip(GAME_ID, SPEED, RANGE);
      await expect(tx1)
        .to.emit(game, "PlayerAdded")
        .withArgs(player1.address, GAME_ID, 4, 8, SPEED, RANGE);

      const tx2 = game.connect(player2).addShip(GAME_ID, SPEED, RANGE);
      await expect(tx2)
        .to.emit(game, "PlayerAdded")
        .withArgs(player2.address, GAME_ID, 6, 6, SPEED, RANGE);

      const tx3 = game.connect(player3).addShip(GAME_ID, SPEED, RANGE);
      await expect(tx3)
        .to.emit(game, "PlayerAdded")
        .withArgs(player3.address, GAME_ID, 3, 8, SPEED, RANGE);

      const tx4 = game.connect(player4).addShip(GAME_ID, SPEED, RANGE);
      await expect(tx4)
        .to.emit(game, "PlayerAdded")
        .withArgs(player4.address, GAME_ID, 9, 6, SPEED, RANGE);
    });
  });

  describe("Game", async function () {
    it("should not allow moves in submit phase", async function () {
      const SPEED = 1;
      const RANGE = 1;

      const { game, player1, GAME_ID } = await loadFixture(
        deployGameAndInitMap
      );
      await game.connect(player1).addShip(GAME_ID, SPEED, RANGE);
      expect(game.connect(player1).revealMove(EAST, 3, NORTH_WEST, 3, GAME_ID)).revertedWith("Submit moves has not started yet!")
    });

    it("should move a player", async function () {
      const SPEED = 1;
      const RANGE = 1;

      const { game, player1, GAME_ID } = await loadFixture(
        deployGameAndInitMap
      );
      await game.connect(player1).addShip(GAME_ID, SPEED, RANGE);
      await game.allowSubmitMoves(GAME_ID);

      const moveTx = game.connect(player1).revealMove(EAST, 3, NORTH_WEST, 3, GAME_ID)

      await expect(moveTx).to.emit(game, "MoveSubmitted").withArgs(player1.address, GAME_ID, 7, 8, 7, 5)
    });

    it("should move a player off the map", async function () {
      const SPEED = 1;
      const RANGE = 1;

      const { game, player1, GAME_ID } = await loadFixture(
        deployGameAndInitMap
      );
      await game.connect(player1).addShip(GAME_ID, SPEED, RANGE);
      await game.allowSubmitMoves(GAME_ID);

      await game.connect(player1).revealMove(EAST, 4, NORTH_WEST, 3, GAME_ID)

      const updateTx = game.updateWorld(GAME_ID)
      await expect(updateTx).to.emit(game, "ShipCollidedWithIsland").withArgs(player1.address, GAME_ID)
    });

    it("should have two ships collide", async function () {
      const SPEED = 1;
      const RANGE = 1;

      const { game, player1, player2, player3, player4, GAME_ID } =
        await loadFixture(deployGameAndInitMap);
      await game.connect(player1).addShip(GAME_ID, SPEED, RANGE);
      await game.connect(player2).addShip(GAME_ID, SPEED, RANGE);
      await game.allowSubmitMoves(GAME_ID);

      await game.connect(player1).revealMove(NORTH_EAST, 1, EAST, 4, GAME_ID)
      await game.connect(player2).revealMove(SOUTH_WEST, 1, EAST, 4, GAME_ID)

      const updateTx = game.updateWorld(GAME_ID)
      await expect(updateTx).to.emit(game, "ShipSunk").withArgs(player1.address, GAME_ID)
      await expect(updateTx).to.emit(game, "ShipSunk").withArgs(player2.address, GAME_ID)
    });

    it("should have one ship shoot the other", async function () {
      const SPEED = 1;
      const RANGE = 1;

      const { game, player1, player2, player3, player4, GAME_ID } =
        await loadFixture(deployGameAndInitMap);
      await game.connect(player1).addShip(GAME_ID, SPEED, RANGE);
      await game.connect(player2).addShip(GAME_ID, SPEED, RANGE);
      await game.allowSubmitMoves(GAME_ID);

      await game.connect(player1).revealMove(EAST, 2, NORTH_WEST, 2, GAME_ID)

      const updateTx = game.updateWorld(GAME_ID)
      await expect(updateTx).to.emit(game, "ShipHit").withArgs(player2.address, player1.address, GAME_ID)
    });

  });
});
