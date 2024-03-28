// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace NewSubgraphTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
  Int8: any;
};

export type Aggregation_interval =
  | 'hour'
  | 'day';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Cell = {
  id: Scalars['Bytes'];
  game: Game;
  q: Scalars['Int'];
  r: Scalars['Int'];
  island: Scalars['Boolean'];
  deletedInRound?: Maybe<Round>;
};

export type Cell_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  game?: InputMaybe<Scalars['String']>;
  game_not?: InputMaybe<Scalars['String']>;
  game_gt?: InputMaybe<Scalars['String']>;
  game_lt?: InputMaybe<Scalars['String']>;
  game_gte?: InputMaybe<Scalars['String']>;
  game_lte?: InputMaybe<Scalars['String']>;
  game_in?: InputMaybe<Array<Scalars['String']>>;
  game_not_in?: InputMaybe<Array<Scalars['String']>>;
  game_contains?: InputMaybe<Scalars['String']>;
  game_contains_nocase?: InputMaybe<Scalars['String']>;
  game_not_contains?: InputMaybe<Scalars['String']>;
  game_not_contains_nocase?: InputMaybe<Scalars['String']>;
  game_starts_with?: InputMaybe<Scalars['String']>;
  game_starts_with_nocase?: InputMaybe<Scalars['String']>;
  game_not_starts_with?: InputMaybe<Scalars['String']>;
  game_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  game_ends_with?: InputMaybe<Scalars['String']>;
  game_ends_with_nocase?: InputMaybe<Scalars['String']>;
  game_not_ends_with?: InputMaybe<Scalars['String']>;
  game_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  game_?: InputMaybe<Game_filter>;
  q?: InputMaybe<Scalars['Int']>;
  q_not?: InputMaybe<Scalars['Int']>;
  q_gt?: InputMaybe<Scalars['Int']>;
  q_lt?: InputMaybe<Scalars['Int']>;
  q_gte?: InputMaybe<Scalars['Int']>;
  q_lte?: InputMaybe<Scalars['Int']>;
  q_in?: InputMaybe<Array<Scalars['Int']>>;
  q_not_in?: InputMaybe<Array<Scalars['Int']>>;
  r?: InputMaybe<Scalars['Int']>;
  r_not?: InputMaybe<Scalars['Int']>;
  r_gt?: InputMaybe<Scalars['Int']>;
  r_lt?: InputMaybe<Scalars['Int']>;
  r_gte?: InputMaybe<Scalars['Int']>;
  r_lte?: InputMaybe<Scalars['Int']>;
  r_in?: InputMaybe<Array<Scalars['Int']>>;
  r_not_in?: InputMaybe<Array<Scalars['Int']>>;
  island?: InputMaybe<Scalars['Boolean']>;
  island_not?: InputMaybe<Scalars['Boolean']>;
  island_in?: InputMaybe<Array<Scalars['Boolean']>>;
  island_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  deletedInRound?: InputMaybe<Scalars['String']>;
  deletedInRound_not?: InputMaybe<Scalars['String']>;
  deletedInRound_gt?: InputMaybe<Scalars['String']>;
  deletedInRound_lt?: InputMaybe<Scalars['String']>;
  deletedInRound_gte?: InputMaybe<Scalars['String']>;
  deletedInRound_lte?: InputMaybe<Scalars['String']>;
  deletedInRound_in?: InputMaybe<Array<Scalars['String']>>;
  deletedInRound_not_in?: InputMaybe<Array<Scalars['String']>>;
  deletedInRound_contains?: InputMaybe<Scalars['String']>;
  deletedInRound_contains_nocase?: InputMaybe<Scalars['String']>;
  deletedInRound_not_contains?: InputMaybe<Scalars['String']>;
  deletedInRound_not_contains_nocase?: InputMaybe<Scalars['String']>;
  deletedInRound_starts_with?: InputMaybe<Scalars['String']>;
  deletedInRound_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deletedInRound_not_starts_with?: InputMaybe<Scalars['String']>;
  deletedInRound_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deletedInRound_ends_with?: InputMaybe<Scalars['String']>;
  deletedInRound_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deletedInRound_not_ends_with?: InputMaybe<Scalars['String']>;
  deletedInRound_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deletedInRound_?: InputMaybe<Round_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Cell_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Cell_filter>>>;
};

export type Cell_orderBy =
  | 'id'
  | 'game'
  | 'game__id'
  | 'game__gameId'
  | 'game__radius'
  | 'game__centerQ'
  | 'game__centerR'
  | 'game__state'
  | 'q'
  | 'r'
  | 'island'
  | 'deletedInRound'
  | 'deletedInRound__id'
  | 'deletedInRound__round'
  | 'deletedInRound__radius'
  | 'deletedInRound__shrunk';

export type Game = {
  id: Scalars['Bytes'];
  gameId?: Maybe<Scalars['BigInt']>;
  radius?: Maybe<Scalars['Int']>;
  centerQ?: Maybe<Scalars['Int']>;
  centerR?: Maybe<Scalars['Int']>;
  currentRound: Round;
  state: GameState;
  winner?: Maybe<Player>;
  players: Array<Player>;
  rounds: Array<Round>;
  cells: Array<Cell>;
};


