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
const RADIUS = 8;
const SALT = 1;

describe("Large Game", function () {
  async function deployGame() {
    const { game, registration, punkships } = await ignition.deploy(GamePunk);

    // Mint a ship to each player
    // const [owner, player1, player2, player3, player4] = await ethers.getSigners();
    const signers = await ethers.getSigners();
    // const owner = players.shift()

    // const mints = signers.map(async (player) => {
    //   return (punkships.safeMint(player.address)).then((tx) => tx.wait());
    // });

    // const results = await Promise.all(mints);
    // console.log("Minted ships to all players");
    // console.log(results);

    const results = signers.map(async (player) => {
      const tx = await punkships.safeMint(player.address);
      return await tx.wait();
    });

    await Promise.all(results);

    return { game, registration, punkships };
  }

  describe("Map", function () {
    it("should deploy", async function () {
      const { game } = await loadFixture(deployGame);
      expect(game.getRadius(1)).to.be.revertedWith("Game has not started yet");
    });

    it("should deploy and init", async function () {
      const { game } = await loadFixture(deployGame);

      const tx = await game.startNewGame(GAME_ID, RADIUS);
      await tx.wait();

      const radius = await game.getRadius(GAME_ID);

      expect(radius).to.equal(RADIUS, "Radius does not match for initialized game");
    });

    it("should emit the GameStarted event", async function () {
      const { game, owner } = await loadFixture(deployGame);

      await expect (game.startNewGame(GAME_ID, RADIUS)).to.emit(game, "GameStarted").withArgs(1);
    })

  });

  describe("Game", function () {
    it.only("should have minted 20 ships", async function () {
      const { game, registration, punkships } = await loadFixture(deployGame);
      const signers = await ethers.getSigners();

      const results = await Promise.all(signers.map(async (player) => { return await punkships.balanceOf(player.address) }));
      const totalShips = results.reduce((acc, val) => acc + parseInt(val), 0);
      expect(totalShips).to.equal(20, "Total ships minted does not match");
    });

    it.only("should show the correct owner of the ships", async function () {
      const { game, registration, punkships } = await loadFixture(deployGame);
      const signers = await ethers.getSigners();

      let owners = [...Array(20).keys()].map(async (shipId) => {
        const owner = await punkships.ownerOf(shipId);
        return owner 
      });

      owners = await Promise.all(owners)
      expect(owners).to.have.length(20, "Owners array does not have 20 elements")
      expect(owners).to.have.members(signers.map(signer => signer.address), "Owners array does not match signers")
    });

    it.only("should start a game and add 19 players with their ships", async function () {
      const { game, registration, punkships } = await loadFixture(deployGame);
      const [owner, player1, player2, player3, player4] = await ethers.getSigners();
      const players = (await ethers.getSigners()).map((signer, index) => {return {address: signer.address, id: index}});

      players.shift();
      
      const tx = await game.startNewGame(GAME_ID, RADIUS);
      await tx.wait();

      players.forEach(async (player) => {
        const range = parseInt(await punkships.getRange(player.id))
        const shootingRange = parseInt(await punkships.getShootingRange(player.id))
        // console.log(`adding ship ${player.id} with range ${range} and shot ${shootingRange} for ${player.address} in game ${GAME_ID}`)

        await expect (game.addShip(player.address, GAME_ID, player.id)).to.emit(game, "XXX");
        // const receipt = await result.wait();
        // console.log(`Minted in block ${receipt.blockNumber} for ${receipt.gasUsed} gas`);

        // await expect(result).to.emit(game, "PlayerAdded").withArgs(player.address, GAME_ID, player.id, anyValue, anyValue, range, shootingRange, anyValue);

        // await expect(game.addShip(player.address, GAME_ID, player.id)).to.emit(game, "PlayerAdded").withArgs(player.address, GAME_ID, player.id, anyValue, anyValue, range, shootingRange, anyValue);
      });
      // const range = await punkships.getRange(SHIP_ID)
      // const shootingRange = await punkships.getShootingRange(SHIP_ID)

      // await expect(game.addShip(player1.address, GAME_ID, SHIP_ID)).to.emit(game, "PlayerAdded").withArgs(player1.address, GAME_ID, SHIP_ID, anyValue, anyValue, range, shootingRange, anyValue);
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

      const travelDirs = [travels[0].direction, travels[1].direction, travels[2].direction, travels[3].direction];
      const travelDists = [travels[0].distance, travels[1].distance, travels[2].distance, travels[3].distance];
      const shotDirs = [shots[0].direction, shots[1].direction, shots[2].direction, shots[3].direction];
      const shotDists = [shots[0].distance, shots[1].distance, shots[2].distance, shots[3].distance];
      const secrets = [SALT, SALT, SALT, SALT];
      const playerAddresses = [players[0].address, players[1].address, players[2].address, players[3].address];


      await expect(game.submitMove(travelDirs, travelDists, shotDirs, shotDists, secrets, playerAddresses, GAME_ID)).to.emit(game, "MoveSubmitted");
    });

    it("should update world state after submitting moves", async function () {
      const { game, registration, punkships } = await loadFixture(deployGame);
      const [owner, player1, player2, player3, player4] = await ethers.getSigners();

      await game.startNewGame(GAME_ID, RADIUS);

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

      const travelDirs = [travels[0].direction, travels[1].direction, travels[2].direction, travels[3].direction];
      const travelDists = [travels[0].distance, travels[1].distance, travels[2].distance, travels[3].distance];
      const shotDirs = [shots[0].direction, shots[1].direction, shots[2].direction, shots[3].direction];
      const shotDists = [shots[0].distance, shots[1].distance, shots[2].distance, shots[3].distance];
      const secrets = [SALT, SALT, SALT, SALT];
      const playerAddresses = [players[0].address, players[1].address, players[2].address, players[3].address];


      await game.submitMove(travelDirs, travelDists, shotDirs, shotDists, secrets, playerAddresses, GAME_ID);

      const tx = game.updateWorld(GAME_ID);

      await expect(tx).to.emit(game, "WorldUpdated").withArgs(GAME_ID);
      await expect(tx).to.emit(game, "ShipMoved").withArgs(player1.address, 4, 5, 7, 2, GAME_ID);
      await expect(tx).to.emit(game, "ShipMoved").withArgs(player2.address, 3, 3, 3, 6, GAME_ID);
      await expect(tx).to.emit(game, "ShipCollidedWithIsland").withArgs(player3.address, GAME_ID, 4, 6);
      await expect(tx).to.emit(game, "ShipMoved").withArgs(player4.address, 5, 9, 5, 8, GAME_ID);

    });

  });
});
