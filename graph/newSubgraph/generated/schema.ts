// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal,
} from "@graphprotocol/graph-ts";

export class Game extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Game entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Game must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Game", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Game | null {
    return changetype<Game | null>(
      store.get_in_block("Game", id.toHexString()),
    );
  }

  static load(id: Bytes): Game | null {
    return changetype<Game | null>(store.get("Game", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get gameId(): BigInt | null {
    let value = this.get("gameId");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set gameId(value: BigInt | null) {
    if (!value) {
      this.unset("gameId");
    } else {
      this.set("gameId", Value.fromBigInt(<BigInt>value));
    }
  }

  get radius(): i32 {
    let value = this.get("radius");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set radius(value: i32) {
    this.set("radius", Value.fromI32(value));
  }

  get centerQ(): i32 {
    let value = this.get("centerQ");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set centerQ(value: i32) {
    this.set("centerQ", Value.fromI32(value));
  }

  get centerR(): i32 {
    let value = this.get("centerR");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set centerR(value: i32) {
    this.set("centerR", Value.fromI32(value));
  }

  get currentRound(): Bytes {
    let value = this.get("currentRound");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set currentRound(value: Bytes) {
    this.set("currentRound", Value.fromBytes(value));
  }

  get state(): string {
    let value = this.get("state");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set state(value: string) {
    this.set("state", Value.fromString(value));
  }

  get winner(): Bytes | null {
    let value = this.get("winner");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set winner(value: Bytes | null) {
    if (!value) {
      this.unset("winner");
    } else {
      this.set("winner", Value.fromBytes(<Bytes>value));
    }
  }

  get players(): PlayerLoader {
    return new PlayerLoader(
      "Game",
      this.get("id")!.toBytes().toHexString(),
      "players",
    );
  }

  get rounds(): RoundLoader {
    return new RoundLoader(
      "Game",
      this.get("id")!.toBytes().toHexString(),
      "rounds",
    );
  }

  get cells(): CellLoader {
    return new CellLoader(
      "Game",
      this.get("id")!.toBytes().toHexString(),
      "cells",
    );
  }

  get mapShrink(): i32 {
    let value = this.get("mapShrink");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set mapShrink(value: i32) {
    this.set("mapShrink", Value.fromI32(value));
  }

  get totalPlayers(): i32 {
    let value = this.get("totalPlayers");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set totalPlayers(value: i32) {
    this.set("totalPlayers", Value.fromI32(value));
  }

  get timeCreated(): BigInt | null {
    let value = this.get("timeCreated");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set timeCreated(value: BigInt | null) {
    if (!value) {
      this.unset("timeCreated");
    } else {
      this.set("timeCreated", Value.fromBigInt(<BigInt>value));
    }
  }

  get timeEnded(): BigInt | null {
    let value = this.get("timeEnded");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set timeEnded(value: BigInt | null) {
    if (!value) {
      this.unset("timeEnded");
    } else {
      this.set("timeEnded", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class Player extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Player entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Player must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Player", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Player | null {
    return changetype<Player | null>(
      store.get_in_block("Player", id.toHexString()),
    );
  }

  static load(id: Bytes): Player | null {
    return changetype<Player | null>(store.get("Player", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get q(): i32 {
    let value = this.get("q");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set q(value: i32) {
    this.set("q", Value.fromI32(value));
  }

  get r(): i32 {
    let value = this.get("r");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set r(value: i32) {
    this.set("r", Value.fromI32(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get range(): i32 {
    let value = this.get("range");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set range(value: i32) {
    this.set("range", Value.fromI32(value));
  }

  get shotRange(): i32 {
    let value = this.get("shotRange");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set shotRange(value: i32) {
    this.set("shotRange", Value.fromI32(value));
  }

  get image(): string {
    let value = this.get("image");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set image(value: string) {
    this.set("image", Value.fromString(value));
  }

  get game(): Bytes {
    let value = this.get("game");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set game(value: Bytes) {
    this.set("game", Value.fromBytes(value));
  }

  get state(): string {
    let value = this.get("state");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set state(value: string) {
    this.set("state", Value.fromString(value));
  }

  get killedInRound(): Bytes | null {
    let value = this.get("killedInRound");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set killedInRound(value: Bytes | null) {
    if (!value) {
      this.unset("killedInRound");
    } else {
      this.set("killedInRound", Value.fromBytes(<Bytes>value));
    }
  }

  get kills(): i32 {
    let value = this.get("kills");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set kills(value: i32) {
    this.set("kills", Value.fromI32(value));
  }

  get moves(): MoveLoader {
    return new MoveLoader(
      "Player",
      this.get("id")!.toBytes().toHexString(),
      "moves",
    );
  }
}

export class Round extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Round entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Round must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Round", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Round | null {
    return changetype<Round | null>(
      store.get_in_block("Round", id.toHexString()),
    );
  }

  static load(id: Bytes): Round | null {
    return changetype<Round | null>(store.get("Round", id.toHexString()));
  }

  get game(): Bytes | null {
    let value = this.get("game");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set game(value: Bytes | null) {
    if (!value) {
      this.unset("game");
    } else {
      this.set("game", Value.fromBytes(<Bytes>value));
    }
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get round(): BigInt {
    let value = this.get("round");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set round(value: BigInt) {
    this.set("round", Value.fromBigInt(value));
  }

  get radius(): i32 {
    let value = this.get("radius");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set radius(value: i32) {
    this.set("radius", Value.fromI32(value));
  }

  get shrunk(): boolean {
    let value = this.get("shrunk");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set shrunk(value: boolean) {
    this.set("shrunk", Value.fromBoolean(value));
  }

  get moves(): MoveLoader {
    return new MoveLoader(
      "Round",
      this.get("id")!.toBytes().toHexString(),
      "moves",
    );
  }

  get deletedCells(): CellLoader {
    return new CellLoader(
      "Round",
      this.get("id")!.toBytes().toHexString(),
      "deletedCells",
    );
  }
}

export class Move extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Move entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Move must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Move", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Move | null {
    return changetype<Move | null>(
      store.get_in_block("Move", id.toHexString()),
    );
  }

  static load(id: Bytes): Move | null {
    return changetype<Move | null>(store.get("Move", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get game(): Bytes {
    let value = this.get("game");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set game(value: Bytes) {
    this.set("game", Value.fromBytes(value));
  }

  get round(): Bytes {
    let value = this.get("round");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set round(value: Bytes) {
    this.set("round", Value.fromBytes(value));
  }

  get player(): Bytes {
    let value = this.get("player");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set player(value: Bytes) {
    this.set("player", Value.fromBytes(value));
  }

  get commitment(): Bytes | null {
    let value = this.get("commitment");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set commitment(value: Bytes | null) {
    if (!value) {
      this.unset("commitment");
    } else {
      this.set("commitment", Value.fromBytes(<Bytes>value));
    }
  }

  get travel(): Bytes | null {
    let value = this.get("travel");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set travel(value: Bytes | null) {
    if (!value) {
      this.unset("travel");
    } else {
      this.set("travel", Value.fromBytes(<Bytes>value));
    }
  }

  get shot(): Bytes | null {
    let value = this.get("shot");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set shot(value: Bytes | null) {
    if (!value) {
      this.unset("shot");
    } else {
      this.set("shot", Value.fromBytes(<Bytes>value));
    }
  }
}

export class Travel extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Travel entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Travel must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Travel", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Travel | null {
    return changetype<Travel | null>(
      store.get_in_block("Travel", id.toHexString()),
    );
  }

  static load(id: Bytes): Travel | null {
    return changetype<Travel | null>(store.get("Travel", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get originQ(): i32 {
    let value = this.get("originQ");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set originQ(value: i32) {
    this.set("originQ", Value.fromI32(value));
  }

  get originR(): i32 {
    let value = this.get("originR");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set originR(value: i32) {
    this.set("originR", Value.fromI32(value));
  }

  get destinationQ(): i32 {
    let value = this.get("destinationQ");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set destinationQ(value: i32) {
    this.set("destinationQ", Value.fromI32(value));
  }

  get destinationR(): i32 {
    let value = this.get("destinationR");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set destinationR(value: i32) {
    this.set("destinationR", Value.fromI32(value));
  }
}

export class Shot extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Shot entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Shot must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Shot", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Shot | null {
    return changetype<Shot | null>(
      store.get_in_block("Shot", id.toHexString()),
    );
  }

  static load(id: Bytes): Shot | null {
    return changetype<Shot | null>(store.get("Shot", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get originQ(): i32 {
    let value = this.get("originQ");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set originQ(value: i32) {
    this.set("originQ", Value.fromI32(value));
  }

  get originR(): i32 {
    let value = this.get("originR");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set originR(value: i32) {
    this.set("originR", Value.fromI32(value));
  }

  get destinationQ(): i32 {
    let value = this.get("destinationQ");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set destinationQ(value: i32) {
    this.set("destinationQ", Value.fromI32(value));
  }

  get destinationR(): i32 {
    let value = this.get("destinationR");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set destinationR(value: i32) {
    this.set("destinationR", Value.fromI32(value));
  }
}

export class Cell extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Cell entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Cell must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Cell", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Cell | null {
    return changetype<Cell | null>(
      store.get_in_block("Cell", id.toHexString()),
    );
  }

  static load(id: Bytes): Cell | null {
    return changetype<Cell | null>(store.get("Cell", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get game(): Bytes {
    let value = this.get("game");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set game(value: Bytes) {
    this.set("game", Value.fromBytes(value));
  }

  get q(): i32 {
    let value = this.get("q");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set q(value: i32) {
    this.set("q", Value.fromI32(value));
  }

  get r(): i32 {
    let value = this.get("r");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set r(value: i32) {
    this.set("r", Value.fromI32(value));
  }

  get island(): boolean {
    let value = this.get("island");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set island(value: boolean) {
    this.set("island", Value.fromBoolean(value));
  }

  get deletedInRound(): Bytes | null {
    let value = this.get("deletedInRound");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set deletedInRound(value: Bytes | null) {
    if (!value) {
      this.unset("deletedInRound");
    } else {
      this.set("deletedInRound", Value.fromBytes(<Bytes>value));
    }
  }
}

export class PlayerLoader extends Entity {
  _entity: string;
  _field: string;
  _id: string;

  constructor(entity: string, id: string, field: string) {
    super();
    this._entity = entity;
    this._id = id;
    this._field = field;
  }

  load(): Player[] {
    let value = store.loadRelated(this._entity, this._id, this._field);
    return changetype<Player[]>(value);
  }
}

export class RoundLoader extends Entity {
  _entity: string;
  _field: string;
  _id: string;

  constructor(entity: string, id: string, field: string) {
    super();
    this._entity = entity;
    this._id = id;
    this._field = field;
  }

  load(): Round[] {
    let value = store.loadRelated(this._entity, this._id, this._field);
    return changetype<Round[]>(value);
  }
}

export class CellLoader extends Entity {
  _entity: string;
  _field: string;
  _id: string;

  constructor(entity: string, id: string, field: string) {
    super();
    this._entity = entity;
    this._id = id;
    this._field = field;
  }

  load(): Cell[] {
    let value = store.loadRelated(this._entity, this._id, this._field);
    return changetype<Cell[]>(value);
  }
}

export class MoveLoader extends Entity {
  _entity: string;
  _field: string;
  _id: string;

  constructor(entity: string, id: string, field: string) {
    super();
    this._entity = entity;
    this._id = id;
    this._field = field;
  }

  load(): Move[] {
    let value = store.loadRelated(this._entity, this._id, this._field);
    return changetype<Move[]>(value);
  }
}