export type GameplayersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Player_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Player_filter>;
};


export type GameroundsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Round_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Round_filter>;
};


export type GamecellsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Cell_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Cell_filter>;
};

export type GameState =
  | 'registering'
  | 'active'
  | 'finished';

export type Game_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  gameId?: InputMaybe<Scalars['BigInt']>;
  gameId_not?: InputMaybe<Scalars['BigInt']>;
  gameId_gt?: InputMaybe<Scalars['BigInt']>;
  gameId_lt?: InputMaybe<Scalars['BigInt']>;
  gameId_gte?: InputMaybe<Scalars['BigInt']>;
  gameId_lte?: InputMaybe<Scalars['BigInt']>;
  gameId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gameId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  radius?: InputMaybe<Scalars['Int']>;
  radius_not?: InputMaybe<Scalars['Int']>;
  radius_gt?: InputMaybe<Scalars['Int']>;
  radius_lt?: InputMaybe<Scalars['Int']>;
  radius_gte?: InputMaybe<Scalars['Int']>;
  radius_lte?: InputMaybe<Scalars['Int']>;
  radius_in?: InputMaybe<Array<Scalars['Int']>>;
  radius_not_in?: InputMaybe<Array<Scalars['Int']>>;
  centerQ?: InputMaybe<Scalars['Int']>;
  centerQ_not?: InputMaybe<Scalars['Int']>;
  centerQ_gt?: InputMaybe<Scalars['Int']>;
  centerQ_lt?: InputMaybe<Scalars['Int']>;
  centerQ_gte?: InputMaybe<Scalars['Int']>;
  centerQ_lte?: InputMaybe<Scalars['Int']>;
  centerQ_in?: InputMaybe<Array<Scalars['Int']>>;
  centerQ_not_in?: InputMaybe<Array<Scalars['Int']>>;
  centerR?: InputMaybe<Scalars['Int']>;
  centerR_not?: InputMaybe<Scalars['Int']>;
  centerR_gt?: InputMaybe<Scalars['Int']>;
  centerR_lt?: InputMaybe<Scalars['Int']>;
  centerR_gte?: InputMaybe<Scalars['Int']>;
  centerR_lte?: InputMaybe<Scalars['Int']>;
  centerR_in?: InputMaybe<Array<Scalars['Int']>>;
  centerR_not_in?: InputMaybe<Array<Scalars['Int']>>;
  currentRound?: InputMaybe<Scalars['String']>;
  currentRound_not?: InputMaybe<Scalars['String']>;
  currentRound_gt?: InputMaybe<Scalars['String']>;
  currentRound_lt?: InputMaybe<Scalars['String']>;
  currentRound_gte?: InputMaybe<Scalars['String']>;
  currentRound_lte?: InputMaybe<Scalars['String']>;
  currentRound_in?: InputMaybe<Array<Scalars['String']>>;
  currentRound_not_in?: InputMaybe<Array<Scalars['String']>>;
  currentRound_contains?: InputMaybe<Scalars['String']>;
  currentRound_contains_nocase?: InputMaybe<Scalars['String']>;
  currentRound_not_contains?: InputMaybe<Scalars['String']>;
  currentRound_not_contains_nocase?: InputMaybe<Scalars['String']>;
  currentRound_starts_with?: InputMaybe<Scalars['String']>;
  currentRound_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentRound_not_starts_with?: InputMaybe<Scalars['String']>;
  currentRound_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentRound_ends_with?: InputMaybe<Scalars['String']>;
  currentRound_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentRound_not_ends_with?: InputMaybe<Scalars['String']>;
  currentRound_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentRound_?: InputMaybe<Round_filter>;
  state?: InputMaybe<GameState>;
  state_not?: InputMaybe<GameState>;
  state_in?: InputMaybe<Array<GameState>>;
  state_not_in?: InputMaybe<Array<GameState>>;
  winner?: InputMaybe<Scalars['String']>;
  winner_not?: InputMaybe<Scalars['String']>;
  winner_gt?: InputMaybe<Scalars['String']>;
  winner_lt?: InputMaybe<Scalars['String']>;
  winner_gte?: InputMaybe<Scalars['String']>;
  winner_lte?: InputMaybe<Scalars['String']>;
  winner_in?: InputMaybe<Array<Scalars['String']>>;
  winner_not_in?: InputMaybe<Array<Scalars['String']>>;
  winner_contains?: InputMaybe<Scalars['String']>;
  winner_contains_nocase?: InputMaybe<Scalars['String']>;
  winner_not_contains?: InputMaybe<Scalars['String']>;
  winner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  winner_starts_with?: InputMaybe<Scalars['String']>;
  winner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  winner_not_starts_with?: InputMaybe<Scalars['String']>;
  winner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  winner_ends_with?: InputMaybe<Scalars['String']>;
  winner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  winner_not_ends_with?: InputMaybe<Scalars['String']>;
  winner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  winner_?: InputMaybe<Player_filter>;
  players_?: InputMaybe<Player_filter>;
  rounds_?: InputMaybe<Round_filter>;
  cells_?: InputMaybe<Cell_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Game_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Game_filter>>>;
};

