const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers')
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs')
const { expect } = require('chai')

describe('Map', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMap() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners()

    const Map = await hre.ethers.getContractFactory('Map')
    const map = await Map.deploy(owner.address)

    return { map, owner }
  }

  async function deployAndInitMap() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners()

    const Map = await hre.ethers.getContractFactory('Map')
    const map = await Map.deploy(owner.address)

    await map.initMap(5)

    return { map, owner }
  }

  describe('Init', function () {

    it('should have the correct radius', async function () {
      const { map, owner } = await loadFixture(deployAndInitMap)

      const radius = await map.radius()
      expect(radius).to.equal(5)

    })

    it('should have the correct center', async function () {
      const { map, owner } = await loadFixture(deployAndInitMap)

      const coord = { q: 5, r: 5 }

      const result = await map.getCell(coord)

      const [ q, r, island, exists ] = result

      expect(q).to.equal(5)
      expect(r).to.equal(5)
      expect(island).to.be.false
      expect(exists).to.be.true
    })
    
    it('should not have hex (0,0)', async function () {
      const { map, owner } = await loadFixture(deployAndInitMap)
      
      const coord = { q: 0, r: 0 }
      
      const { q, r, island, exists } = await map.getCell(coord)
      
      expect(q).to.equal(0)
      expect(r).to.equal(0)
      expect(island).to.be.false
      expect(exists).to.be.false
    })
    
    it('should not have hex (1,1)', async function () {
      const { map, owner } = await loadFixture(deployAndInitMap)
      
      const coord = { q: 1, r: 1 }
      
      const result = await map.getCell(coord)
      
      const [ q, r, island, exists ] = result
      
      expect(q).to.equal(0)
      expect(r).to.equal(0)
      expect(island).to.be.false
      expect(exists).to.be.false
    })
  })
  
})
