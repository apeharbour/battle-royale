// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Cell extends ethereum.Event {
  get params(): Cell__Params {
    return new Cell__Params(this);
  }
}

export class Cell__Params {
  _event: Cell;

  constructor(event: Cell) {
    this._event = event;
  }

  get gameId(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get q(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get r(): i32 {
    return this._event.parameters[2].value.toI32();
  }

  get island(): boolean {
    return this._event.parameters[3].value.toBoolean();
  }
}

export class CommitPhaseStarted extends ethereum.Event {
  get params(): CommitPhaseStarted__Params {
    return new CommitPhaseStarted__Params(this);
  }
}

export class CommitPhaseStarted__Params {
  _event: CommitPhaseStarted;

  constructor(event: CommitPhaseStarted) {
    this._event = event;
  }

  get gameId(): i32 {
    return this._event.parameters[0].value.toI32();
  }
}

export class GameEnded extends ethereum.Event {
  get params(): GameEnded__Params {
    return new GameEnded__Params(this);
  }
}

export class GameEnded__Params {
  _event: GameEnded;

  constructor(event: GameEnded) {
    this._event = event;
  }

  get gameId(): i32 {
    return this._event.parameters[0].value.toI32();
  }
}

export class GameStarted extends ethereum.Event {
  get params(): GameStarted__Params {
    return new GameStarted__Params(this);
  }
}

export class GameStarted__Params {
  _event: GameStarted;

  constructor(event: GameStarted) {
    this._event = event;
  }

  get gameId(): i32 {
    return this._event.parameters[0].value.toI32();
  }
}

export class GameUpdated extends ethereum.Event {
  get params(): GameUpdated__Params {
    return new GameUpdated__Params(this);
  }
}

export class GameUpdated__Params {
  _event: GameUpdated;

  constructor(event: GameUpdated) {
    this._event = event;
  }

  get gameStatus(): boolean {
    return this._event.parameters[0].value.toBoolean();
  }

  get winnerAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get gameId(): i32 {
    return this._event.parameters[2].value.toI32();
  }
}

export class GameWinner extends ethereum.Event {
  get params(): GameWinner__Params {
    return new GameWinner__Params(this);
  }
}

export class GameWinner__Params {
  _event: GameWinner;

  constructor(event: GameWinner) {
    this._event = event;
  }

  get winner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get gameId(): i32 {
    return this._event.parameters[1].value.toI32();
  }
}

export class Island extends ethereum.Event {
  get params(): Island__Params {
    return new Island__Params(this);
  }
}

export class Island__Params {
  _event: Island;

  constructor(event: Island) {
    this._event = event;
  }

  get gameId(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get q(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get r(): i32 {
    return this._event.parameters[2].value.toI32();
  }
}

export class MapInitialized extends ethereum.Event {
  get params(): MapInitialized__Params {
    return new MapInitialized__Params(this);
  }
}

export class MapInitialized__Params {
  _event: MapInitialized;

  constructor(event: MapInitialized) {
    this._event = event;
  }

  get radius(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get gameId(): i32 {
    return this._event.parameters[1].value.toI32();
  }
}

export class MapShrink extends ethereum.Event {
  get params(): MapShrink__Params {
    return new MapShrink__Params(this);
  }
}

export class MapShrink__Params {
  _event: MapShrink;

  constructor(event: MapShrink) {
    this._event = event;
  }

  get gameId(): i32 {
    return this._event.parameters[0].value.toI32();
  }
}

export class MoveCommitted extends ethereum.Event {
  get params(): MoveCommitted__Params {
    return new MoveCommitted__Params(this);
  }
}

export class MoveCommitted__Params {
  _event: MoveCommitted;

  constructor(event: MoveCommitted) {
    this._event = event;
  }

  get player(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get gameId(): i32 {
    return this._event.parameters[1].value.toI32();
  }
}

export class MoveSubmitted extends ethereum.Event {
  get params(): MoveSubmitted__Params {
    return new MoveSubmitted__Params(this);
  }
}

export class MoveSubmitted__Params {
  _event: MoveSubmitted;

  constructor(event: MoveSubmitted) {
    this._event = event;
  }

  get player(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get gameId(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get roundId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get destQ(): i32 {
    return this._event.parameters[3].value.toI32();
  }

  get destR(): i32 {
    return this._event.parameters[4].value.toI32();
  }

  get shotQ(): i32 {
    return this._event.parameters[5].value.toI32();
  }

  get shotR(): i32 {
    return this._event.parameters[6].value.toI32();
  }
}

export class NewRound extends ethereum.Event {
  get params(): NewRound__Params {
    return new NewRound__Params(this);
  }
}

export class NewRound__Params {
  _event: NewRound;

  constructor(event: NewRound) {
    this._event = event;
  }

  get gameId(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get roundId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get radius(): i32 {
    return this._event.parameters[2].value.toI32();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PlayerAdded extends ethereum.Event {
  get params(): PlayerAdded__Params {
    return new PlayerAdded__Params(this);
  }
}

export class PlayerAdded__Params {
  _event: PlayerAdded;

  constructor(event: PlayerAdded) {
    this._event = event;
  }

  get player(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get gameId(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get q(): i32 {
    return this._event.parameters[2].value.toI32();
  }

  get r(): i32 {
    return this._event.parameters[3].value.toI32();
  }

  get speed(): i32 {
    return this._event.parameters[4].value.toI32();
  }

  get range(): i32 {
    return this._event.parameters[5].value.toI32();
  }
}

export class PlayerDefeated extends ethereum.Event {
  get params(): PlayerDefeated__Params {
    return new PlayerDefeated__Params(this);
  }
}

export class PlayerDefeated__Params {
  _event: PlayerDefeated;

  constructor(event: PlayerDefeated) {
    this._event = event;
  }

  get player(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get gameId(): i32 {
    return this._event.parameters[1].value.toI32();
  }
}

export class ShipCollidedWithIsland extends ethereum.Event {
  get params(): ShipCollidedWithIsland__Params {
    return new ShipCollidedWithIsland__Params(this);
  }
}

export class ShipCollidedWithIsland__Params {
  _event: ShipCollidedWithIsland;

  constructor(event: ShipCollidedWithIsland) {
    this._event = event;
  }

  get captain(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get gameId(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get q(): i32 {
    return this._event.parameters[2].value.toI32();
  }

  get r(): i32 {
    return this._event.parameters[3].value.toI32();
  }
}

export class ShipHit extends ethereum.Event {
  get params(): ShipHit__Params {
    return new ShipHit__Params(this);
  }
}

export class ShipHit__Params {
  _event: ShipHit;

  constructor(event: ShipHit) {
    this._event = event;
  }

  get victim(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get attacker(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get gameId(): i32 {
    return this._event.parameters[2].value.toI32();
  }
}

export class ShipMoved extends ethereum.Event {
  get params(): ShipMoved__Params {
    return new ShipMoved__Params(this);
  }
}

export class ShipMoved__Params {
  _event: ShipMoved;

  constructor(event: ShipMoved) {
    this._event = event;
  }

  get captain(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get initialQ(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get initialR(): i32 {
    return this._event.parameters[2].value.toI32();
  }

  get q(): i32 {
    return this._event.parameters[3].value.toI32();
  }

  get r(): i32 {
    return this._event.parameters[4].value.toI32();
  }

  get gameId(): i32 {
    return this._event.parameters[5].value.toI32();
  }
}

export class ShipMovedInGame extends ethereum.Event {
  get params(): ShipMovedInGame__Params {
    return new ShipMovedInGame__Params(this);
  }
}

export class ShipMovedInGame__Params {
  _event: ShipMovedInGame;

  constructor(event: ShipMovedInGame) {
    this._event = event;
  }

  get captain(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get gameId(): i32 {
    return this._event.parameters[1].value.toI32();
  }
}

export class ShipShot extends ethereum.Event {
  get params(): ShipShot__Params {
    return new ShipShot__Params(this);
  }
}

export class ShipShot__Params {
  _event: ShipShot;

  constructor(event: ShipShot) {
    this._event = event;
  }

  get captain(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get fromQ(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get fromR(): i32 {
    return this._event.parameters[2].value.toI32();
  }

  get shotQ(): i32 {
    return this._event.parameters[3].value.toI32();
  }

  get shotR(): i32 {
    return this._event.parameters[4].value.toI32();
  }

  get gameId(): i32 {
    return this._event.parameters[5].value.toI32();
  }
}

export class ShipSunk extends ethereum.Event {
  get params(): ShipSunk__Params {
    return new ShipSunk__Params(this);
  }
}

export class ShipSunk__Params {
  _event: ShipSunk;

  constructor(event: ShipSunk) {
    this._event = event;
  }

  get captain(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get gameId(): i32 {
    return this._event.parameters[1].value.toI32();
  }
}

export class ShipSunkOutOfMap extends ethereum.Event {
  get params(): ShipSunkOutOfMap__Params {
    return new ShipSunkOutOfMap__Params(this);
  }
}

export class ShipSunkOutOfMap__Params {
  _event: ShipSunkOutOfMap;

  constructor(event: ShipSunkOutOfMap) {
    this._event = event;
  }

  get captain(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get gameId(): i32 {
    return this._event.parameters[1].value.toI32();
  }
}

export class SubmitPhaseStarted extends ethereum.Event {
  get params(): SubmitPhaseStarted__Params {
    return new SubmitPhaseStarted__Params(this);
  }
}

export class SubmitPhaseStarted__Params {
  _event: SubmitPhaseStarted;

  constructor(event: SubmitPhaseStarted) {
    this._event = event;
  }

  get gameId(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get round(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class WorldUpdated extends ethereum.Event {
  get params(): WorldUpdated__Params {
    return new WorldUpdated__Params(this);
  }
}

export class WorldUpdated__Params {
  _event: WorldUpdated;

  constructor(event: WorldUpdated) {
    this._event = event;
  }

  get gameId(): i32 {
    return this._event.parameters[0].value.toI32();
  }
}

export class GamePunk__gamesResult {
  value0: BigInt;
  value1: i32;
  value2: boolean;
  value3: boolean;
  value4: boolean;
  value5: boolean;

  constructor(
    value0: BigInt,
    value1: i32,
    value2: boolean,
    value3: boolean,
    value4: boolean,
    value5: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set(
      "value1",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value1))
    );
    map.set("value2", ethereum.Value.fromBoolean(this.value2));
    map.set("value3", ethereum.Value.fromBoolean(this.value3));
    map.set("value4", ethereum.Value.fromBoolean(this.value4));
    map.set("value5", ethereum.Value.fromBoolean(this.value5));
    return map;
  }

  getRound(): BigInt {
    return this.value0;
  }

  getShrinkNo(): i32 {
    return this.value1;
  }

  getGameInProgress(): boolean {
    return this.value2;
  }

  getStopAddingShips(): boolean {
    return this.value3;
  }

  getLetCommitMoves(): boolean {
    return this.value4;
  }

  getLetSubmitMoves(): boolean {
    return this.value5;
  }
}

export class GamePunk__getCellResultValue0Struct extends ethereum.Tuple {
  get q(): i32 {
    return this[0].toI32();
  }

  get r(): i32 {
    return this[1].toI32();
  }

  get island(): boolean {
    return this[2].toBoolean();
  }

  get exists(): boolean {
    return this[3].toBoolean();
  }
}

export class GamePunk__getCellInput_coordStruct extends ethereum.Tuple {
  get q(): i32 {
    return this[0].toI32();
  }

  get r(): i32 {
    return this[1].toI32();
  }
}

export class GamePunk__getCellsResultValue0Struct extends ethereum.Tuple {
  get q(): i32 {
    return this[0].toI32();
  }

  get r(): i32 {
    return this[1].toI32();
  }
}

export class GamePunk__getShipsResultValue0Struct extends ethereum.Tuple {
  get coordinate(): GamePunk__getShipsResultValue0CoordinateStruct {
    return changetype<GamePunk__getShipsResultValue0CoordinateStruct>(
      this[0].toTuple()
    );
  }

  get travelDirection(): i32 {
    return this[1].toI32();
  }

  get travelDistance(): i32 {
    return this[2].toI32();
  }

  get shotDirection(): i32 {
    return this[3].toI32();
  }

  get shotDistance(): i32 {
    return this[4].toI32();
  }

  get publishedMove(): boolean {
    return this[5].toBoolean();
  }

  get captain(): Address {
    return this[6].toAddress();
  }

  get yachtSpeed(): i32 {
    return this[7].toI32();
  }

  get yachtRange(): i32 {
    return this[8].toI32();
  }

  get gameId(): i32 {
    return this[9].toI32();
  }
}

export class GamePunk__getShipsResultValue0CoordinateStruct extends ethereum.Tuple {
  get q(): i32 {
    return this[0].toI32();
  }

  get r(): i32 {
    return this[1].toI32();
  }
}

export class GamePunk__moveResultValue0Struct extends ethereum.Tuple {
  get q(): i32 {
    return this[0].toI32();
  }

  get r(): i32 {
    return this[1].toI32();
  }
}

export class GamePunk__moveInput_startStruct extends ethereum.Tuple {
  get q(): i32 {
    return this[0].toI32();
  }

  get r(): i32 {
    return this[1].toI32();
  }
}

export class GamePunk extends ethereum.SmartContract {
  static bind(address: Address): GamePunk {
    return new GamePunk("GamePunk", address);
  }

  games(param0: BigInt): GamePunk__gamesResult {
    let result = super.call(
      "games",
      "games(uint256):(uint256,uint8,bool,bool,bool,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new GamePunk__gamesResult(
      result[0].toBigInt(),
      result[1].toI32(),
      result[2].toBoolean(),
      result[3].toBoolean(),
      result[4].toBoolean(),
      result[5].toBoolean()
    );
  }

  try_games(param0: BigInt): ethereum.CallResult<GamePunk__gamesResult> {
    let result = super.tryCall(
      "games",
      "games(uint256):(uint256,uint8,bool,bool,bool,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new GamePunk__gamesResult(
        value[0].toBigInt(),
        value[1].toI32(),
        value[2].toBoolean(),
        value[3].toBoolean(),
        value[4].toBoolean(),
        value[5].toBoolean()
      )
    );
  }

  getCell(
    _coord: GamePunk__getCellInput_coordStruct,
    gameId: i32
  ): GamePunk__getCellResultValue0Struct {
    let result = super.call(
      "getCell",
      "getCell((uint8,uint8),uint8):((uint8,uint8,bool,bool))",
      [
        ethereum.Value.fromTuple(_coord),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
      ]
    );

    return changetype<GamePunk__getCellResultValue0Struct>(result[0].toTuple());
  }

  try_getCell(
    _coord: GamePunk__getCellInput_coordStruct,
    gameId: i32
  ): ethereum.CallResult<GamePunk__getCellResultValue0Struct> {
    let result = super.tryCall(
      "getCell",
      "getCell((uint8,uint8),uint8):((uint8,uint8,bool,bool))",
      [
        ethereum.Value.fromTuple(_coord),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<GamePunk__getCellResultValue0Struct>(value[0].toTuple())
    );
  }

  getCells(gameId: i32): Array<GamePunk__getCellsResultValue0Struct> {
    let result = super.call("getCells", "getCells(uint8):((uint8,uint8)[])", [
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    ]);

    return result[0].toTupleArray<GamePunk__getCellsResultValue0Struct>();
  }

  try_getCells(
    gameId: i32
  ): ethereum.CallResult<Array<GamePunk__getCellsResultValue0Struct>> {
    let result = super.tryCall(
      "getCells",
      "getCells(uint8):((uint8,uint8)[])",
      [ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<GamePunk__getCellsResultValue0Struct>()
    );
  }

  getRadius(gameId: i32): i32 {
    let result = super.call("getRadius", "getRadius(uint8):(uint8)", [
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    ]);

    return result[0].toI32();
  }

  try_getRadius(gameId: i32): ethereum.CallResult<i32> {
    let result = super.tryCall("getRadius", "getRadius(uint8):(uint8)", [
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  getShips(gameId: i32): Array<GamePunk__getShipsResultValue0Struct> {
    let result = super.call(
      "getShips",
      "getShips(uint8):(((uint8,uint8),uint8,uint8,uint8,uint8,bool,address,uint8,uint8,uint8)[])",
      [ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))]
    );

    return result[0].toTupleArray<GamePunk__getShipsResultValue0Struct>();
  }

  try_getShips(
    gameId: i32
  ): ethereum.CallResult<Array<GamePunk__getShipsResultValue0Struct>> {
    let result = super.tryCall(
      "getShips",
      "getShips(uint8):(((uint8,uint8),uint8,uint8,uint8,uint8,bool,address,uint8,uint8,uint8)[])",
      [ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<GamePunk__getShipsResultValue0Struct>()
    );
  }

  move(
    _start: GamePunk__moveInput_startStruct,
    _dir: i32,
    _distance: i32,
    gameId: i32
  ): GamePunk__moveResultValue0Struct {
    let result = super.call(
      "move",
      "move((uint8,uint8),uint8,uint8,uint8):((uint8,uint8))",
      [
        ethereum.Value.fromTuple(_start),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(_dir)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(_distance)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
      ]
    );

    return changetype<GamePunk__moveResultValue0Struct>(result[0].toTuple());
  }

  try_move(
    _start: GamePunk__moveInput_startStruct,
    _dir: i32,
    _distance: i32,
    gameId: i32
  ): ethereum.CallResult<GamePunk__moveResultValue0Struct> {
    let result = super.tryCall(
      "move",
      "move((uint8,uint8),uint8,uint8,uint8):((uint8,uint8))",
      [
        ethereum.Value.fromTuple(_start),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(_dir)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(_distance)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gameId))
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<GamePunk__moveResultValue0Struct>(value[0].toTuple())
    );
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  registrationContract(): Address {
    let result = super.call(
      "registrationContract",
      "registrationContract():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_registrationContract(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "registrationContract",
      "registrationContract():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _mapAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AddShipCall extends ethereum.Call {
  get inputs(): AddShipCall__Inputs {
    return new AddShipCall__Inputs(this);
  }

  get outputs(): AddShipCall__Outputs {
    return new AddShipCall__Outputs(this);
  }
}

export class AddShipCall__Inputs {
  _call: AddShipCall;

  constructor(call: AddShipCall) {
    this._call = call;
  }

  get playerAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get gameId(): i32 {
    return this._call.inputValues[1].value.toI32();
  }

  get _speed(): i32 {
    return this._call.inputValues[2].value.toI32();
  }

  get _range(): i32 {
    return this._call.inputValues[3].value.toI32();
  }
}

export class AddShipCall__Outputs {
  _call: AddShipCall;

  constructor(call: AddShipCall) {
    this._call = call;
  }
}

export class CommitMoveCall extends ethereum.Call {
  get inputs(): CommitMoveCall__Inputs {
    return new CommitMoveCall__Inputs(this);
  }

  get outputs(): CommitMoveCall__Outputs {
    return new CommitMoveCall__Outputs(this);
  }
}

export class CommitMoveCall__Inputs {
  _call: CommitMoveCall;

  constructor(call: CommitMoveCall) {
    this._call = call;
  }

  get moveHash(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get gameId(): i32 {
    return this._call.inputValues[1].value.toI32();
  }
}

export class CommitMoveCall__Outputs {
  _call: CommitMoveCall;

  constructor(call: CommitMoveCall) {
    this._call = call;
  }
}

export class EndGameCall extends ethereum.Call {
  get inputs(): EndGameCall__Inputs {
    return new EndGameCall__Inputs(this);
  }

  get outputs(): EndGameCall__Outputs {
    return new EndGameCall__Outputs(this);
  }
}

export class EndGameCall__Inputs {
  _call: EndGameCall;

  constructor(call: EndGameCall) {
    this._call = call;
  }

  get gameId(): i32 {
    return this._call.inputValues[0].value.toI32();
  }
}

export class EndGameCall__Outputs {
  _call: EndGameCall;

  constructor(call: EndGameCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetRegistrationContractCall extends ethereum.Call {
  get inputs(): SetRegistrationContractCall__Inputs {
    return new SetRegistrationContractCall__Inputs(this);
  }

  get outputs(): SetRegistrationContractCall__Outputs {
    return new SetRegistrationContractCall__Outputs(this);
  }
}

export class SetRegistrationContractCall__Inputs {
  _call: SetRegistrationContractCall;

  constructor(call: SetRegistrationContractCall) {
    this._call = call;
  }

  get _registrationContract(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetRegistrationContractCall__Outputs {
  _call: SetRegistrationContractCall;

  constructor(call: SetRegistrationContractCall) {
    this._call = call;
  }
}

export class StartNewGameCall extends ethereum.Call {
  get inputs(): StartNewGameCall__Inputs {
    return new StartNewGameCall__Inputs(this);
  }

  get outputs(): StartNewGameCall__Outputs {
    return new StartNewGameCall__Outputs(this);
  }
}

export class StartNewGameCall__Inputs {
  _call: StartNewGameCall;

  constructor(call: StartNewGameCall) {
    this._call = call;
  }

  get gameId(): i32 {
    return this._call.inputValues[0].value.toI32();
  }

  get _radius(): i32 {
    return this._call.inputValues[1].value.toI32();
  }
}

export class StartNewGameCall__Outputs {
  _call: StartNewGameCall;

  constructor(call: StartNewGameCall) {
    this._call = call;
  }
}

export class SubmitMoveCall extends ethereum.Call {
  get inputs(): SubmitMoveCall__Inputs {
    return new SubmitMoveCall__Inputs(this);
  }

  get outputs(): SubmitMoveCall__Outputs {
    return new SubmitMoveCall__Outputs(this);
  }
}

export class SubmitMoveCall__Inputs {
  _call: SubmitMoveCall;

  constructor(call: SubmitMoveCall) {
    this._call = call;
  }

  get _travelDirections(): Array<i32> {
    return this._call.inputValues[0].value.toI32Array();
  }

  get _travelDistances(): Array<i32> {
    return this._call.inputValues[1].value.toI32Array();
  }

  get _shotDirections(): Array<i32> {
    return this._call.inputValues[2].value.toI32Array();
  }

  get _shotDistances(): Array<i32> {
    return this._call.inputValues[3].value.toI32Array();
  }

  get _secrets(): Array<i32> {
    return this._call.inputValues[4].value.toI32Array();
  }

  get _playerAddresses(): Array<Address> {
    return this._call.inputValues[5].value.toAddressArray();
  }

  get gameId(): i32 {
    return this._call.inputValues[6].value.toI32();
  }
}

export class SubmitMoveCall__Outputs {
  _call: SubmitMoveCall;

  constructor(call: SubmitMoveCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class TravelCall extends ethereum.Call {
  get inputs(): TravelCall__Inputs {
    return new TravelCall__Inputs(this);
  }

  get outputs(): TravelCall__Outputs {
    return new TravelCall__Outputs(this);
  }
}

export class TravelCall__Inputs {
  _call: TravelCall;

  constructor(call: TravelCall) {
    this._call = call;
  }

  get _startCell(): TravelCall_startCellStruct {
    return changetype<TravelCall_startCellStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }

  get _direction(): i32 {
    return this._call.inputValues[1].value.toI32();
  }

  get _distance(): i32 {
    return this._call.inputValues[2].value.toI32();
  }

  get gameId(): i32 {
    return this._call.inputValues[3].value.toI32();
  }
}

export class TravelCall__Outputs {
  _call: TravelCall;

  constructor(call: TravelCall) {
    this._call = call;
  }
}

export class TravelCall_startCellStruct extends ethereum.Tuple {
  get q(): i32 {
    return this[0].toI32();
  }

  get r(): i32 {
    return this[1].toI32();
  }
}

export class UpdateWorldCall extends ethereum.Call {
  get inputs(): UpdateWorldCall__Inputs {
    return new UpdateWorldCall__Inputs(this);
  }

  get outputs(): UpdateWorldCall__Outputs {
    return new UpdateWorldCall__Outputs(this);
  }
}

export class UpdateWorldCall__Inputs {
  _call: UpdateWorldCall;

  constructor(call: UpdateWorldCall) {
    this._call = call;
  }

  get gameId(): i32 {
    return this._call.inputValues[0].value.toI32();
  }
}

export class UpdateWorldCall__Outputs {
  _call: UpdateWorldCall;

  constructor(call: UpdateWorldCall) {
    this._call = call;
  }
}
