import { describe, it, expect, vi, afterEach } from 'vitest'
import { weightedValue, weightedNutrients, nutrientsPerMeal } from '../nutrients'

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

  describe('weightedNutrients', () => {
    it('ok, should return correct weighted nutrients', () => {
      const weight = 200
      const nutrients = {
        kcal: 800,
        protein: 20,
        fat: 10,
        carbohydrates: 30,
      }
      const expectedNutrients = {
        kcal: Math.round(nutrients.kcal / 100 * weight),
        protein: Math.round(nutrients.protein / 100 * weight),
        fat: Math.round(nutrients.fat / 100 * weight),
        carbohydrates: Math.round(nutrients.carbohydrates / 100 * weight),
      }

      const res = weightedNutrients(weight, nutrients)
      expect(res).toEqual(expectedNutrients)
    })
  })

  describe('nutrientsPerMeal', () => {
    it('ok, should return correct totals for meal', () => {
      const meal = {
        foodItems: [
          {
            weight: 200,
            macros_100g: {
              protein: 20,
              fat: 10,
              carbohydrates: 30,
            },
            kcal_100g: 800,
          },
          {
            weight: 100,
            macros_100g: {
              protein: 10,
              fat: 5,
              carbohydrates: 15,
            },
            kcal_100g: 400,
          },
        ],
      }
      const expectedTotals = {
        kcal: Math.round(800 / 100 * 200) + Math.round(400 / 100 * 100),
        protein: Math.round(20 / 100 * 200) + Math.round(10 / 100 * 100),
        fat: Math.round(10 / 100 * 200) + Math.round(5 / 100 * 100),
        saturatedFat: 0,
        carbohydrates: Math.round(30 / 100 * 200) + Math.round(15 / 100 * 100),
        sugars: 0,
        fiber: 0,
        salt: 0
      }

      const res = nutrientsPerMeal(meal)
      expect(res).toEqual(expectedTotals)
    })
  })
})