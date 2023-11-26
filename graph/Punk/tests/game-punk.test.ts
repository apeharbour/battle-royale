import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Cell } from "../generated/schema"
import { Cell as CellEvent } from "../generated/GamePunk/GamePunk"
import { handleCell } from "../src/game-punk"
import { createCellEvent } from "./game-punk-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let gameId = 123
    let q = 123
    let r = 123
    let island = "boolean Not implemented"
    let newCellEvent = createCellEvent(gameId, q, r, island)
    handleCell(newCellEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Cell created and stored", () => {
    assert.entityCount("Cell", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Cell",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "gameId",
      "123"
    )
    assert.fieldEquals(
      "Cell",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "q",
      "123"
    )
    assert.fieldEquals(
      "Cell",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "r",
      "123"
    )
    assert.fieldEquals(
      "Cell",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "island",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