export type Game_orderBy =
  | 'id'
  | 'gameId'
  | 'radius'
  | 'centerQ'
  | 'centerR'
  | 'currentRound'
  | 'currentRound__id'
  | 'currentRound__round'
  | 'currentRound__radius'
  | 'currentRound__shrunk'
  | 'state'
  | 'winner'
  | 'winner__id'
  | 'winner__address'
  | 'winner__q'
  | 'winner__r'
  | 'winner__tokenId'
  | 'winner__range'
  | 'winner__shotRange'
  | 'winner__image'
  | 'winner__state'
  | 'winner__kills'
  | 'players'
  | 'rounds'
  | 'cells';

export type Move = {
  id: Scalars['Bytes'];
  game: Game;
  round: Round;
  player: Player;
  commitment?: Maybe<Scalars['Bytes']>;
  travel?: Maybe<Travel>;
  shot?: Maybe<Shot>;
};

export type Move_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  game?: InputMaybe<Scalars['String']>;
  game_not?: InputMaybe<Scalars['String']>;
  game_gt?: InputMaybe<Scalars['String']>;
  game_lt?: InputMaybe<Scalars['String']>;
  game_gte?: InputMaybe<Scalars['String']>;
  game_lte?: InputMaybe<Scalars['String']>;
  game_in?: InputMaybe<Array<Scalars['String']>>;
  game_not_in?: InputMaybe<Array<Scalars['String']>>;
  game_contains?: InputMaybe<Scalars['String']>;
  game_contains_nocase?: InputMaybe<Scalars['String']>;
  game_not_contains?: InputMaybe<Scalars['String']>;
  game_not_contains_nocase?: InputMaybe<Scalars['String']>;
  game_starts_with?: InputMaybe<Scalars['String']>;
  game_starts_with_nocase?: InputMaybe<Scalars['String']>;
  game_not_starts_with?: InputMaybe<Scalars['String']>;
  game_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  game_ends_with?: InputMaybe<Scalars['String']>;
  game_ends_with_nocase?: InputMaybe<Scalars['String']>;
  game_not_ends_with?: InputMaybe<Scalars['String']>;
  game_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  game_?: InputMaybe<Game_filter>;
  round?: InputMaybe<Scalars['String']>;
  round_not?: InputMaybe<Scalars['String']>;
  round_gt?: InputMaybe<Scalars['String']>;
  round_lt?: InputMaybe<Scalars['String']>;
  round_gte?: InputMaybe<Scalars['String']>;
  round_lte?: InputMaybe<Scalars['String']>;
  round_in?: InputMaybe<Array<Scalars['String']>>;
  round_not_in?: InputMaybe<Array<Scalars['String']>>;
  round_contains?: InputMaybe<Scalars['String']>;
  round_contains_nocase?: InputMaybe<Scalars['String']>;
  round_not_contains?: InputMaybe<Scalars['String']>;
  round_not_contains_nocase?: InputMaybe<Scalars['String']>;
  round_starts_with?: InputMaybe<Scalars['String']>;
  round_starts_with_nocase?: InputMaybe<Scalars['String']>;
  round_not_starts_with?: InputMaybe<Scalars['String']>;
  round_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  round_ends_with?: InputMaybe<Scalars['String']>;
  round_ends_with_nocase?: InputMaybe<Scalars['String']>;
  round_not_ends_with?: InputMaybe<Scalars['String']>;
  round_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  round_?: InputMaybe<Round_filter>;
  player?: InputMaybe<Scalars['String']>;
  player_not?: InputMaybe<Scalars['String']>;
  player_gt?: InputMaybe<Scalars['String']>;
  player_lt?: InputMaybe<Scalars['String']>;
  player_gte?: InputMaybe<Scalars['String']>;
  player_lte?: InputMaybe<Scalars['String']>;
  player_in?: InputMaybe<Array<Scalars['String']>>;
  player_not_in?: InputMaybe<Array<Scalars['String']>>;
  player_contains?: InputMaybe<Scalars['String']>;
  player_contains_nocase?: InputMaybe<Scalars['String']>;
  player_not_contains?: InputMaybe<Scalars['String']>;
  player_not_contains_nocase?: InputMaybe<Scalars['String']>;
  player_starts_with?: InputMaybe<Scalars['String']>;
  player_starts_with_nocase?: InputMaybe<Scalars['String']>;
  player_not_starts_with?: InputMaybe<Scalars['String']>;
  player_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  player_ends_with?: InputMaybe<Scalars['String']>;
  player_ends_with_nocase?: InputMaybe<Scalars['String']>;
  player_not_ends_with?: InputMaybe<Scalars['String']>;
  player_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  player_?: InputMaybe<Player_filter>;
  commitment?: InputMaybe<Scalars['Bytes']>;
  commitment_not?: InputMaybe<Scalars['Bytes']>;
  commitment_gt?: InputMaybe<Scalars['Bytes']>;
  commitment_lt?: InputMaybe<Scalars['Bytes']>;
  commitment_gte?: InputMaybe<Scalars['Bytes']>;
  commitment_lte?: InputMaybe<Scalars['Bytes']>;
  commitment_in?: InputMaybe<Array<Scalars['Bytes']>>;
  commitment_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  commitment_contains?: InputMaybe<Scalars['Bytes']>;
  commitment_not_contains?: InputMaybe<Scalars['Bytes']>;
  travel?: InputMaybe<Scalars['String']>;
  travel_not?: InputMaybe<Scalars['String']>;
  travel_gt?: InputMaybe<Scalars['String']>;
  travel_lt?: InputMaybe<Scalars['String']>;
  travel_gte?: InputMaybe<Scalars['String']>;
  travel_lte?: InputMaybe<Scalars['String']>;
  travel_in?: InputMaybe<Array<Scalars['String']>>;
  travel_not_in?: InputMaybe<Array<Scalars['String']>>;
  travel_contains?: InputMaybe<Scalars['String']>;
  travel_contains_nocase?: InputMaybe<Scalars['String']>;
  travel_not_contains?: InputMaybe<Scalars['String']>;
  travel_not_contains_nocase?: InputMaybe<Scalars['String']>;
  travel_starts_with?: InputMaybe<Scalars['String']>;
  travel_starts_with_nocase?: InputMaybe<Scalars['String']>;
  travel_not_starts_with?: InputMaybe<Scalars['String']>;
  travel_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  travel_ends_with?: InputMaybe<Scalars['String']>;
  travel_ends_with_nocase?: InputMaybe<Scalars['String']>;
  travel_not_ends_with?: InputMaybe<Scalars['String']>;
  travel_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  travel_?: InputMaybe<Travel_filter>;
  shot?: InputMaybe<Scalars['String']>;
  shot_not?: InputMaybe<Scalars['String']>;
  shot_gt?: InputMaybe<Scalars['String']>;
  shot_lt?: InputMaybe<Scalars['String']>;
  shot_gte?: InputMaybe<Scalars['String']>;
  shot_lte?: InputMaybe<Scalars['String']>;
  shot_in?: InputMaybe<Array<Scalars['String']>>;
  shot_not_in?: InputMaybe<Array<Scalars['String']>>;
  shot_contains?: InputMaybe<Scalars['String']>;
  shot_contains_nocase?: InputMaybe<Scalars['String']>;
  shot_not_contains?: InputMaybe<Scalars['String']>;
  shot_not_contains_nocase?: InputMaybe<Scalars['String']>;
  shot_starts_with?: InputMaybe<Scalars['String']>;
  shot_starts_with_nocase?: InputMaybe<Scalars['String']>;
  shot_not_starts_with?: InputMaybe<Scalars['String']>;
  shot_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  shot_ends_with?: InputMaybe<Scalars['String']>;
  shot_ends_with_nocase?: InputMaybe<Scalars['String']>;
  shot_not_ends_with?: InputMaybe<Scalars['String']>;
  shot_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  shot_?: InputMaybe<Shot_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Move_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Move_filter>>>;
};

