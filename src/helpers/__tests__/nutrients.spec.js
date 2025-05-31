import { describe, it, expect, vi, afterEach } from 'vitest'
import { weightedValue } from '../nutrients'

describe('nutrients module', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('weightedValue', () => {
    it('ok, should return correct weighted value', () => {
      const weight = 200
      const value_100g = 40
      const expectedValue = Math.round(value_100g / 100 * weight)
      expect(weightedValue(weight, value_100g)).toEqual(expectedValue)
    })
  })
})