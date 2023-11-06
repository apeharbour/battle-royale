import {
  CommitPhaseStarted as CommitPhaseStartedEvent,
  GameEnded as GameEndedEvent,
  GameStarted as GameStartedEvent,
  GameUpdated as GameUpdatedEvent,
  GameWinner as GameWinnerEvent,
  MapInitialized as MapInitializedEvent,
  MapShrink as MapShrinkEvent,
  MoveCommitted as MoveCommittedEvent,
  MoveSubmitted as MoveSubmittedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PlayerAdded as PlayerAddedEvent,
  PlayerDefeated as PlayerDefeatedEvent,
  ShipCollidedWithIsland as ShipCollidedWithIslandEvent,
  ShipHit as ShipHitEvent,
  ShipMoved as ShipMovedEvent,
  ShipMovedInGame as ShipMovedInGameEvent,
  ShipShot as ShipShotEvent,
  ShipSunk as ShipSunkEvent,
  ShipSunkOutOfMap as ShipSunkOutOfMapEvent,
  SubmitPhaseStarted as SubmitPhaseStartedEvent,
  WorldUpdated as WorldUpdatedEvent
} from "../generated/GameWOT/GameWOT"
import {
  CommitPhaseStarted,
  GameEnded,
  GameStarted,
  GameUpdated,
  GameWinner,
  MapInitialized,
  MapShrink,
  MoveCommitted,
  MoveSubmitted,
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
} from "../generated/schema"

export function handleCommitPhaseStarted(event: CommitPhaseStartedEvent): void {
  let entity = new CommitPhaseStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGameEnded(event: GameEndedEvent): void {
  let entity = new GameEnded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGameStarted(event: GameStartedEvent): void {
  let entity = new GameStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGameUpdated(event: GameUpdatedEvent): void {
  let entity = new GameUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameStatus = event.params.gameStatus
  entity.winnerAddress = event.params.winnerAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGameWinner(event: GameWinnerEvent): void {
  let entity = new GameWinner(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameWinner = event.params.gameWinner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMapInitialized(event: MapInitializedEvent): void {
  let entity = new MapInitialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.radius = event.params.radius
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMapShrink(event: MapShrinkEvent): void {
  let entity = new MapShrink(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMoveCommitted(event: MoveCommittedEvent): void {
  let entity = new MoveCommitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.player = event.params.player

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMoveSubmitted(event: MoveSubmittedEvent): void {
  let entity = new MoveSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.player = event.params.player

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePlayerAdded(event: PlayerAddedEvent): void {
  let entity = new PlayerAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.player = event.params.player
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePlayerDefeated(event: PlayerDefeatedEvent): void {
  let entity = new PlayerDefeated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.player = event.params.player

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleShipCollidedWithIsland(
  event: ShipCollidedWithIslandEvent
): void {
  let entity = new ShipCollidedWithIsland(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.captain = event.params.captain

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleShipHit(event: ShipHitEvent): void {
  let entity = new ShipHit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.victim = event.params.victim
  entity.attacker = event.params.attacker

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleShipMoved(event: ShipMovedEvent): void {
  let entity = new ShipMoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.captain = event.params.captain
  entity.initialQ = event.params.initialQ
  entity.initialR = event.params.initialR
  entity.q = event.params.q
  entity.r = event.params.r

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleShipMovedInGame(event: ShipMovedInGameEvent): void {
  let entity = new ShipMovedInGame(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.captain = event.params.captain
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleShipShot(event: ShipShotEvent): void {
  let entity = new ShipShot(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.captain = event.params.captain
  entity.fromQ = event.params.fromQ
  entity.fromR = event.params.fromR
  entity.shotQ = event.params.shotQ
  entity.shotR = event.params.shotR

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleShipSunk(event: ShipSunkEvent): void {
  let entity = new ShipSunk(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.captain = event.params.captain

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleShipSunkOutOfMap(event: ShipSunkOutOfMapEvent): void {
  let entity = new ShipSunkOutOfMap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.captain = event.params.captain

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubmitPhaseStarted(event: SubmitPhaseStartedEvent): void {
  let entity = new SubmitPhaseStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameId = event.params.gameId
  entity.round = event.params.round

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWorldUpdated(event: WorldUpdatedEvent): void {
  let entity = new WorldUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
