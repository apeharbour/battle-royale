const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers')
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs')
const { expect } = require('chai')
const GamePunk = require('../ignition/modules/GamePunk')

describe('Game', function () {
  // async function deployGame() {
  //   // Contracts are deployed using the first signer/account by default
  //   const [owner, player1, player2] = await ethers.getSigners()

  //   const Map = await hre.ethers.getContractFactory('MapPunk')
  //   const map = await Map.deploy(owner.address)

  //   const Game = await hre.ethers.getContractFactory('GamePunk')
  //   const game = await Game.deploy(map.address)

  //   return { game }
  // }

  // async function deployGameAndInitMap() {
  //   // Contracts are deployed using the first signer/account by default
  //   const [owner, player1, player2] = await ethers.getSigners()

  //   const Map = await hre.ethers.getContractFactory('MapPunk')
  //   const map = await Map.deploy(owner.address)

  //   const Game = await hre.ethers.getContractFactory('GamePunk')
  //   const game = await Game.deploy(map.address)

  //   const tx = await game.initGame(5)
  //   await tx.wait()

  //   return { game, owner, player1, player2}
  // }

  async function deployGame() {
    const { game, registration } = await ignition.deploy(GamePunk);
      return { game, registration };
  }

  describe('Map', function () {
    it('should deploy', async function () {
      const { game, owner } = await loadFixture(deployGame)
      const radius = await game.getRadius()

      expect(radius).to.equal(0, 'Radius does not match for uninitialized game')
    })

    it('should deploy and init', async function () {
      const { game, owner } = await loadFixture(deployGame)

      const tx = await game.initGame(5)
      await tx.wait()

      const radius = await game.getRadius()

      expect(radius).to.equal(5, 'Radius does not match for uninitialized game')
    })

    it('should init a map with radius 1', async function() {
      const { game, owner } = await loadFixture(deployGame)

      const tx = await game.initGame(1)
      await tx.wait()

      const cells = await game.getCells()

      expect(cells[0].q).to.equal(1, 'q for center cell is wrong')
      expect(cells[0].r).to.equal(1, 'r for center cell is wrong')

      expect(cells[1].q).to.equal(0, 'q for cell[1] is wrong')
      expect(cells[1].r).to.equal(2, 'r for cell[1] is wrong')

      expect(cells[2].q).to.equal(1, 'q for cell[2] is wrong')
      expect(cells[2].r).to.equal(2, 'r for cell[2] is wrong')

      expect(cells[3].q).to.equal(2, 'q for cell[3] is wrong')
      expect(cells[3].r).to.equal(1, 'r for cell[3] is wrong')

      expect(cells[4].q).to.equal(2, 'q for cell[4] is wrong')
      expect(cells[4].r).to.equal(0, 'r for cell[4] is wrong')

      expect(cells[5].q).to.equal(1, 'q for cell[5] is wrong')
      expect(cells[5].r).to.equal(0, 'r for cell[5] is wrong')

      expect(cells[6].q).to.equal(0, 'q for cell[6] is wrong')
      expect(cells[6].r).to.equal(1, 'r for cell[6] is wrong')
    })
  })

  describe('Ships', function () {
    it('should add a ship', async function () {
      const { game, owner } = await loadFixture(deployGameAndInitMap)
      const tx = await game.addShip()
      await tx.wait()

      const ship = await game.ships(owner.address)

      expect (ship.coordinate.q).to.equal(4)
      expect (ship.coordinate.r).to.equal(8)
    })

    it('should add two ships', async function () {
      const { game, owner, player1 } = await loadFixture(deployGameAndInitMap)
      const tx = await game.addShip()
      await tx.wait()

      const tx2 = await game.connect(player1).addShip()
      await tx.wait()

      const ships = await game.getShips()

      expect (ships[0].coordinate.q).to.equal(4)
      expect (ships[0].coordinate.r).to.equal(8)

      expect (ships[1].coordinate.q).to.equal(6)
      expect (ships[1].coordinate.r).to.equal(6)

      // console.log(ships)

    })


  })

  describe.only('Hashing', function () {
    it('should hash a move', async function () {
      const [owner, player1, player2] = await ethers.getSigners()

      const { game } = await loadFixture(deployGame);
      const moveHash = await game.encodeCommitment(1, 1, 1, 1, 1, player1.address);

      console.log('solidity #:', moveHash);
      
      const ethersHash = ethers.solidityPackedKeccak256(
        ["uint8", "uint8", "uint8", "uint8", "uint8", "address"],
        [1, 1, 1, 1, 1, player1.address]
      );

      console.log('ethers #:', ethersHash);

      expect(moveHash).to.equal(ethersHash);
    })
  })
})
