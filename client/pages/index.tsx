import { useRouter } from 'next/router'
import styled from 'styled-components'

import { useSearchSongs } from '~/api'
import { setQueryString } from '~/router'
import {
  getAvailableFilters,
  loadActiveFilters,
  mkFilterHandler,
} from '~/song/filters'
import { SongFilter } from '~/song/SongFilter'
import { SongTable } from '~/song/SongTable'
import { SearchBar } from '~/ui-kit/SearchBar'

const pluralize = (...args: [string, number] | [string, string, number]) => {
  const [singular, plural, count] =
    args.length === 2 ? [args[0], args[0] + 's', args[1]] : args

  switch (count) {
    case 0:
      return plural
    case 1:
      return singular
    default:
      return plural
  }
}

export default function Home() {
  const router = useRouter()

  const search = router.query.search as string | undefined
  const activeFilters = loadActiveFilters(router)

  const { data } = useSearchSongs({
    variables: {
      search,
      filters: activeFilters,
    },
  })

  const songs = data?.searchSongs ?? []
  const availableFilters = getAvailableFilters(songs)

  return (
    <Grid>
      <SidebarArea>
        <SongFilter
          availableFilters={availableFilters}
          activeFilters={activeFilters}
          filterHandler={mkFilterHandler(router)}
        />
      </SidebarArea>
      <SongSearchArea>
        <SearchBar
          initial={search}
          onSubmit={(query: string) => {
            setQueryString(router, 'search', query)
          }}
        />
      </SongSearchArea>
      <SongCountArea>
        {songs.length} {pluralize('song', songs.length)}
      </SongCountArea>
      <SongTableArea>
        <SongTable songs={songs} />
      </SongTableArea>
    </Grid>
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 400px auto;
  grid-template-rows: max-content max-content auto;
  grid-template-areas:
    'sidebar search'
    'sidebar song-count'
    'sidebar table';
  grid-column-gap: 25px;
  grid-row-gap: 10px;
`

const SidebarArea = styled.div`
  grid-area: sidebar;
`

const SongSearchArea = styled.div`
  grid-area: search;
`

const SongCountArea = styled.p`
  grid-area: song-count;
  font-weight: bold;
`

const SongTableArea = styled.div`
  grid-area: table;
`
