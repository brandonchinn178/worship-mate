import * as fc from 'fast-check'
import * as _ from 'lodash'

import { FilterName } from '~/graphql/types'

import { validateSearchFilter } from './searchFilter'

const fcNonEmptyString = fc
  .string()
  .map(_.trim)
  .filter((s) => s.length > 0)
const fcNonString = fc.anything().filter((v) => typeof v !== 'string')

const fcPositiveInt = fc.integer({ min: 1 })
const fcNonPositiveInt = fc.oneof(
  fc.anything().filter((v) => typeof v !== 'number'),
  fc.double().filter((x) => !Number.isInteger(x)),
  fc.integer({ max: 0 }),
)

const fcNonEmptyArray = <T>(inner: fc.Arbitrary<T>) =>
  fc.array(inner, { minLength: 1 })
const fcNonEmptyStringArray = fcNonEmptyArray(fcNonEmptyString)
const fcNonArray = fc.anything().filter((v) => !Array.isArray(v))

describe('validateSearchFilter', () => {
  it('errors for any filter name not registered in GraphQL', () => {
    const fcFilterName = fc.string().filter((s) => !(s in FilterName))

    fc.assert(
      fc.property(fcFilterName, fc.anything(), (name, value) => {
        expect(() => {
          validateSearchFilter({ name, value })
        }).toThrow()
      }),
    )
  })

  describe('RECOMMENDED_KEY', () => {
    const name = 'RECOMMENDED_KEY'

    it('validates valid RECOMMENDED_KEY', () => {
      fc.assert(
        fc.property(fcNonEmptyString, (value) => {
          expect(validateSearchFilter({ name, value })).toStrictEqual({
            name,
            value,
          })
        }),
      )
    })

    it('errors for empty strings', () => {
      expect(() => validateSearchFilter({ name, value: '' })).toThrow()
    })

    it('errors for non-strings', () => {
      fc.assert(
        fc.property(fcNonString, (value) => {
          expect(() => validateSearchFilter({ name, value })).toThrow()
        }),
      )
    })
  })

  describe('BPM', () => {
    const name = 'BPM'

    it('validates valid BPM', () => {
      fc.assert(
        fc.property(fcPositiveInt, (value) => {
          expect(validateSearchFilter({ name, value })).toStrictEqual({
            name,
            value,
          })
        }),
      )
    })

    it('validates valid BPM as a string', () => {
      fc.assert(
        fc.property(fcPositiveInt, (value) => {
          expect(
            validateSearchFilter({ name, value: value.toString() }),
          ).toStrictEqual({
            name,
            value,
          })
        }),
      )
    })

    it('errors for anything other than positive integers', () => {
      const fcNonPositiveIntLike = fcNonPositiveInt.filter(
        (v) => !(typeof v === 'string' && !isNaN(parseInt(v, 10))),
      )

      fc.assert(
        fc.property(fcNonPositiveIntLike, (value) => {
          expect(() => validateSearchFilter({ name, value })).toThrow()
        }),
      )
    })
  })

  describe('TIME_SIGNATURE', () => {
    const name = 'TIME_SIGNATURE'

    it('validates valid TIME_SIGNATURE', () => {
      fc.assert(
        fc.property(fc.tuple(fcPositiveInt, fcPositiveInt), (value) => {
          expect(validateSearchFilter({ name, value })).toStrictEqual({
            name,
            value,
          })
        }),
      )
    })

    it('validates valid TIME_SIGNATURE as a string', () => {
      fc.assert(
        fc.property(fc.tuple(fcPositiveInt, fcPositiveInt), ([top, bottom]) => {
          const value = `${top}/${bottom}`
          expect(validateSearchFilter({ name, value })).toStrictEqual({
            name,
            value: [top, bottom],
          })
        }),
      )
    })

    it('errors for arrays not containing exactly two elements', () => {
      fc.assert(
        fc.property(
          fc.array(fcPositiveInt).filter((arr) => arr.length !== 2),
          (value) => {
            expect(() => validateSearchFilter({ name, value })).toThrow()
          },
        ),
      )
    })

    it('errors for arrays containing anything other than positive integers', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.tuple(fcPositiveInt, fcNonPositiveInt),
            fc.tuple(fcNonPositiveInt, fcPositiveInt),
            fc.tuple(fcNonPositiveInt, fcNonPositiveInt),
          ),
          (value) => {
            expect(() => validateSearchFilter({ name, value })).toThrow()
          },
        ),
      )
    })

    it('errors for non-arrays', () => {
      const fcNonTimeSigLike = fcNonArray.filter(
        (v) => !(typeof v === 'string' && v.match(/^\d+\/\d+$/)),
      )

      fc.assert(
        fc.property(fcNonTimeSigLike, (value) => {
          expect(() => validateSearchFilter({ name, value })).toThrow()
        }),
      )
    })
  })

  describe('THEMES', () => {
    const name = 'THEMES'

    it('validates valid THEMES', () => {
      fc.assert(
        fc.property(fcNonEmptyStringArray, (value) => {
          expect(validateSearchFilter({ name, value })).toStrictEqual({
            name,
            value,
          })
        }),
      )
    })

    it('validates valid THEMES as a string', () => {
      const hasComma = (s: string) => _.includes(s, ',')

      fc.assert(
        fc.property(
          fcNonEmptyStringArray.filter((v) => !_.some(v, hasComma)),
          (themes) => {
            const value = themes.join(',')
            expect(validateSearchFilter({ name, value })).toStrictEqual({
              name,
              value: themes,
            })
          },
        ),
      )
    })

    it('errors for empty arrays', () => {
      expect(() => validateSearchFilter({ name, value: [] })).toThrow()
    })

    it("errors for anything that's not an array or string", () => {
      const fcNonThemesLike = fcNonArray.filter((v) => typeof v !== 'string')

      fc.assert(
        fc.property(fcNonThemesLike, (value) => {
          expect(() => validateSearchFilter({ name, value })).toThrow()
        }),
      )
    })

    it('errors for array with empty strings', () => {
      const fcArrayWithEmptyString = fcNonEmptyStringArray.chain((arr) =>
        fc
          .set(fc.nat({ max: arr.length - 1 }), { minLength: 1 })
          .map((emptyIndexes) => {
            for (const i of emptyIndexes) {
              arr[i] = ''
            }
            return arr
          }),
      )

      fc.assert(
        fc.property(fcArrayWithEmptyString, (value) => {
          expect(() => validateSearchFilter({ name, value })).toThrow()
        }),
      )
    })

    it('errors for array with non-strings', () => {
      fc.assert(
        fc.property(fcNonEmptyArray(fcNonString), (value) => {
          expect(() => validateSearchFilter({ name, value })).toThrow()
        }),
      )
    })
  })
})