export type Move_orderBy =
  | 'id'
  | 'game'
  | 'game__id'
  | 'game__gameId'
  | 'game__radius'
  | 'game__centerQ'
  | 'game__centerR'
  | 'game__state'
  | 'round'
  | 'round__id'
  | 'round__round'
  | 'round__radius'
  | 'round__shrunk'
  | 'player'
  | 'player__id'
  | 'player__address'
  | 'player__q'
  | 'player__r'
  | 'player__tokenId'
  | 'player__range'
  | 'player__shotRange'
  | 'player__image'
  | 'player__state'
  | 'player__kills'
  | 'commitment'
  | 'travel'
  | 'travel__id'
  | 'travel__originQ'
  | 'travel__originR'
  | 'travel__destinationQ'
  | 'travel__destinationR'
  | 'shot'
  | 'shot__id'
  | 'shot__originQ'
  | 'shot__originR'
  | 'shot__destinationQ'
  | 'shot__destinationR';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Player = {
  id: Scalars['Bytes'];
  address: Scalars['Bytes'];
  q: Scalars['Int'];
  r: Scalars['Int'];
  tokenId: Scalars['BigInt'];
  range: Scalars['Int'];
  shotRange: Scalars['Int'];
  image: Scalars['String'];
  game: Game;
  state: PlayerState;
  kills?: Maybe<Scalars['Int']>;
  moves: Array<Move>;
};


export type PlayermovesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Move_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Move_filter>;
};

export type PlayerState =
  | 'active'
  | 'dropped'
  | 'beached'
  | 'crashed'
  | 'shot'
  | 'draw'
  | 'won';

