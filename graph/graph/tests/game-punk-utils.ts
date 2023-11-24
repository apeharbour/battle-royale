import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Cell,
  CommitPhaseStarted,
  GameEnded,
  GameStarted,
  GameUpdated,
  GameWinner,
  MapInitialized,
  MapShrink,
  MoveCommitted,
  MoveSubmitted,
  NewRound,
  OwnershipTransferred,
  PlayerAdded,
  PlayerDefeated,
  ShipCollidedWithIsland,
  ShipHit,
  ShipMoved,
  ShipMovedInGame,
  ShipShot,
  ShipSunk,
  ShipSunkOutOfMap,
  SubmitPhaseStarted,
  WorldUpdated
} from "../generated/GamePunk/GamePunk"

export function createCellEvent(
  gameId: i32,
  q: i32,
  r: i32,
  island: boolean
): Cell {
  let cellEvent = changetype<Cell>(newMockEvent())

  cellEvent.parameters = new Array()

  cellEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )
  cellEvent.parameters.push(
    new ethereum.EventParam(
      "q",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(q))
    )
  )
  cellEvent.parameters.push(
    new ethereum.EventParam(
      "r",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(r))
    )
  )
  cellEvent.parameters.push(
    new ethereum.EventParam("island", ethereum.Value.fromBoolean(island))
  )

  return cellEvent
}

export function createCommitPhaseStartedEvent(gameId: i32): CommitPhaseStarted {
  let commitPhaseStartedEvent = changetype<CommitPhaseStarted>(newMockEvent())

  commitPhaseStartedEvent.parameters = new Array()

  commitPhaseStartedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return commitPhaseStartedEvent
}

export function createGameEndedEvent(gameId: i32): GameEnded {
  let gameEndedEvent = changetype<GameEnded>(newMockEvent())

  gameEndedEvent.parameters = new Array()

  gameEndedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return gameEndedEvent
}

export function createGameStartedEvent(gameId: i32): GameStarted {
  let gameStartedEvent = changetype<GameStarted>(newMockEvent())

  gameStartedEvent.parameters = new Array()

  gameStartedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return gameStartedEvent
}

export function createGameUpdatedEvent(
  gameStatus: boolean,
  winnerAddress: Address,
  gameId: i32
): GameUpdated {
  let gameUpdatedEvent = changetype<GameUpdated>(newMockEvent())

  gameUpdatedEvent.parameters = new Array()

  gameUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "gameStatus",
      ethereum.Value.fromBoolean(gameStatus)
    )
  )
  gameUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "winnerAddress",
      ethereum.Value.fromAddress(winnerAddress)
    )
  )
  gameUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return gameUpdatedEvent
}

export function createGameWinnerEvent(
  winner: Address,
  gameId: i32
): GameWinner {
  let gameWinnerEvent = changetype<GameWinner>(newMockEvent())

  gameWinnerEvent.parameters = new Array()

  gameWinnerEvent.parameters.push(
    new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner))
  )
  gameWinnerEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return gameWinnerEvent
}

export function createMapInitializedEvent(
  radius: i32,
  gameId: i32
): MapInitialized {
  let mapInitializedEvent = changetype<MapInitialized>(newMockEvent())

  mapInitializedEvent.parameters = new Array()

  mapInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "radius",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(radius))
    )
  )
  mapInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return mapInitializedEvent
}

export function createMapShrinkEvent(gameId: i32): MapShrink {
  let mapShrinkEvent = changetype<MapShrink>(newMockEvent())

  mapShrinkEvent.parameters = new Array()

  mapShrinkEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return mapShrinkEvent
}

export function createMoveCommittedEvent(
  player: Address,
  gameId: i32
): MoveCommitted {
  let moveCommittedEvent = changetype<MoveCommitted>(newMockEvent())

  moveCommittedEvent.parameters = new Array()

  moveCommittedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  moveCommittedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return moveCommittedEvent
}

