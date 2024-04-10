import {
  OwnershipTransferred as OwnershipTransferredEvent,
  PlayerAdded as PlayerAddedEvent,
  PlayerRegistered as PlayerRegisteredEvent,
  RegistrationClosed as RegistrationClosedEvent,
  RegistrationStarted as RegistrationStartedEvent
} from "../generated/Registration/Registration"
import {
  OwnershipTransferred,
  PlayerAdded,
  PlayerRegistered,
  RegistrationClosed,
  RegistrationStarted
} from "../generated/schema"

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
  entity.registrationPhase = event.params.registrationPhase
  entity.player = event.params.player
  entity.gameId = event.params.gameId
  entity.punkshipId = event.params.punkshipId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePlayerRegistered(event: PlayerRegisteredEvent): void {
  let entity = new PlayerRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.registrationPhase = event.params.registrationPhase
  entity.player = event.params.player
  entity.punkshipId = event.params.punkshipId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRegistrationClosed(event: RegistrationClosedEvent): void {
  let entity = new RegistrationClosed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.registrationPhase = event.params.registrationPhase
  entity.gameId = event.params.gameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRegistrationStarted(
  event: RegistrationStartedEvent
): void {
  let entity = new RegistrationStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.registrationPhase = event.params.registrationPhase
  entity.firstGameId = event.params.firstGameId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
