/** AUTO GENERATED. DO NOT MODIFY **/
/* eslint-disable */
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X]
} &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: number
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /**
   * A filter value must be of a type corresponding to the filter name:
   *
   * - RECOMMENDED_KEY: String
   * - BPM: Int
   * - TIME_SIGNATURE: [Int, Int]
   * - THEMES: [String, String, ...]
   */
  FilterValue: unknown
}

export type Query = {
  __typename?: 'Query'
  searchSongs?: Maybe<SongSearchResult>
}

export type QuerySearchSongsArgs = {
  query?: Maybe<Scalars['String']>
  filters?: Maybe<Array<SearchFilter>>
}

export type Song = {
  __typename?: 'Song'
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
  recommendedKey: Scalars['String']
  timeSignature: TimeSignature
  bpm: Scalars['Int']
}

export type TimeSignature = {
  __typename?: 'TimeSignature'
  top: Scalars['Int']
  bottom: Scalars['Int']
}

export enum FilterName {
  RECOMMENDED_KEY = 'RECOMMENDED_KEY',
  BPM = 'BPM',
  TIME_SIGNATURE = 'TIME_SIGNATURE',
  THEMES = 'THEMES',
}

export type SearchFilter = {
  name: FilterName
  value: Scalars['FilterValue']
}

export type SongSearchResult = {
  __typename?: 'SongSearchResult'
  songs: Array<Song>
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']>
  Song: ResolverTypeWrapper<Song>
  ID: ResolverTypeWrapper<Scalars['ID']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  TimeSignature: ResolverTypeWrapper<TimeSignature>
  FilterName: FilterName
  FilterValue: ResolverTypeWrapper<Scalars['FilterValue']>
  SearchFilter: SearchFilter
  SongSearchResult: ResolverTypeWrapper<SongSearchResult>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {}
  String: Scalars['String']
  Song: Song
  ID: Scalars['ID']
  Int: Scalars['Int']
  TimeSignature: TimeSignature
  FilterValue: Scalars['FilterValue']
  SearchFilter: SearchFilter
  SongSearchResult: SongSearchResult
  Boolean: Scalars['Boolean']
}>

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  searchSongs?: Resolver<
    Maybe<ResolversTypes['SongSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchSongsArgs, never>
  >
}>

export type SongResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Song'] = ResolversParentTypes['Song']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  recommendedKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  timeSignature?: Resolver<
    ResolversTypes['TimeSignature'],
    ParentType,
    ContextType
  >
  bpm?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type TimeSignatureResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TimeSignature'] = ResolversParentTypes['TimeSignature']
> = ResolversObject<{
  top?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  bottom?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export interface FilterValueScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['FilterValue'], any> {
  name: 'FilterValue'
}

export type SongSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SongSearchResult'] = ResolversParentTypes['SongSearchResult']
> = ResolversObject<{
  songs?: Resolver<Array<ResolversTypes['Song']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = any> = ResolversObject<{
  Query?: QueryResolvers<ContextType>
  Song?: SongResolvers<ContextType>
  TimeSignature?: TimeSignatureResolvers<ContextType>
  FilterValue?: GraphQLScalarType
  SongSearchResult?: SongSearchResultResolvers<ContextType>
}>

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