export type Player_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_gt?: InputMaybe<Scalars['Bytes']>;
  address_lt?: InputMaybe<Scalars['Bytes']>;
  address_gte?: InputMaybe<Scalars['Bytes']>;
  address_lte?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  q?: InputMaybe<Scalars['Int']>;
  q_not?: InputMaybe<Scalars['Int']>;
  q_gt?: InputMaybe<Scalars['Int']>;
  q_lt?: InputMaybe<Scalars['Int']>;
  q_gte?: InputMaybe<Scalars['Int']>;
  q_lte?: InputMaybe<Scalars['Int']>;
  q_in?: InputMaybe<Array<Scalars['Int']>>;
  q_not_in?: InputMaybe<Array<Scalars['Int']>>;
  r?: InputMaybe<Scalars['Int']>;
  r_not?: InputMaybe<Scalars['Int']>;
  r_gt?: InputMaybe<Scalars['Int']>;
  r_lt?: InputMaybe<Scalars['Int']>;
  r_gte?: InputMaybe<Scalars['Int']>;
  r_lte?: InputMaybe<Scalars['Int']>;
  r_in?: InputMaybe<Array<Scalars['Int']>>;
  r_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tokenId?: InputMaybe<Scalars['BigInt']>;
  tokenId_not?: InputMaybe<Scalars['BigInt']>;
  tokenId_gt?: InputMaybe<Scalars['BigInt']>;
  tokenId_lt?: InputMaybe<Scalars['BigInt']>;
  tokenId_gte?: InputMaybe<Scalars['BigInt']>;
  tokenId_lte?: InputMaybe<Scalars['BigInt']>;
  tokenId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  range?: InputMaybe<Scalars['Int']>;
  range_not?: InputMaybe<Scalars['Int']>;
  range_gt?: InputMaybe<Scalars['Int']>;
  range_lt?: InputMaybe<Scalars['Int']>;
  range_gte?: InputMaybe<Scalars['Int']>;
  range_lte?: InputMaybe<Scalars['Int']>;
  range_in?: InputMaybe<Array<Scalars['Int']>>;
  range_not_in?: InputMaybe<Array<Scalars['Int']>>;
  shotRange?: InputMaybe<Scalars['Int']>;
  shotRange_not?: InputMaybe<Scalars['Int']>;
  shotRange_gt?: InputMaybe<Scalars['Int']>;
  shotRange_lt?: InputMaybe<Scalars['Int']>;
  shotRange_gte?: InputMaybe<Scalars['Int']>;
  shotRange_lte?: InputMaybe<Scalars['Int']>;
  shotRange_in?: InputMaybe<Array<Scalars['Int']>>;
  shotRange_not_in?: InputMaybe<Array<Scalars['Int']>>;
  image?: InputMaybe<Scalars['String']>;
  image_not?: InputMaybe<Scalars['String']>;
  image_gt?: InputMaybe<Scalars['String']>;
  image_lt?: InputMaybe<Scalars['String']>;
  image_gte?: InputMaybe<Scalars['String']>;
  image_lte?: InputMaybe<Scalars['String']>;
  image_in?: InputMaybe<Array<Scalars['String']>>;
  image_not_in?: InputMaybe<Array<Scalars['String']>>;
  image_contains?: InputMaybe<Scalars['String']>;
  image_contains_nocase?: InputMaybe<Scalars['String']>;
  image_not_contains?: InputMaybe<Scalars['String']>;
  image_not_contains_nocase?: InputMaybe<Scalars['String']>;
  image_starts_with?: InputMaybe<Scalars['String']>;
  image_starts_with_nocase?: InputMaybe<Scalars['String']>;
  image_not_starts_with?: InputMaybe<Scalars['String']>;
  image_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  image_ends_with?: InputMaybe<Scalars['String']>;
  image_ends_with_nocase?: InputMaybe<Scalars['String']>;
  image_not_ends_with?: InputMaybe<Scalars['String']>;
  image_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  game?: InputMaybe<Scalars['String']>;
  game_not?: InputMaybe<Scalars['String']>;
  game_gt?: InputMaybe<Scalars['String']>;
  game_lt?: InputMaybe<Scalars['String']>;
  game_gte?: InputMaybe<Scalars['String']>;
  game_lte?: InputMaybe<Scalars['String']>;
  game_in?: InputMaybe<Array<Scalars['String']>>;
  game_not_in?: InputMaybe<Array<Scalars['String']>>;
  game_contains?: InputMaybe<Scalars['String']>;
  game_contains_nocase?: InputMaybe<Scalars['String']>;
  game_not_contains?: InputMaybe<Scalars['String']>;
  game_not_contains_nocase?: InputMaybe<Scalars['String']>;
  game_starts_with?: InputMaybe<Scalars['String']>;
  game_starts_with_nocase?: InputMaybe<Scalars['String']>;
  game_not_starts_with?: InputMaybe<Scalars['String']>;
  game_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  game_ends_with?: InputMaybe<Scalars['String']>;
  game_ends_with_nocase?: InputMaybe<Scalars['String']>;
  game_not_ends_with?: InputMaybe<Scalars['String']>;
  game_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  game_?: InputMaybe<Game_filter>;
  state?: InputMaybe<PlayerState>;
  state_not?: InputMaybe<PlayerState>;
  state_in?: InputMaybe<Array<PlayerState>>;
  state_not_in?: InputMaybe<Array<PlayerState>>;
  kills?: InputMaybe<Scalars['Int']>;
  kills_not?: InputMaybe<Scalars['Int']>;
  kills_gt?: InputMaybe<Scalars['Int']>;
  kills_lt?: InputMaybe<Scalars['Int']>;
  kills_gte?: InputMaybe<Scalars['Int']>;
  kills_lte?: InputMaybe<Scalars['Int']>;
  kills_in?: InputMaybe<Array<Scalars['Int']>>;
  kills_not_in?: InputMaybe<Array<Scalars['Int']>>;
  moves_?: InputMaybe<Move_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Player_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Player_filter>>>;
};