export function createMoveSubmittedEvent(
  player: Address,
  gameId: i32,
  roundId: BigInt,
  destQ: i32,
  destR: i32,
  shotQ: i32,
  shotR: i32
): MoveSubmitted {
  let moveSubmittedEvent = changetype<MoveSubmitted>(newMockEvent())

  moveSubmittedEvent.parameters = new Array()

  moveSubmittedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  moveSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )
  moveSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  moveSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "destQ",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(destQ))
    )
  )
  moveSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "destR",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(destR))
    )
  )
  moveSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "shotQ",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(shotQ))
    )
  )
  moveSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "shotR",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(shotR))
    )
  )

  return moveSubmittedEvent
}

export function createNewRoundEvent(
  gameId: i32,
  roundId: BigInt,
  radius: i32
): NewRound {
  let newRoundEvent = changetype<NewRound>(newMockEvent())

  newRoundEvent.parameters = new Array()

  newRoundEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )
  newRoundEvent.parameters.push(
    new ethereum.EventParam(
      "roundId",
      ethereum.Value.fromUnsignedBigInt(roundId)
    )
  )
  newRoundEvent.parameters.push(
    new ethereum.EventParam(
      "radius",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(radius))
    )
  )

  return newRoundEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPlayerAddedEvent(
  player: Address,
  gameId: i32,
  q: i32,
  r: i32,
  speed: i32,
  range: i32
): PlayerAdded {
  let playerAddedEvent = changetype<PlayerAdded>(newMockEvent())

  playerAddedEvent.parameters = new Array()

  playerAddedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  playerAddedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )
  playerAddedEvent.parameters.push(
    new ethereum.EventParam(
      "q",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(q))
    )
  )
  playerAddedEvent.parameters.push(
    new ethereum.EventParam(
      "r",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(r))
    )
  )
  playerAddedEvent.parameters.push(
    new ethereum.EventParam(
      "speed",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(speed))
    )
  )
  playerAddedEvent.parameters.push(
    new ethereum.EventParam(
      "range",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(range))
    )
  )

  return playerAddedEvent
}

export function createPlayerDefeatedEvent(
  player: Address,
  gameId: i32
): PlayerDefeated {
  let playerDefeatedEvent = changetype<PlayerDefeated>(newMockEvent())

  playerDefeatedEvent.parameters = new Array()

  playerDefeatedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  playerDefeatedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return playerDefeatedEvent
}

export function createShipCollidedWithIslandEvent(
  captain: Address,
  gameId: i32,
  q: i32,
  r: i32
): ShipCollidedWithIsland {
  let shipCollidedWithIslandEvent = changetype<ShipCollidedWithIsland>(
    newMockEvent()
  )

  shipCollidedWithIslandEvent.parameters = new Array()

  shipCollidedWithIslandEvent.parameters.push(
    new ethereum.EventParam("captain", ethereum.Value.fromAddress(captain))
  )
  shipCollidedWithIslandEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )
  shipCollidedWithIslandEvent.parameters.push(
    new ethereum.EventParam(
      "q",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(q))
    )
  )
  shipCollidedWithIslandEvent.parameters.push(
    new ethereum.EventParam(
      "r",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(r))
    )
  )

  return shipCollidedWithIslandEvent
}

export function createShipHitEvent(
  victim: Address,
  attacker: Address,
  gameId: i32
): ShipHit {
  let shipHitEvent = changetype<ShipHit>(newMockEvent())

  shipHitEvent.parameters = new Array()

  shipHitEvent.parameters.push(
    new ethereum.EventParam("victim", ethereum.Value.fromAddress(victim))
  )
  shipHitEvent.parameters.push(
    new ethereum.EventParam("attacker", ethereum.Value.fromAddress(attacker))
  )
  shipHitEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return shipHitEvent
}

