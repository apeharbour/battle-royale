import { Bytes } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred as OwnershipTransferredEvent,
  PlayerAdded as PlayerAddedEvent,
  PlayerRegistered as PlayerRegisteredEvent,
  RegistrationClosed as RegistrationClosedEvent,
  RegistrationStarted as RegistrationStartedEvent,
} from "../generated/Registration/Registration";
import {
  OwnershipTransferred,
  PlayerAdded,
  PlayerRegistered,
  RegistrationClosed,
  RegistrationStarted,
  Registration,
  Player,
} from "../generated/schema";

class RegistrationState {
  static readonly OPEN: string = "OPEN";
  static readonly CLOSED: string = "CLOSED";
}

class PlayerState {
  static readonly REGISTERED: string = "REGISTERED";
  static readonly ADDED: string = "ADDED";
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePlayerAdded(event: PlayerAddedEvent): void {
  let entity = new PlayerAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.registrationPhase = event.params.registrationPhase;
  entity.player = event.params.player;
  entity.gameId = event.params.gameId;
  entity.yartsshipId = event.params.yartsshipId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.registration = Bytes.fromI32(event.params.registrationPhase.toI32());

  entity.save();

  // update player entity
  let player = Player.load(
    event.params.player.concatI32(event.params.registrationPhase.toI32())
  );
  if (player) {
    player.state = PlayerState.ADDED;
    player.gameId = event.params.gameId;
    player.save();
  }
}

export function handlePlayerRegistered(event: PlayerRegisteredEvent): void {
  let entity = new PlayerRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.registrationPhase = event.params.registrationPhase;
  entity.player = event.params.player;
  entity.yartsshipId = event.params.yartsshipId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.registration = Bytes.fromI32(event.params.registrationPhase.toI32());

  entity.save();

  // create player entity
  let player = new Player(
    event.params.player.concatI32(event.params.registrationPhase.toI32())
  );
  player.address = event.params.player;
  player.yartsshipId = event.params.yartsshipId;
  player.registration = Bytes.fromI32(event.params.registrationPhase.toI32());
  player.state = PlayerState.REGISTERED;
  player.save();
}

export function handleRegistrationClosed(event: RegistrationClosedEvent): void {
  let entity = new RegistrationClosed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.registrationPhase = event.params.registrationPhase;
  entity.gameId = event.params.gameId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.registration = Bytes.fromI32(event.params.registrationPhase.toI32());

  entity.save();

  // update registration entity
  let registration = Registration.load(
    Bytes.fromI32(event.params.registrationPhase.toI32())
  );
  if (registration) {
    registration.state = RegistrationState.CLOSED;
    registration.save();
  }
}

export function handleRegistrationStarted(
  event: RegistrationStartedEvent
): void {
  let entity = new RegistrationStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.registrationPhase = event.params.registrationPhase;
  entity.firstGameId = event.params.firstGameId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.registration = Bytes.fromI32(event.params.registrationPhase.toI32());

  entity.save();

  // create registration entity

  let registration = new Registration(
    Bytes.fromI32(event.params.registrationPhase.toI32())
  );
  registration.phase = event.params.registrationPhase;
  registration.state = RegistrationState.OPEN;
  registration.firstGameId = event.params.firstGameId;

  registration.save();
}
