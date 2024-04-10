import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  PlayerAdded,
  PlayerRegistered,
  RegistrationClosed,
  RegistrationStarted
} from "../generated/Registration/Registration"

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
  registrationPhase: BigInt,
  player: Address,
  gameId: BigInt,
  punkshipId: BigInt
): PlayerAdded {
  let playerAddedEvent = changetype<PlayerAdded>(newMockEvent())

  playerAddedEvent.parameters = new Array()

  playerAddedEvent.parameters.push(
    new ethereum.EventParam(
      "registrationPhase",
      ethereum.Value.fromUnsignedBigInt(registrationPhase)
    )
  )
  playerAddedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  playerAddedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )
  playerAddedEvent.parameters.push(
    new ethereum.EventParam(
      "punkshipId",
      ethereum.Value.fromUnsignedBigInt(punkshipId)
    )
  )

  return playerAddedEvent
}

export function createPlayerRegisteredEvent(
  registrationPhase: BigInt,
  player: Address,
  punkshipId: BigInt
): PlayerRegistered {
  let playerRegisteredEvent = changetype<PlayerRegistered>(newMockEvent())

  playerRegisteredEvent.parameters = new Array()

  playerRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "registrationPhase",
      ethereum.Value.fromUnsignedBigInt(registrationPhase)
    )
  )
  playerRegisteredEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  playerRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "punkshipId",
      ethereum.Value.fromUnsignedBigInt(punkshipId)
    )
  )

  return playerRegisteredEvent
}

export function createRegistrationClosedEvent(
  registrationPhase: BigInt,
  gameId: BigInt
): RegistrationClosed {
  let registrationClosedEvent = changetype<RegistrationClosed>(newMockEvent())

  registrationClosedEvent.parameters = new Array()

  registrationClosedEvent.parameters.push(
    new ethereum.EventParam(
      "registrationPhase",
      ethereum.Value.fromUnsignedBigInt(registrationPhase)
    )
  )
  registrationClosedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId))
  )

  return registrationClosedEvent
}

export function createRegistrationStartedEvent(
  registrationPhase: BigInt,
  firstGameId: BigInt
): RegistrationStarted {
  let registrationStartedEvent = changetype<RegistrationStarted>(newMockEvent())

  registrationStartedEvent.parameters = new Array()

  registrationStartedEvent.parameters.push(
    new ethereum.EventParam(
      "registrationPhase",
      ethereum.Value.fromUnsignedBigInt(registrationPhase)
    )
  )
  registrationStartedEvent.parameters.push(
    new ethereum.EventParam(
      "firstGameId",
      ethereum.Value.fromUnsignedBigInt(firstGameId)
    )
  )

  return registrationStartedEvent
}