export type Player_orderBy =
  | 'id'
  | 'address'
  | 'q'
  | 'r'
  | 'tokenId'
  | 'range'
  | 'shotRange'
  | 'image'
  | 'game'
  | 'game__id'
  | 'game__gameId'
  | 'game__radius'
  | 'game__centerQ'
  | 'game__centerR'
  | 'game__state'
  | 'state'
  | 'kills'
  | 'moves';

export type Query = {
  game?: Maybe<Game>;
  games: Array<Game>;
  player?: Maybe<Player>;
  players: Array<Player>;
  round?: Maybe<Round>;
  rounds: Array<Round>;
  move?: Maybe<Move>;
  moves: Array<Move>;
  travel?: Maybe<Travel>;
  travels: Array<Travel>;
  shot?: Maybe<Shot>;
  shots: Array<Shot>;
  cell?: Maybe<Cell>;
  cells: Array<Cell>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerygameArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygamesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Game_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Game_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryplayerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryplayersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Player_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Player_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryroundArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryroundsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Round_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Round_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymoveArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymovesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Move_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Move_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytravelArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytravelsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Travel_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Travel_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Shot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Shot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycellArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycellsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Cell_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Cell_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Round = {
  game?: Maybe<Game>;
  id: Scalars['Bytes'];
  round: Scalars['BigInt'];
  radius: Scalars['Int'];
  shrunk: Scalars['Boolean'];
  moves: Array<Move>;
  deletedCells: Array<Cell>;
};


export type RoundmovesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Move_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Move_filter>;
};


export type RounddeletedCellsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Cell_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Cell_filter>;
};

export type Round_filter = {
  game?: InputMaybe<Scalars['String']>;
  game_not?: InputMaybe<Scalars['String']>;
  game_gt?: InputMaybe<Scalars['String']>;
  game_lt?: InputMaybe<Scalars['String']>;
  game_gte?: InputMaybe<Scalars['String']>;
  game_lte?: InputMaybe<Scalars['String']>;
  game_in?: InputMaybe<Array<Scalars['String']>>;
  game_not_in?: InputMaybe<Array<Scalars['String']>>;
  game_contains?: InputMaybe<Scalars['String']>;
  game_contains_nocase?: InputMaybe<Scalars['String']>;
  game_not_contains?: InputMaybe<Scalars['String']>;
  game_not_contains_nocase?: InputMaybe<Scalars['String']>;
  game_starts_with?: InputMaybe<Scalars['String']>;
  game_starts_with_nocase?: InputMaybe<Scalars['String']>;
  game_not_starts_with?: InputMaybe<Scalars['String']>;
  game_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  game_ends_with?: InputMaybe<Scalars['String']>;
  game_ends_with_nocase?: InputMaybe<Scalars['String']>;
  game_not_ends_with?: InputMaybe<Scalars['String']>;
  game_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  game_?: InputMaybe<Game_filter>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  round?: InputMaybe<Scalars['BigInt']>;
  round_not?: InputMaybe<Scalars['BigInt']>;
  round_gt?: InputMaybe<Scalars['BigInt']>;
  round_lt?: InputMaybe<Scalars['BigInt']>;
  round_gte?: InputMaybe<Scalars['BigInt']>;
  round_lte?: InputMaybe<Scalars['BigInt']>;
  round_in?: InputMaybe<Array<Scalars['BigInt']>>;
  round_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  radius?: InputMaybe<Scalars['Int']>;
  radius_not?: InputMaybe<Scalars['Int']>;
  radius_gt?: InputMaybe<Scalars['Int']>;
  radius_lt?: InputMaybe<Scalars['Int']>;
  radius_gte?: InputMaybe<Scalars['Int']>;
  radius_lte?: InputMaybe<Scalars['Int']>;
  radius_in?: InputMaybe<Array<Scalars['Int']>>;
  radius_not_in?: InputMaybe<Array<Scalars['Int']>>;
  shrunk?: InputMaybe<Scalars['Boolean']>;
  shrunk_not?: InputMaybe<Scalars['Boolean']>;
  shrunk_in?: InputMaybe<Array<Scalars['Boolean']>>;
  shrunk_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  moves_?: InputMaybe<Move_filter>;
  deletedCells_?: InputMaybe<Cell_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Round_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Round_filter>>>;
};

