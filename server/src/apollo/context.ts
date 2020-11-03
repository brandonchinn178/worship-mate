import { Database } from 'pg-toolbox'

import { SongAPI } from '~/song'

export type ApolloContext = {
  dataSources: ApolloDataSources
}

type ApolloDataSources = {
  songAPI: SongAPI
}

export function initDataSources(db: Database): ApolloDataSources {
  return {
    songAPI: new SongAPI(db),
  }
}