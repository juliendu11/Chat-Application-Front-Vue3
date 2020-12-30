import { parseEnvToBoolean, parseEnvToNumber } from '@/helpers/envParser'

describe('Unit test for helpers/envParser.ts', () => {
  describe('For parseEnvToBoolean', () => {
    it('Should return false because val is undefined', () => {
      expect(parseEnvToBoolean(undefined)).toBe(false)
    })

    it('Should return false because val is "false"', () => {
      expect(parseEnvToBoolean('false')).toBe(false)
    })

    it('Should return true because val is "true"', () => {
      expect(parseEnvToBoolean('true')).toBe(true)
    })
  })

  describe('For parseEnvToNumber', () => {
    it('Should return the defaultVal because val is undefined', () => {
      expect(parseEnvToNumber(undefined, 8)).toBe(8)
    })

    it('Should return 5 because val is "5"', () => {
      expect(parseEnvToNumber('5', 8)).toBe(5)
    })
  })
})
