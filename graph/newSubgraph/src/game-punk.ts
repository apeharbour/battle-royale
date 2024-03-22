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
  Travel,
  Player,
  Round,
  Move,
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

function shortenAddress(address: Bytes): string {
  return address.toHexString().slice(0, 6) + "..." + address.toHexString().slice(-4)
}


export function handleCommitPhaseStarted(event: CommitPhaseStartedEvent): void {
  log.debug('Commit phase started for game {}', [event.params.gameId.toString()])
}

export function handleGameEnded(event: GameEndedEvent): void {
  log.debug('Game ended for game {}', [event.params.gameId.toString()])
}

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
  log.debug('New round {} started for game {}', [event.params.roundId.toString(), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  // const gameId = Bytes.fromI32(event.params.gameId.toI32())

  const round = createNewRound(gameId, event.params.roundId, event.params.radius);

  // update game
  let game = new Game(gameId);
  game.currentRound = round.id;
  game.state = GameState.ACTIVE;
  game.save();

}

export function handleGameStarted(event: GameStartedEvent): void {
  log.debug('Game started for game {}', [event.params.gameId.toString()])
}

export function handleGameUpdated(event: GameUpdatedEvent): void {
  log.debug('Game updated for game {}', [event.params.gameId.toString()])
}

export function handleGameWinner(event: GameWinnerEvent): void {
  log.debug('Game winner {} for game {}', [shortenAddress(event.params.winner), event.params.gameId.toString()])
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
  log.debug('Map initialized with radius {} for game {}', [event.params.radius.toString(), event.params.gameId.toString()])
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
  log.debug('Map shrunk for game {}', [event.params.gameId.toString()])
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

export function handleMoveCommitted(event: MoveCommittedEvent): void {
  log.debug('Move committed by {}', [shortenAddress(event.transaction.from)])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.transaction.from)

  const game = Game.load(gameId)
  if (game) {
    const round = Round.load(game.currentRound)
    if (round) {
      const moveId = round.id.concat(event.transaction.from)
      const move = new Move(moveId)
      move.game = gameId;
      move.round = round.id;
      move.player = playerId;
      // First move is always empty, we need the event to publish the hash
      move.commitment = event.params.moveHash;
      move.save();
    }
  }

}

export function handleMoveSubmitted(event: MoveSubmittedEvent): void {
  log.debug('Move submitted by {} for player {}', [shortenAddress(event.transaction.from), shortenAddress(event.params.player)])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.player)

  const game = Game.load(gameId)

  if (game) {
    const round = Round.load(game.currentRound)
    if (round) {
      const moveId = round.id.concat(event.params.player)

      const move = Move.load(moveId)
      if (move) {

        // save travel
        const travelId = moveId.concat(Bytes.fromByteArray(ByteArray.fromUTF8('travel')))
        const travel = new Travel(travelId)

        travel.destinationQ = event.params.destQ;
        travel.destinationR = event.params.destR;

        let player = Player.load(playerId)
        if (player) {
          travel.originQ = player.q;
          travel.originR = player.r;
        }
        travel.save()
        log.debug('Travel saved with id {} for player {} in round {}', [travelId.toHexString(), event.params.player.toHexString(), round.round.toString()])
        
        move.travel = travelId;
        
        // save shot
        const shotId = moveId.concat(Bytes.fromByteArray(ByteArray.fromUTF8('shot')))
        const shot = new Shot(shotId)
        
        shot.originQ = event.params.destQ
        shot.originR = event.params.destR
        
        shot.destinationQ = event.params.shotQ
        shot.destinationR = event.params.shotR;
        
        shot.save()
        log.debug('Shot saved with id {} for player {} in round {}', [shotId.toHexString(), event.params.player.toHexString(), round.round.toString()])
        
        move.shot = shotId;
        move.save();
      }
    }
  }
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  log.warning('Contract Ownership transfered from {} to {} ', [shortenAddress(event.params.previousOwner), shortenAddress(event.params.newOwner)])
}

export function handlePlayerAdded(event: PlayerAddedEvent): void {
  log.debug('Player {} with ship {} added to game {}', [shortenAddress(event.params.player), event.params.punkshipId.toString(), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.player)

  let player = new Player(playerId)
  log.debug('Player {} created', [shortenAddress(playerId)])

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
  log.info('Player {} saved in state {}', [shortenAddress(playerId), player.state])
}

export function handlePlayerDefeated(event: PlayerDefeatedEvent): void {
  log.debug('Player {} defeated in game {}', [shortenAddress(event.params.player), event.params.gameId.toString()])
}

export function handleShipCollidedWithIsland(
  event: ShipCollidedWithIslandEvent
): void {
  log.debug('Ship of {} collided with island in game {}', [shortenAddress(event.params.captain), event.params.gameId.toString()])
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
  log.debug('Ship of {} hit by {} in game {}', [shortenAddress(event.params.victim), shortenAddress(event.params.attacker), event.params.gameId.toString()])
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
  log.debug('Ship of {} moved to q {} r {} in game {}', [shortenAddress(event.params.captain), event.params.q.toString(), event.params.r.toString(), event.params.gameId.toString()])
  // update player position
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.captain)

  const player = new Player(playerId)
  player.q = event.params.q;
  player.r = event.params.r;
  player.save();
}

export function handleShipMovedInGame(event: ShipMovedInGameEvent): void {
  log.debug('Ship of {} moved in game {}', [shortenAddress(event.params.captain), event.params.gameId.toString()])
}

export function handleShipShot(event: ShipShotEvent): void {
  log.debug('Ship of {} shot in game {}', [shortenAddress(event.params.captain), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())

  // let game = Game.load(gameId)

  // if (game) {
  //   let round = Round.load(game.currentRound)
  //   if (round) {
  //     const shotId = round.id.concat(event.params.captain)
  //     let shot = new Shot(shotId)
  //     shot.game = gameId;
  //     shot.round = round.id;
  //     shot.player = gameId.concat(event.params.captain)
  //     shot.originQ = event.params.fromQ
  //     shot.originR = event.params.fromR
  //     shot.destinationQ = event.params.shotQ
  //     shot.destinationR = event.params.shotR
  //     shot.save()
  //   }
  // }
}

export function handleShipSunk(event: ShipSunkEvent): void {
  log.debug('Ship of {} sunk in game {}', [shortenAddress(event.params.captain), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.captain)

  let player = new Player(playerId)
  player.state = PlayerState.CRASHED
  player.save()
}

export function handleShipSunkOutOfMap(event: ShipSunkOutOfMapEvent): void {
  log.debug('Ship of {} dropped from map in game {}', [shortenAddress(event.params.captain), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.captain)

  let player = new Player(playerId)
  log.debug('Player {} created', [shortenAddress(playerId)])
  player.state = PlayerState.DROPPED
  player.save()
  log.info('Player {} saved in state {}', [shortenAddress(playerId), player.state])
}

export function handleSubmitPhaseStarted(event: SubmitPhaseStartedEvent): void {
  log.debug('Submit phase started for game {}', [event.params.gameId.toString()])
}

export function handleWorldUpdated(event: WorldUpdatedEvent): void {
  log.debug('World updated for game {}', [event.params.gameId.toString()])
}

export function handleCell(event: CellEvent): void {
  log.debug('Cell ({}, {}{}) created for game {}', [event.params.q.toString(), event.params.r.toString(), event.params.island ? ', island' : '', event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const cellId = gameId.concatI32(event.params.q).concatI32(event.params.r)

  let entity = new Cell(cellId)
  entity.q = event.params.q
  entity.r = event.params.r
  entity.island = event.params.island
  entity.game = gameId

  entity.save()
}