export type Round_orderBy =
  | 'game'
  | 'game__id'
  | 'game__gameId'
  | 'game__radius'
  | 'game__centerQ'
  | 'game__centerR'
  | 'game__state'
  | 'id'
  | 'round'
  | 'radius'
  | 'shrunk'
  | 'moves'
  | 'deletedCells';

export type Shot = {
  id: Scalars['Bytes'];
  originQ: Scalars['Int'];
  originR: Scalars['Int'];
  destinationQ: Scalars['Int'];
  destinationR: Scalars['Int'];
};

export type Shot_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  originQ?: InputMaybe<Scalars['Int']>;
  originQ_not?: InputMaybe<Scalars['Int']>;
  originQ_gt?: InputMaybe<Scalars['Int']>;
  originQ_lt?: InputMaybe<Scalars['Int']>;
  originQ_gte?: InputMaybe<Scalars['Int']>;
  originQ_lte?: InputMaybe<Scalars['Int']>;
  originQ_in?: InputMaybe<Array<Scalars['Int']>>;
  originQ_not_in?: InputMaybe<Array<Scalars['Int']>>;
  originR?: InputMaybe<Scalars['Int']>;
  originR_not?: InputMaybe<Scalars['Int']>;
  originR_gt?: InputMaybe<Scalars['Int']>;
  originR_lt?: InputMaybe<Scalars['Int']>;
  originR_gte?: InputMaybe<Scalars['Int']>;
  originR_lte?: InputMaybe<Scalars['Int']>;
  originR_in?: InputMaybe<Array<Scalars['Int']>>;
  originR_not_in?: InputMaybe<Array<Scalars['Int']>>;
  destinationQ?: InputMaybe<Scalars['Int']>;
  destinationQ_not?: InputMaybe<Scalars['Int']>;
  destinationQ_gt?: InputMaybe<Scalars['Int']>;
  destinationQ_lt?: InputMaybe<Scalars['Int']>;
  destinationQ_gte?: InputMaybe<Scalars['Int']>;
  destinationQ_lte?: InputMaybe<Scalars['Int']>;
  destinationQ_in?: InputMaybe<Array<Scalars['Int']>>;
  destinationQ_not_in?: InputMaybe<Array<Scalars['Int']>>;
  destinationR?: InputMaybe<Scalars['Int']>;
  destinationR_not?: InputMaybe<Scalars['Int']>;
  destinationR_gt?: InputMaybe<Scalars['Int']>;
  destinationR_lt?: InputMaybe<Scalars['Int']>;
  destinationR_gte?: InputMaybe<Scalars['Int']>;
  destinationR_lte?: InputMaybe<Scalars['Int']>;
  destinationR_in?: InputMaybe<Array<Scalars['Int']>>;
  destinationR_not_in?: InputMaybe<Array<Scalars['Int']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Shot_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Shot_filter>>>;
};

export type Shot_orderBy =
  | 'id'
  | 'originQ'
  | 'originR'
  | 'destinationQ'
  | 'destinationR';

export type Subscription = {
  game?: Maybe<Game>;
  games: Array<Game>;
  player?: Maybe<Player>;
  players: Array<Player>;
  round?: Maybe<Round>;
  rounds: Array<Round>;
  move?: Maybe<Move>;
  moves: Array<Move>;
  travel?: Maybe<Travel>;
  travels: Array<Travel>;
  shot?: Maybe<Shot>;
  shots: Array<Shot>;
  cell?: Maybe<Cell>;
  cells: Array<Cell>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptiongameArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiongamesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Game_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Game_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionplayerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionplayersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Player_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Player_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionroundArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionroundsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Round_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Round_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmoveArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmovesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Move_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Move_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontravelArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontravelsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Travel_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Travel_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Shot_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Shot_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncellArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncellsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Cell_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Cell_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Travel = {
  id: Scalars['Bytes'];
  originQ: Scalars['Int'];
  originR: Scalars['Int'];
  destinationQ: Scalars['Int'];
  destinationR: Scalars['Int'];
};

export type Travel_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  originQ?: InputMaybe<Scalars['Int']>;
  originQ_not?: InputMaybe<Scalars['Int']>;
  originQ_gt?: InputMaybe<Scalars['Int']>;
  originQ_lt?: InputMaybe<Scalars['Int']>;
  originQ_gte?: InputMaybe<Scalars['Int']>;
  originQ_lte?: InputMaybe<Scalars['Int']>;
  originQ_in?: InputMaybe<Array<Scalars['Int']>>;
  originQ_not_in?: InputMaybe<Array<Scalars['Int']>>;
  originR?: InputMaybe<Scalars['Int']>;
  originR_not?: InputMaybe<Scalars['Int']>;
  originR_gt?: InputMaybe<Scalars['Int']>;
  originR_lt?: InputMaybe<Scalars['Int']>;
  originR_gte?: InputMaybe<Scalars['Int']>;
  originR_lte?: InputMaybe<Scalars['Int']>;
  originR_in?: InputMaybe<Array<Scalars['Int']>>;
  originR_not_in?: InputMaybe<Array<Scalars['Int']>>;
  destinationQ?: InputMaybe<Scalars['Int']>;
  destinationQ_not?: InputMaybe<Scalars['Int']>;
  destinationQ_gt?: InputMaybe<Scalars['Int']>;
  destinationQ_lt?: InputMaybe<Scalars['Int']>;
  destinationQ_gte?: InputMaybe<Scalars['Int']>;
  destinationQ_lte?: InputMaybe<Scalars['Int']>;
  destinationQ_in?: InputMaybe<Array<Scalars['Int']>>;
  destinationQ_not_in?: InputMaybe<Array<Scalars['Int']>>;
  destinationR?: InputMaybe<Scalars['Int']>;
  destinationR_not?: InputMaybe<Scalars['Int']>;
  destinationR_gt?: InputMaybe<Scalars['Int']>;
  destinationR_lt?: InputMaybe<Scalars['Int']>;
  destinationR_gte?: InputMaybe<Scalars['Int']>;
  destinationR_lte?: InputMaybe<Scalars['Int']>;
  destinationR_in?: InputMaybe<Array<Scalars['Int']>>;
  destinationR_not_in?: InputMaybe<Array<Scalars['Int']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Travel_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Travel_filter>>>;
};

