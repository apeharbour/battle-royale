import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { CommitPhaseStarted } from "../generated/schema"
import { CommitPhaseStarted as CommitPhaseStartedEvent } from "../generated/GameWOT/GameWOT"
import { handleCommitPhaseStarted } from "../src/game-wot"
import { createCommitPhaseStartedEvent } from "./game-wot-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let gameId = 123
    let newCommitPhaseStartedEvent = createCommitPhaseStartedEvent(gameId)
    handleCommitPhaseStarted(newCommitPhaseStartedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CommitPhaseStarted created and stored", () => {
    assert.entityCount("CommitPhaseStarted", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CommitPhaseStarted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "gameId",
      "123"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
