// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import UsePollingLive from "@graphprotocol/client-polling-live";
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { NewSubgraphTypes } from './sources/newSubgraph/types';
import * as importedModule$0 from "./sources/newSubgraph/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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
  | 'kills';

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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Aggregation_interval: Aggregation_interval;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Cell: ResolverTypeWrapper<Cell>;
  Cell_filter: Cell_filter;
  Cell_orderBy: Cell_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Game: ResolverTypeWrapper<Game>;
  GameState: GameState;
  Game_filter: Game_filter;
  Game_orderBy: Game_orderBy;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']>;
  Move: ResolverTypeWrapper<Move>;
  Move_filter: Move_filter;
  Move_orderBy: Move_orderBy;
  OrderDirection: OrderDirection;
  Player: ResolverTypeWrapper<Player>;
  PlayerState: PlayerState;
  Player_filter: Player_filter;
  Player_orderBy: Player_orderBy;
  Query: ResolverTypeWrapper<{}>;
  Round: ResolverTypeWrapper<Round>;
  Round_filter: Round_filter;
  Round_orderBy: Round_orderBy;
  Shot: ResolverTypeWrapper<Shot>;
  Shot_filter: Shot_filter;
  Shot_orderBy: Shot_orderBy;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Travel: ResolverTypeWrapper<Travel>;
  Travel_filter: Travel_filter;
  Travel_orderBy: Travel_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  Cell: Cell;
  Cell_filter: Cell_filter;
  Float: Scalars['Float'];
  Game: Game;
  Game_filter: Game_filter;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Int8: Scalars['Int8'];
  Move: Move;
  Move_filter: Move_filter;
  Player: Player;
  Player_filter: Player_filter;
  Query: {};
  Round: Round;
  Round_filter: Round_filter;
  Shot: Shot;
  Shot_filter: Shot_filter;
  String: Scalars['String'];
  Subscription: {};
  Travel: Travel;
  Travel_filter: Travel_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type CellResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Cell'] = ResolversParentTypes['Cell']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  q?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  r?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  island?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  deletedInRound?: Resolver<Maybe<ResolversTypes['Round']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GameResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  gameId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  radius?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  centerQ?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  centerR?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  currentRound?: Resolver<ResolversTypes['Round'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['GameState'], ParentType, ContextType>;
  winner?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  players?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType, RequireFields<GameplayersArgs, 'skip' | 'first'>>;
  rounds?: Resolver<Array<ResolversTypes['Round']>, ParentType, ContextType, RequireFields<GameroundsArgs, 'skip' | 'first'>>;
  cells?: Resolver<Array<ResolversTypes['Cell']>, ParentType, ContextType, RequireFields<GamecellsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type MoveResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Move'] = ResolversParentTypes['Move']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  round?: Resolver<ResolversTypes['Round'], ParentType, ContextType>;
  player?: Resolver<ResolversTypes['Player'], ParentType, ContextType>;
  commitment?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  travel?: Resolver<Maybe<ResolversTypes['Travel']>, ParentType, ContextType>;
  shot?: Resolver<Maybe<ResolversTypes['Shot']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlayerResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  address?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  q?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  r?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  range?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shotRange?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['PlayerState'], ParentType, ContextType>;
  kills?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  game?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<QuerygameArgs, 'id' | 'subgraphError'>>;
  games?: Resolver<Array<ResolversTypes['Game']>, ParentType, ContextType, RequireFields<QuerygamesArgs, 'skip' | 'first' | 'subgraphError'>>;
  player?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType, RequireFields<QueryplayerArgs, 'id' | 'subgraphError'>>;
  players?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType, RequireFields<QueryplayersArgs, 'skip' | 'first' | 'subgraphError'>>;
  round?: Resolver<Maybe<ResolversTypes['Round']>, ParentType, ContextType, RequireFields<QueryroundArgs, 'id' | 'subgraphError'>>;
  rounds?: Resolver<Array<ResolversTypes['Round']>, ParentType, ContextType, RequireFields<QueryroundsArgs, 'skip' | 'first' | 'subgraphError'>>;
  move?: Resolver<Maybe<ResolversTypes['Move']>, ParentType, ContextType, RequireFields<QuerymoveArgs, 'id' | 'subgraphError'>>;
  moves?: Resolver<Array<ResolversTypes['Move']>, ParentType, ContextType, RequireFields<QuerymovesArgs, 'skip' | 'first' | 'subgraphError'>>;
  travel?: Resolver<Maybe<ResolversTypes['Travel']>, ParentType, ContextType, RequireFields<QuerytravelArgs, 'id' | 'subgraphError'>>;
  travels?: Resolver<Array<ResolversTypes['Travel']>, ParentType, ContextType, RequireFields<QuerytravelsArgs, 'skip' | 'first' | 'subgraphError'>>;
  shot?: Resolver<Maybe<ResolversTypes['Shot']>, ParentType, ContextType, RequireFields<QueryshotArgs, 'id' | 'subgraphError'>>;
  shots?: Resolver<Array<ResolversTypes['Shot']>, ParentType, ContextType, RequireFields<QueryshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  cell?: Resolver<Maybe<ResolversTypes['Cell']>, ParentType, ContextType, RequireFields<QuerycellArgs, 'id' | 'subgraphError'>>;
  cells?: Resolver<Array<ResolversTypes['Cell']>, ParentType, ContextType, RequireFields<QuerycellsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type RoundResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Round'] = ResolversParentTypes['Round']> = ResolversObject<{
  game?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  round?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  radius?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shrunk?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  moves?: Resolver<Array<ResolversTypes['Move']>, ParentType, ContextType, RequireFields<RoundmovesArgs, 'skip' | 'first'>>;
  deletedCells?: Resolver<Array<ResolversTypes['Cell']>, ParentType, ContextType, RequireFields<RounddeletedCellsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ShotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Shot'] = ResolversParentTypes['Shot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  originQ?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  originR?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  destinationQ?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  destinationR?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  game?: SubscriptionResolver<Maybe<ResolversTypes['Game']>, "game", ParentType, ContextType, RequireFields<SubscriptiongameArgs, 'id' | 'subgraphError'>>;
  games?: SubscriptionResolver<Array<ResolversTypes['Game']>, "games", ParentType, ContextType, RequireFields<SubscriptiongamesArgs, 'skip' | 'first' | 'subgraphError'>>;
  player?: SubscriptionResolver<Maybe<ResolversTypes['Player']>, "player", ParentType, ContextType, RequireFields<SubscriptionplayerArgs, 'id' | 'subgraphError'>>;
  players?: SubscriptionResolver<Array<ResolversTypes['Player']>, "players", ParentType, ContextType, RequireFields<SubscriptionplayersArgs, 'skip' | 'first' | 'subgraphError'>>;
  round?: SubscriptionResolver<Maybe<ResolversTypes['Round']>, "round", ParentType, ContextType, RequireFields<SubscriptionroundArgs, 'id' | 'subgraphError'>>;
  rounds?: SubscriptionResolver<Array<ResolversTypes['Round']>, "rounds", ParentType, ContextType, RequireFields<SubscriptionroundsArgs, 'skip' | 'first' | 'subgraphError'>>;
  move?: SubscriptionResolver<Maybe<ResolversTypes['Move']>, "move", ParentType, ContextType, RequireFields<SubscriptionmoveArgs, 'id' | 'subgraphError'>>;
  moves?: SubscriptionResolver<Array<ResolversTypes['Move']>, "moves", ParentType, ContextType, RequireFields<SubscriptionmovesArgs, 'skip' | 'first' | 'subgraphError'>>;
  travel?: SubscriptionResolver<Maybe<ResolversTypes['Travel']>, "travel", ParentType, ContextType, RequireFields<SubscriptiontravelArgs, 'id' | 'subgraphError'>>;
  travels?: SubscriptionResolver<Array<ResolversTypes['Travel']>, "travels", ParentType, ContextType, RequireFields<SubscriptiontravelsArgs, 'skip' | 'first' | 'subgraphError'>>;
  shot?: SubscriptionResolver<Maybe<ResolversTypes['Shot']>, "shot", ParentType, ContextType, RequireFields<SubscriptionshotArgs, 'id' | 'subgraphError'>>;
  shots?: SubscriptionResolver<Array<ResolversTypes['Shot']>, "shots", ParentType, ContextType, RequireFields<SubscriptionshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  cell?: SubscriptionResolver<Maybe<ResolversTypes['Cell']>, "cell", ParentType, ContextType, RequireFields<SubscriptioncellArgs, 'id' | 'subgraphError'>>;
  cells?: SubscriptionResolver<Array<ResolversTypes['Cell']>, "cells", ParentType, ContextType, RequireFields<SubscriptioncellsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type TravelResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Travel'] = ResolversParentTypes['Travel']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  originQ?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  originR?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  destinationQ?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  destinationR?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Cell?: CellResolvers<ContextType>;
  Game?: GameResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  Move?: MoveResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Round?: RoundResolvers<ContextType>;
  Shot?: ShotResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Travel?: TravelResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = NewSubgraphTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/newSubgraph/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const newSubgraphTransforms = [];