export function createShipMovedEvent(
  captain: Address,
  initialQ: i32,
  initialR: i32,
  q: i32,
  r: i32,
  gameId: i32
): ShipMoved {
  let shipMovedEvent = changetype<ShipMoved>(newMockEvent())

  shipMovedEvent.parameters = new Array()

  shipMovedEvent.parameters.push(
    new ethereum.EventParam("captain", ethereum.Value.fromAddress(captain))
  )
  shipMovedEvent.parameters.push(
    new ethereum.EventParam(
      "initialQ",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(initialQ))
    )
  )
  shipMovedEvent.parameters.push(
    new ethereum.EventParam(
      "initialR",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(initialR))
    )
  )
  shipMovedEvent.parameters.push(
    new ethereum.EventParam(
      "q",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(q))
    )
  )
  shipMovedEvent.parameters.push(
    new ethereum.EventParam(
      "r",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(r))
    )
  )
  shipMovedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return shipMovedEvent
}

export function createShipMovedInGameEvent(
  captain: Address,
  gameId: i32
): ShipMovedInGame {
  let shipMovedInGameEvent = changetype<ShipMovedInGame>(newMockEvent())

  shipMovedInGameEvent.parameters = new Array()

  shipMovedInGameEvent.parameters.push(
    new ethereum.EventParam("captain", ethereum.Value.fromAddress(captain))
  )
  shipMovedInGameEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return shipMovedInGameEvent
}

export function createShipShotEvent(
  captain: Address,
  fromQ: i32,
  fromR: i32,
  shotQ: i32,
  shotR: i32,
  gameId: i32
): ShipShot {
  let shipShotEvent = changetype<ShipShot>(newMockEvent())

  shipShotEvent.parameters = new Array()

  shipShotEvent.parameters.push(
    new ethereum.EventParam("captain", ethereum.Value.fromAddress(captain))
  )
  shipShotEvent.parameters.push(
    new ethereum.EventParam(
      "fromQ",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(fromQ))
    )
  )
  shipShotEvent.parameters.push(
    new ethereum.EventParam(
      "fromR",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(fromR))
    )
  )
  shipShotEvent.parameters.push(
    new ethereum.EventParam(
      "shotQ",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(shotQ))
    )
  )
  shipShotEvent.parameters.push(
    new ethereum.EventParam(
      "shotR",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(shotR))
    )
  )
  shipShotEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return shipShotEvent
}

export function createShipSunkEvent(captain: Address, gameId: i32): ShipSunk {
  let shipSunkEvent = changetype<ShipSunk>(newMockEvent())

  shipSunkEvent.parameters = new Array()

  shipSunkEvent.parameters.push(
    new ethereum.EventParam("captain", ethereum.Value.fromAddress(captain))
  )
  shipSunkEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return shipSunkEvent
}

export function createShipSunkOutOfMapEvent(
  captain: Address,
  gameId: i32
): ShipSunkOutOfMap {
  let shipSunkOutOfMapEvent = changetype<ShipSunkOutOfMap>(newMockEvent())

  shipSunkOutOfMapEvent.parameters = new Array()

  shipSunkOutOfMapEvent.parameters.push(
    new ethereum.EventParam("captain", ethereum.Value.fromAddress(captain))
  )
  shipSunkOutOfMapEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return shipSunkOutOfMapEvent
}

export function createSubmitPhaseStartedEvent(
  gameId: i32,
  round: BigInt
): SubmitPhaseStarted {
  let submitPhaseStartedEvent = changetype<SubmitPhaseStarted>(newMockEvent())

  submitPhaseStartedEvent.parameters = new Array()

  submitPhaseStartedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )
  submitPhaseStartedEvent.parameters.push(
    new ethereum.EventParam("round", ethereum.Value.fromUnsignedBigInt(round))
  )

  return submitPhaseStartedEvent
}

export function createWorldUpdatedEvent(gameId: i32): WorldUpdated {
  let worldUpdatedEvent = changetype<WorldUpdated>(newMockEvent())

  worldUpdatedEvent.parameters = new Array()

  worldUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "gameId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    )
  )

  return worldUpdatedEvent
}
