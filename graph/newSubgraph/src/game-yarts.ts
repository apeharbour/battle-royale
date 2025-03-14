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
  CellDeleted as CellDeletedEvent,
  NewRound as NewRoundEvent,
  MutualShot as MutualShotEvent
} from "../generated/Gameyarts/Gameyarts"
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

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

function shortenAddress(address: Bytes): string {
  return address.toHexString().slice(0, 6) + "..." + address.toHexString().slice(-4)
}


export function handleCommitPhaseStarted(event: CommitPhaseStartedEvent): void {
  log.info('Commit phase started for game {}', [event.params.gameId.toString()])
}

export function handleGameEnded(event: GameEndedEvent): void {
  log.info('Game ended for game {}', [event.params.gameId.toString()])

  
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  
  let game = Game.load(gameId)

  if (!game) {
    game = new Game(gameId)
    game.gameId = event.params.gameId
    game.state = GameState.FINISHED
    game.timeEnded = event.block.timestamp
    game.save()
  }
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
  log.info('New round {} started for game {}', [event.params.roundId.toString(), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  
  // Load the existing game or create a new one if it doesn't exist
  let game = Game.load(gameId)

  if (!game) {
    game = new Game(gameId)
    game.gameId = event.params.gameId
    game.state = GameState.REGISTERING
    game.timeCreated = event.block.timestamp
    game.timeEnded = BigInt.zero()
  }

  const round = createNewRound(gameId, event.params.roundId, event.params.radius);

  // Update game with new round details
  game.currentRound = round.id;
  game.state = GameState.ACTIVE;
  game.save();
}


export function handleGameStarted(event: GameStartedEvent): void {
  log.info('Game started for game {}', [event.params.gameId.toString()])
  log.info('Setting timeCreated for game {} to {}', [event.params.gameId.toString(), event.block.timestamp.toString()])


  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  
  let game = Game.load(gameId)

  if (!game) {
    game = new Game(gameId)
    game.gameId = event.params.gameId
    game.state = GameState.REGISTERING
    game.timeCreated = event.block.timestamp
    game.save()
  }
}


export function handleGameUpdated(event: GameUpdatedEvent): void {
  log.info('Game updated for game {}', [event.params.gameId.toString()])
}

export function handleGameWinner(event: GameWinnerEvent): void {
  log.info('Game winner {} for game {}', [shortenAddress(event.params.winner), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())

  if (event.params.winner != Bytes.fromHexString(ZERO_ADDRESS)) {
  const playerId = gameId.concat(event.params.winner)

  let player = new Player(playerId)
  player.state = PlayerState.WON
  player.save()

  // update game state
  let game = new Game(gameId)
  game.state = GameState.FINISHED
  game.winner = playerId
  game.timeEnded = event.block.timestamp
  game.save()
  } else {
    let game = new Game(gameId)
    game.state = GameState.FINISHED
    game.timeEnded = event.block.timestamp
    game.save()
  }
}

export function handleMapInitialized(event: MapInitializedEvent): void {
  log.info('Map initialized with radius {} for game {}', [event.params.radius.toString(), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const roundId = gameId.concatI32(0)

  let game = Game.load(gameId)

  if (!game) {
    game = new Game(gameId)
    game.timeCreated = event.block.timestamp
    let round = Round.load(roundId)
    if (!round) {
      round = createNewRound(gameId, BigInt.zero(), 0);
    }
    game.currentRound = round.id;
    game.mapShrink = event.params.mapShrink;
  }

  game.gameId = event.params.gameId;
  game.radius = event.params.radius;
  game.centerQ = event.params.radius;
  game.centerR = event.params.radius;
  game.mapShrink = event.params.mapShrink;

  game.save();
}


export function handleMapShrink(event: MapShrinkEvent): void {
  log.info('Map shrunk for game {}', [event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())

  const game = Game.load(gameId)
  if (game) {
    game.radius--
    game.save()

    const round = Round.load(game.currentRound)
    if (round) {
      round.shrunk = true;
      round.radius--;
      round.save();
    }
  }
}

export function handleMoveCommitted(event: MoveCommittedEvent): void {
  log.info('Move committed by {}', [shortenAddress(event.transaction.from)])
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
  log.info('Move submitted by {} for player {}', [shortenAddress(event.transaction.from), shortenAddress(event.params.player)])
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
        log.info('Travel saved with id {} for player {} in round {}', [travelId.toHexString(), event.params.player.toHexString(), round.round.toString()])
        
        move.travel = travelId;
        
        // save shot
        const shotId = moveId.concat(Bytes.fromByteArray(ByteArray.fromUTF8('shot')))
        const shot = new Shot(shotId)
        
        shot.originQ = event.params.destQ
        shot.originR = event.params.destR
        
        shot.destinationQ = event.params.shotQ
        shot.destinationR = event.params.shotR;
        
        shot.save()
        log.info('Shot saved with id {} for player {} in round {}', [shotId.toHexString(), event.params.player.toHexString(), round.round.toString()])
        
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
  log.info('Player {} with ship {} added to game {}', [shortenAddress(event.params.player), event.params.yartsshipId.toString(), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.player)

  let player = new Player(playerId)
  log.info('Player {} created', [shortenAddress(playerId)])

  player.address = event.params.player;
  player.q = event.params.q
  player.r = event.params.r
  player.range = event.params.speed
  player.shotRange = event.params.range
  player.tokenId = event.params.yartsshipId
  player.image = event.params.image
  player.game = gameId
  player.state = PlayerState.ACTIVE
  player.kills = 0

  player.save()
  log.info('Player {} saved in state {}', [shortenAddress(playerId), player.state])

  let game = Game.load(gameId)
  if (game) {
    game.totalPlayers = game.totalPlayers + 1
    game.save()
  }
}

export function handlePlayerDefeated(event: PlayerDefeatedEvent): void {
  log.info('Player {} defeated in game {}', [shortenAddress(event.params.player), event.params.gameId.toString()])
}

export function handleShipCollidedWithIsland(
  event: ShipCollidedWithIslandEvent
): void {
  log.info('Ship of {} collided with island in game {}', [shortenAddress(event.params.captain), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.captain)

  const game = Game.load(gameId)

  if (game) {
    // update player state and position
    let player = new Player(playerId)
    
    player.state = PlayerState.BEACHED
    player.killedInRound = game.currentRound
    player.q = event.params.q
    player.r = event.params.r
    player.save()
  }
}

export function handleShipHit(event: ShipHitEvent): void {
  log.info('Ship of {} hit by {} in game {}', [shortenAddress(event.params.victim), shortenAddress(event.params.attacker), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())

  const game = Game.load(gameId)
  
  if (game) {
    const victimId = gameId.concat(event.params.victim)
    let victim = new Player(victimId)
    victim.state = PlayerState.SHOT
    victim.killedInRound = game.currentRound
    victim.save()

    const attackerId = gameId.concat(event.params.attacker)
    let attacker = Player.load(attackerId)
    if (attacker) {
      attacker.kills++
      attacker.save()
    }
  }
}

export function handleMutualShot(event: MutualShotEvent): void {
  const gameId = Bytes.fromI32(event.params.gameId.toI32());
  const game = Game.load(gameId);

  if (game) {
      for (let i = 0; i < event.params.players.length; i++) {
          const playerId = gameId.concat(event.params.players[i]);
          let player = Player.load(playerId);

          if (player) {
              player.state = PlayerState.SHOT;
              player.killedInRound = game.currentRound;
              player.kills = player.kills + 1; // Increment kill count
              player.save();
          }
      }
  }
}


export function handleShipMoved(event: ShipMovedEvent): void {
  log.info('Ship of {} moved to q {} r {} in game {}', [shortenAddress(event.params.captain), event.params.q.toString(), event.params.r.toString(), event.params.gameId.toString()])
  // update player position
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.captain)

  const player = new Player(playerId)
  player.q = event.params.q;
  player.r = event.params.r;
  player.save();
}

export function handleShipMovedInGame(event: ShipMovedInGameEvent): void {
  log.info('Ship of {} moved in game {}', [shortenAddress(event.params.captain), event.params.gameId.toString()])
}

export function handleShipShot(event: ShipShotEvent): void {
  log.info('Ship of {} shot in game {}', [shortenAddress(event.params.captain), event.params.gameId.toString()])
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
  log.info('Ship of {} sunk in game {}', [shortenAddress(event.params.captain), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.captain)

  let player = Player.load(playerId)
  if (!player) {
    player = new Player(playerId)
    player.kills = 0 
  }
  
  player.state = PlayerState.CRASHED
  
  let game = Game.load(gameId)
  if (game) {
    player.killedInRound = game.currentRound
  }
  player.save()
}


export function handleShipSunkOutOfMap(event: ShipSunkOutOfMapEvent): void {
  log.info('Ship of {} dropped from map in game {}', [shortenAddress(event.params.captain), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const playerId = gameId.concat(event.params.captain)

  let player = Player.load(playerId)
  if (!player) {
    player = new Player(playerId)
    player.kills = 0
  }
  
  player.state = PlayerState.DROPPED

  let game = Game.load(gameId)
  if (game) {
    player.killedInRound = game.currentRound
  }
  player.save()
}


export function handleSubmitPhaseStarted(event: SubmitPhaseStartedEvent): void {
  log.info('Submit phase started for game {}', [event.params.gameId.toString()])
}

export function handleWorldUpdated(event: WorldUpdatedEvent): void {
  log.info('World updated for game {}', [event.params.gameId.toString()])
}

export function handleCell(event: CellEvent): void {
  log.info('Cell ({}, {}{}) created for game {}', [event.params.q.toString(), event.params.r.toString(), event.params.island ? ', island' : '', event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const cellId = gameId.concatI32(event.params.q).concatI32(event.params.r)

  let entity = new Cell(cellId)
  entity.q = event.params.q
  entity.r = event.params.r
  entity.island = event.params.island
  entity.game = gameId

  entity.save()
}

export function handleCellDeleted(event: CellDeletedEvent): void {
  log.info('Cell ({}, {}) deleted for game {}', [event.params.q.toString(), event.params.r.toString(), event.params.gameId.toString()])
  const gameId = Bytes.fromI32(event.params.gameId.toI32())
  const cellId = gameId.concatI32(event.params.q).concatI32(event.params.r)

  const game = Game.load(gameId)
  if (game) {
      const cell = new Cell(cellId)
      cell.deletedInRound = game.currentRound
      cell.save()
    }
  }