export type Travel_orderBy =
  | 'id'
  | 'originQ'
  | 'originR'
  | 'destinationQ'
  | 'destinationR';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  game: InContextSdkMethod<Query['game'], QuerygameArgs, MeshContext>,
  /** null **/
  games: InContextSdkMethod<Query['games'], QuerygamesArgs, MeshContext>,
  /** null **/
  player: InContextSdkMethod<Query['player'], QueryplayerArgs, MeshContext>,
  /** null **/
  players: InContextSdkMethod<Query['players'], QueryplayersArgs, MeshContext>,
  /** null **/
  round: InContextSdkMethod<Query['round'], QueryroundArgs, MeshContext>,
  /** null **/
  rounds: InContextSdkMethod<Query['rounds'], QueryroundsArgs, MeshContext>,
  /** null **/
  move: InContextSdkMethod<Query['move'], QuerymoveArgs, MeshContext>,
  /** null **/
  moves: InContextSdkMethod<Query['moves'], QuerymovesArgs, MeshContext>,
  /** null **/
  travel: InContextSdkMethod<Query['travel'], QuerytravelArgs, MeshContext>,
  /** null **/
  travels: InContextSdkMethod<Query['travels'], QuerytravelsArgs, MeshContext>,
  /** null **/
  shot: InContextSdkMethod<Query['shot'], QueryshotArgs, MeshContext>,
  /** null **/
  shots: InContextSdkMethod<Query['shots'], QueryshotsArgs, MeshContext>,
  /** null **/
  cell: InContextSdkMethod<Query['cell'], QuerycellArgs, MeshContext>,
  /** null **/
  cells: InContextSdkMethod<Query['cells'], QuerycellsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  game: InContextSdkMethod<Subscription['game'], SubscriptiongameArgs, MeshContext>,
  /** null **/
  games: InContextSdkMethod<Subscription['games'], SubscriptiongamesArgs, MeshContext>,
  /** null **/
  player: InContextSdkMethod<Subscription['player'], SubscriptionplayerArgs, MeshContext>,
  /** null **/
  players: InContextSdkMethod<Subscription['players'], SubscriptionplayersArgs, MeshContext>,
  /** null **/
  round: InContextSdkMethod<Subscription['round'], SubscriptionroundArgs, MeshContext>,
  /** null **/
  rounds: InContextSdkMethod<Subscription['rounds'], SubscriptionroundsArgs, MeshContext>,
  /** null **/
  move: InContextSdkMethod<Subscription['move'], SubscriptionmoveArgs, MeshContext>,
  /** null **/
  moves: InContextSdkMethod<Subscription['moves'], SubscriptionmovesArgs, MeshContext>,
  /** null **/
  travel: InContextSdkMethod<Subscription['travel'], SubscriptiontravelArgs, MeshContext>,
  /** null **/
  travels: InContextSdkMethod<Subscription['travels'], SubscriptiontravelsArgs, MeshContext>,
  /** null **/
  shot: InContextSdkMethod<Subscription['shot'], SubscriptionshotArgs, MeshContext>,
  /** null **/
  shots: InContextSdkMethod<Subscription['shots'], SubscriptionshotsArgs, MeshContext>,
  /** null **/
  cell: InContextSdkMethod<Subscription['cell'], SubscriptioncellArgs, MeshContext>,
  /** null **/
  cells: InContextSdkMethod<Subscription['cells'], SubscriptioncellsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["newSubgraph"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
