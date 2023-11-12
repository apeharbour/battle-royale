import { BigInt, Bytes, store } from "@graphprotocol/graph-ts"
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
  Game,
  GameEnded,
  GameStarted,
  GameUpdated,
  GameWinner,
  MapInitialized,
  MapShrink,
  Move,
  MoveCommitted,
  MoveSubmitted,
  OwnershipTransferred,
  Player,
  PlayerAdded,
  PlayerDefeated,
  Round,
  ShipCollidedWithIsland,
  ShipHit,
  ShipMoved,
  ShipMovedInGame,
  ShipShot,
  ShipSunk,
  ShipSunkOutOfMap,
  Shot,
  SubmitPhaseStarted,
  WorldUpdated
} from "../generated/schema"


class PlayerState {
  static ACTIVE: string = "Null";
  static DROPPED: string = "Submitted";
  static BEACHED: string = "Executed";
  static CRASHED: string = "Rejected";
  static SHOT: string = "Passed";
  static DRAW: string = "Pended";
  static WON: string = "Expired";
}


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

function initRound(gameId: Bytes, roundNumber: BigInt, radius: i32, shrunk: boolean): Round  {
  let roundId = gameId.concatI32(roundNumber.toI32());

  let round = new Round(roundId);
  round.round = roundNumber;
  round.radius = radius;
  round.shrunk = shrunk;

  round.save();

  return round;
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

  const gameId = event.address.concatI32(event.params.gameId)
  const round = initRound(gameId, BigInt.zero(), 0, false)
  let game = new Game(gameId)
  game.currentRound = round.id
  game.save()
}

export function handleGameUpdated(event: GameUpdatedEvent): void {
  let entity = new GameUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameStatus = event.params.gameStatus
  entity.winnerAddress = event.params.winnerAddress
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGameWinner(event: GameWinnerEvent): void {
  let entity = new GameWinner(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.winner = event.params.winner
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const gameId = event.address.concatI32(event.params.gameId)
  const playerId = gameId.concat(event.params.winner)

  let player = new Player(playerId)
  player.state = PlayerState.WON
  player.save()
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

  const gameId = event.address.concatI32(event.params.gameId)
  let round = initRound(gameId, BigInt.zero(), event.params.radius, false);

  let game = new Game(gameId)

  game.radius = event.params.radius;
  game.centerQ = event.params.radius;
  game.centerR = event.params.radius;

  game.save();

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

  const gameId = event.address.concatI32(event.params.gameId)

  let game = Game.load(gameId)
  if (game) {
    let round = new Round(game.currentRound)
      round.shrunk = true;
      round.save();

  }
}

export function handleMoveCommitted(event: MoveCommittedEvent): void {
  let entity = new MoveCommitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.player = event.params.player
  entity.gameId = event.params.gameId

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
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const gameId = event.address.concatI32(event.params.gameId)

  let game = Game.load(gameId)

  if (game && game.currentRound) {
    let round = Round.load(game.currentRound)
    if (round) {
      const moveId = round.id.concat(event.transaction.from)
      let move = new Move(moveId)
      move.game = gameId;
      move.round = round.id;
      move.player = gameId.concat(event.transaction.from)
      move.destinationQ = event.params.destQ
      move.destinationR = event.params.destR
      move.save()
    }
  }
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

  const gameId = event.address.concatI32(event.params.gameId)
  const playerId = gameId.concat(event.params.player)

  let player = new Player(playerId)

  player.address = event.params.player;
  player.q = event.params.q
  player.r = event.params.r
  player.range = event.params.range
  player.shotRange = event.params.speed
  player.game = gameId
  player.state = PlayerState.ACTIVE

  player.save()
}

export function handlePlayerDefeated(event: PlayerDefeatedEvent): void {
  let entity = new PlayerDefeated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.player = event.params.player
  entity.gameId = event.params.gameId

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
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const gameId = event.address.concatI32(event.params.gameId)
  const playerId = gameId.concat(event.params.captain)

  let player = new Player(playerId)
  player.state = PlayerState.BEACHED
  player.save()
}

export function handleShipHit(event: ShipHitEvent): void {
  let entity = new ShipHit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.victim = event.params.victim
  entity.attacker = event.params.attacker
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const gameId = event.address.concatI32(event.params.gameId)
  
  const victimId = gameId.concat(event.params.victim)
  let victim = new Player(victimId)
  victim.state = PlayerState.SHOT
  victim.save()

  const attackerId = gameId.concat(event.params.attacker)
  let attacker = Player.load(attackerId)
  if (attacker) {
    attacker.kills += 1
    attacker.save()
  }
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
  entity.gameId = event.params.gameId

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
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const gameId = event.address.concatI32(event.params.gameId)

  let game = Game.load(gameId)

  if (game && game.currentRound) {
    let round = Round.load(game.currentRound)
    if (round) {
      const shotId = round.id.concat(event.transaction.from)
      let shot = new Shot(shotId)
      shot.game = gameId;
      shot.round = round.id;
      shot.player = gameId.concat(event.transaction.from)
      shot.originQ = event.params.fromQ
      shot.originR = event.params.fromR
      shot.destinationQ = event.params.shotQ
      shot.destinationR = event.params.shotR
      shot.save()
    }
  }
}

export function handleShipSunk(event: ShipSunkEvent): void {
  let entity = new ShipSunk(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.captain = event.params.captain
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const gameId = event.address.concatI32(event.params.gameId)
  const playerId = gameId.concat(event.params.captain)

  let player = new Player(playerId)
  player.state = PlayerState.CRASHED
  player.save()
}

export function handleShipSunkOutOfMap(event: ShipSunkOutOfMapEvent): void {
  let entity = new ShipSunkOutOfMap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.captain = event.params.captain
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const gameId = event.address.concatI32(event.params.gameId)
  const playerId = gameId.concat(event.params.captain)

  let player = new Player(playerId)
  player.state = PlayerState.DROPPED
  player.save()
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

  const gameId = event.address.concatI32(event.params.gameId)
  let game = Game.load(gameId)

  if (game) {
    initRound(gameId, event.params.round, game.radius, false)
  }

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
