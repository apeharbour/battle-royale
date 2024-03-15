import { BigInt, ByteArray, Bytes, store } from "@graphprotocol/graph-ts"
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
  WorldUpdated as WorldUpdatedEvent,
  // Island as IslandEvent,
  Cell as CellEvent,
  NewRound as NewRoundEvent
} from "../generated/GamePunk/GamePunk"
import {
  Game,
  Move,
  Player,
  Round,
  Shot,
  Cell
} from "../generated/schema"

import { log } from '@graphprotocol/graph-ts'

class PlayerState {
  static ACTIVE: string = "active";
  static DROPPED: string = "dropped";
  static BEACHED: string = "beached";
  static CRASHED: string = "crashed";
  static SHOT: string = "shot";
  static DRAW: string = "draw";
  static WON: string = "won";
}

class GameState {
  static REGISTERING: string = "registering";
  static ACTIVE: string = "active";
  static FINISHED: string = "finished";
}


export function handleCommitPhaseStarted(event: CommitPhaseStartedEvent): void {}

export function handleGameEnded(event: GameEndedEvent): void {}

function createNewRound(_gameId: Bytes, _roundId: BigInt, _radius: i32): Round {
  const roundId = _gameId.concatI32(_roundId.toI32())

  let round = new Round(roundId);
  round.game = _gameId;
  round.round = _roundId;
  round.radius = _radius;
  round.shrunk = false;

  round.save();
  return round;
}

export function handleNewRound(event: NewRoundEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  // const gameId = Bytes.fromI32(event.params.gameId.toI32())

  const round = createNewRound(gameId, event.params.roundId, event.params.radius);

  // update game
  let game = new Game(gameId);
  game.currentRound = round.id;
  game.state = GameState.ACTIVE;
  game.save();

}

export function handleGameStarted(event: GameStartedEvent): void {}

export function handleGameUpdated(event: GameUpdatedEvent): void {}

export function handleGameWinner(event: GameWinnerEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.winner)

  let player = new Player(playerId)
  player.state = PlayerState.WON
  player.save()

  // update game state
  let game = new Game(gameId)
  game.state = GameState.FINISHED
  game.winner = playerId
  game.save()
}

export function handleMapInitialized(event: MapInitializedEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const roundId = gameId.concatI32(0)

  let game = Game.load(gameId)

  if (!game) {
    game = new Game(gameId)
    let round = Round.load(roundId)
    if (!round) {
      round = createNewRound(gameId, BigInt.zero(), 0);
    }
    game.currentRound = round.id;
  }

  game.gameId = event.params.gameId;
  game.radius = event.params.radius;
  game.centerQ = event.params.radius;
  game.centerR = event.params.radius;

  game.save();
}

export function handleMapShrink(event: MapShrinkEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())

  const game = Game.load(gameId)
  if (game) {
    const round = Round.load(game.currentRound)
    if (round) {
      round.shrunk = true;
      round.radius--;
      round.save();
    }
  }
}

export function handleMoveCommitted(event: MoveCommittedEvent): void {}

export function handleMoveSubmitted(event: MoveSubmittedEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.transaction.from)

  let game = Game.load(gameId)

  if (game) {
    let round = Round.load(game.currentRound)
    if (round) {
      const moveId = round.id.concat(event.transaction.from)
      let move = new Move(moveId)
      move.game = gameId;
      move.round = round.id;
      move.player = gameId.concat(event.transaction.from)
      move.destinationQ = event.params.destQ
      move.destinationR = event.params.destR

      let player = Player.load(playerId)
      if (player) {
        move.originQ = player.q;
        move.originR = player.r;
      }
      move.save()
    }
  }
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  log.warning('Contract Ownership transfered from {} to {} ', [event.params.previousOwner.toHexString(), event.params.newOwner.toHexString()])
}

export function handlePlayerAdded(event: PlayerAddedEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.player)

  let player = new Player(playerId)
  log.warning('Player {} created', [playerId.toHexString()])

  player.address = event.params.player;
  player.q = event.params.q
  player.r = event.params.r
  player.range = event.params.range
  player.shotRange = event.params.speed
  player.tokenId = event.params.punkshipId
  player.image = event.params.image
  player.game = gameId
  player.state = PlayerState.ACTIVE
  player.kills = 0

  player.save()
  log.warning('Player {} saved in state {}', [playerId.toHexString(), player.state])
}

export function handlePlayerDefeated(event: PlayerDefeatedEvent): void {}

export function handleShipCollidedWithIsland(
  event: ShipCollidedWithIslandEvent
): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.captain)

  // update player state and position
  let player = new Player(playerId)
  
  player.state = PlayerState.BEACHED
  player.q = event.params.q
  player.r = event.params.r
  player.save()
}

export function handleShipHit(event: ShipHitEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  
  const victimId = gameId.concat(event.params.victim)
  let victim = new Player(victimId)
  victim.state = PlayerState.SHOT
  victim.save()

  const attackerId = gameId.concat(event.params.attacker)
  let attacker = Player.load(attackerId)
  if (attacker) {
    attacker.kills++
    attacker.save()
  }
}

export function handleShipMoved(event: ShipMovedEvent): void {
  // update player position
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.captain)

  log.info('GameId {}, playerId {}, player addr {}', [gameId.toHexString(), playerId.toHex(), event.params.captain.toHexString()])

  const player = new Player(playerId)
  player.q = event.params.q;
  player.r = event.params.r;
  player.save();
}

export function handleShipMovedInGame(event: ShipMovedInGameEvent): void {}

export function handleShipShot(event: ShipShotEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())

  let game = Game.load(gameId)

  if (game) {
    let round = Round.load(game.currentRound)
    if (round) {
      const shotId = round.id.concat(event.params.captain)
      let shot = new Shot(shotId)
      shot.game = gameId;
      shot.round = round.id;
      shot.player = gameId.concat(event.params.captain)
      shot.originQ = event.params.fromQ
      shot.originR = event.params.fromR
      shot.destinationQ = event.params.shotQ
      shot.destinationR = event.params.shotR
      shot.save()
    }
  }
}

export function handleShipSunk(event: ShipSunkEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.captain)

  let player = new Player(playerId)
  player.state = PlayerState.CRASHED
  player.save()
}

export function handleShipSunkOutOfMap(event: ShipSunkOutOfMapEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.captain)

  let player = new Player(playerId)
  log.warning('Player {} created', [playerId.toHexString()])
  player.state = PlayerState.DROPPED
  player.save()
  log.warning('Player {} saved in state {}', [playerId.toHexString(), player.state])
}

export function handleSubmitPhaseStarted(event: SubmitPhaseStartedEvent): void {}

export function handleWorldUpdated(event: WorldUpdatedEvent): void {}

export function handleCell(event: CellEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const cellId = gameId.concatI32(event.params.q).concatI32(event.params.r)

  let entity = new Cell(cellId)
  entity.q = event.params.q
  entity.r = event.params.r
  entity.island = event.params.island
  entity.game = gameId

  entity.save()
}