const additionalTypeDefs = [] as any[];
const newSubgraphHandler = new GraphqlHandler({
              name: "newSubgraph",
              config: {"endpoint":"http://localhost:8000/subgraphs/name/newSubgraph/newSubgraph"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("newSubgraph"),
              logger: logger.child("newSubgraph"),
              importFn,
            });
sources[0] = {
          name: 'newSubgraph',
          handler: newSubgraphHandler,
          transforms: newSubgraphTransforms
        }
additionalEnvelopPlugins[0] = await UsePollingLive({
          ...({
  "defaultInterval": 1000
}),
          logger: logger.child("pollingLive"),
          cache,
          pubsub,
          baseDir,
          importFn,
        })
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: GetGameDocument,
        get rawSDL() {
          return printWithCache(GetGameDocument);
        },
        location: 'GetGameDocument.graphql'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type getGameQueryVariables = Exact<{
  gameId: Scalars['BigInt'];
}>;


export type getGameQuery = { games: Array<(
    Pick<Game, 'gameId' | 'state'>
    & { cells: Array<(
      Pick<Cell, 'id' | 'q' | 'r' | 'island'>
      & { deletedInRound?: Maybe<Pick<Round, 'round'>> }
    )>, players: Array<Pick<Player, 'address' | 'q' | 'r' | 'state' | 'kills' | 'range' | 'shotRange' | 'image'>>, currentRound: Pick<Round, 'round'>, rounds: Array<(
      Pick<Round, 'round' | 'shrunk'>
      & { deletedCells: Array<Pick<Cell, 'id' | 'q' | 'r'>>, moves: Array<(
        Pick<Move, 'commitment'>
        & { player: Pick<Player, 'address'>, game: Pick<Game, 'gameId'>, round: Pick<Round, 'round'>, travel?: Maybe<Pick<Travel, 'id' | 'originQ' | 'originR' | 'destinationQ' | 'destinationR'>>, shot?: Maybe<Pick<Shot, 'id' | 'originQ' | 'originR' | 'destinationQ' | 'destinationR'>> }
      )> }
    )> }
  )> };


export const getGameDocument = gql`
    query getGame($gameId: BigInt!) @live {
  games(where: {gameId: $gameId}) {
    gameId
    state
    cells {
      id
      q
      r
      island
      deletedInRound {
        round
      }
    }
    players {
      address
      q
      r
      state
      kills
      range
      shotRange
      image
    }
    currentRound {
      round
    }
    rounds {
      round
      shrunk
      deletedCells {
        id
        q
        r
      }
      moves {
        player {
          address
        }
        game {
          gameId
        }
        round {
          round
        }
        commitment
        travel {
          id
          originQ
          originR
          destinationQ
          destinationR
        }
        shot {
          id
          originQ
          originR
          destinationQ
          destinationR
        }
      }
    }
  }
}
    ` as unknown as DocumentNode<getGameQuery, getGameQueryVariables>;


export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getGame(variables: getGameQueryVariables, options?: C): AsyncIterable<getGameQuery> {
      return requester<getGameQuery, getGameQueryVariables>(getGameDocument, variables, options) as AsyncIterable<getGameQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;