import { setupTestServer } from '~test-utils/apollo'
import { setupTestDatabase } from '~test-utils/db'

const db = setupTestDatabase()
const server = setupTestServer(db)

describe('Query', () => {
  describe('searchSongs', () => {
    const allSongs = [
      {
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      },
      {
        slug: 'build-my-life',
        title: 'Build My Life',
        recommended_key: 'E',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 68,
      },
      {
        slug: 'ever-be',
        title: 'Ever Be',
        recommended_key: 'E',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 72,
      },
    ]

    beforeEach(async () => {
      await db.insertAll('song', allSongs)
    })

    it('queries all songs', async () => {
      const res = await server.query({
        query: `
          query {
            searchSongs {
              songs {
                id
                slug
                title
                recommendedKey
                timeSignature {
                  top
                  bottom
                }
                bpm
              }
            }
          }
        `,
      })

      expect(res).toMatchObject({
        data: {
          searchSongs: {
            songs: [
              {
                id: expect.any(String),
                slug: 'blessed-be-your-name',
                title: 'Blessed Be Your Name',
                recommendedKey: 'A',
                timeSignature: {
                  top: 4,
                  bottom: 4,
                },
                bpm: 140,
              },
              {
                id: expect.any(String),
                slug: 'build-my-life',
                title: 'Build My Life',
                recommendedKey: 'E',
                timeSignature: {
                  top: 4,
                  bottom: 4,
                },
                bpm: 68,
              },
              {
                id: expect.any(String),
                slug: 'ever-be',
                title: 'Ever Be',
                recommendedKey: 'E',
                timeSignature: {
                  top: 4,
                  bottom: 4,
                },
                bpm: 72,
              },
            ],
          },
        },
      })
    })

    it('queries songs filtered by search query', async () => {
      const res = await server.query({
        query: `
          query ($query: String!) {
            searchSongs(query: $query) {
              songs {
                title
              }
            }
          }
        `,
        variables: {
          query: 'be',
        },
      })

      expect(res).toMatchObject({
        data: {
          searchSongs: {
            songs: expect.arrayContaining([
              { title: 'Blessed Be Your Name' },
              { title: 'Ever Be' },
            ]),
          },
        },
      })
    })

    describe('search with filters', () => {
      it('queries songs filtered by a search filter', async () => {
        const res = await server.query({
          query: `
            query ($filters: [SearchFilter!]!) {
              searchSongs(filters: $filters) {
                songs {
                  title
                }
              }
            }
          `,
          variables: {
            filters: [
              {
                name: 'RECOMMENDED_KEY',
                value: 'E',
              },
            ],
          },
        })

        expect(res).toMatchObject({
          data: {
            searchSongs: {
              songs: expect.arrayContaining([
                { title: 'Build My Life' },
                { title: 'Ever Be' },
              ]),
            },
          },
        })
      })

      it('queries songs filtered by multiple search filters', async () => {
        const res = await server.query({
          query: `
            query ($filters: [SearchFilter!]!) {
              searchSongs(filters: $filters) {
                songs {
                  title
                }
              }
            }
          `,
          variables: {
            filters: [
              {
                name: 'RECOMMENDED_KEY',
                value: 'E',
              },
              {
                name: 'BPM',
                value: 68,
              },
            ],
          },
        })

        expect(res).toMatchObject({
          data: {
            searchSongs: {
              songs: [{ title: 'Build My Life' }],
            },
          },
        })
      })

      it('queries songs with a filter provided as a string', async () => {
        const res = await server.query({
          query: `
            query ($filters: [SearchFilter!]!) {
              searchSongs(filters: $filters) {
                songs {
                  title
                }
              }
            }
          `,
          variables: {
            filters: [
              {
                name: 'TIME_SIGNATURE',
                value: '4/4',
              },
              {
                name: 'BPM',
                value: '68',
              },
            ],
          },
        })

        expect(res).toMatchObject({
          data: {
            searchSongs: {
              songs: [{ title: 'Build My Life' }],
            },
          },
        })
      })

      it('errors with an invalid search filter', async () => {
        const res = await server.query({
          query: `
            query ($filters: [SearchFilter!]!) {
              searchSongs(filters: $filters) {
                songs {
                  title
                }
              }
            }
          `,
          variables: {
            filters: [
              {
                name: 'BPM',
                value: 'foo',
              },
            ],
          },
        })

        expect(res).toMatchObject({
          errors: [{ message: "Invalid value for filter 'BPM': foo" }],
        })
      })

      it('queries songs with query and filter', async () => {
        const res = await server.query({
          query: `
            query ($query: String!, $filters: [SearchFilter!]!) {
              searchSongs(query: $query, filters: $filters) {
                songs {
                  title
                }
              }
            }
          `,
          variables: {
            query: 'be',
            filters: [
              {
                name: 'RECOMMENDED_KEY',
                value: 'E',
              },
            ],
          },
        })

        expect(res).toMatchObject({
          data: {
            searchSongs: {
              songs: [{ title: 'Ever Be' }],
            },
          },
        })
      })
    })

    describe('available filters', () => {
      it('returns available filters for search results', async () => {
        const res = await server.query({
          query: `
            query ($query: String!) {
              searchSongs(query: $query) {
                songs {
                  title
                }
                availableFilters {
                  name
                  options {
                    value
                    valueDisplay
                    count
                  }
                }
              }
            }
          `,
          variables: {
            query: 'be',
          },
        })

        expect(res).toMatchObject({
          data: {
            searchSongs: {
              songs: expect.arrayContaining([
                { title: 'Blessed Be Your Name' },
                { title: 'Ever Be' },
              ]),
              availableFilters: expect.arrayContaining([
                {
                  name: 'RECOMMENDED_KEY',
                  options: expect.arrayContaining([
                    { value: 'E', valueDisplay: 'E', count: 1 },
                    { value: 'A', valueDisplay: 'A', count: 1 },
                  ]),
                },
                {
                  name: 'BPM',
                  options: expect.arrayContaining([
                    { value: 140, valueDisplay: '140', count: 1 },
                    { value: 72, valueDisplay: '72', count: 1 },
                  ]),
                },
                {
                  name: 'TIME_SIGNATURE',
                  options: [{ value: [4, 4], valueDisplay: '4/4', count: 2 }],
                },
              ]),
            },
          },
        })
      })
    })
  })
})
