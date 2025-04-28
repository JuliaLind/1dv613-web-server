import { MealService } from '../meal.service'
import { describe, it, expect, vi, afterEach, afterAll } from 'vitest'

describe('MealService', () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  const data = 'someresponse'
  const headers = {
    key: 'value',
  }
  const path = '/path'
  const res = {}

  const authService = {
    getHeaders: vi.fn(() => headers),
  }
  const fetchService = {
    request: vi.fn(() => {
      return res
    }),
    handleResponse: vi.fn(() => {
      return data
    })
  }

  it('request() ok', async () => {
    const sut = new MealService(authService, fetchService)

    const result = await sut.request({ path })
    expect(fetchService.request).toHaveBeenCalledExactlyOnceWith(
      {
        path,
        method: 'GET',
        headers,
        body: undefined
      })
    expect(fetchService.handleResponse).toHaveBeenCalledExactlyOnceWith(res)
    expect(result).toEqual(data)
  })

  describe('should call request method with correct params', () => {
    const sut = new MealService(authService, fetchService)
    sut.request = vi.fn(() => data)
    afterEach(() => {
      vi.clearAllMocks()
    })

    it('index() ok', async () => {
      const date = '2023-10-10'
      const result = await sut.index('2023-10-10')
      expect(sut.request).toHaveBeenCalledExactlyOnceWith({ path: `/meals/date/${date}` })
      expect(result).toEqual(data)
    })

    it('post() ok', async () => {
      const meal = {
        type: 'lunch',
        date: '2023-10-10',
        foodItems: [
          {
            ean: '1234567890123',
            weight: 100,
            unit: 'g'
          }
        ]
      }

      const newMeal = {
        ...meal,
        id: 'theNewMealId'
      }
      sut.request = vi.fn(() => newMeal)
      const result = await sut.post(meal)

      expect(sut.request).toHaveBeenCalledExactlyOnceWith({
        path: `/meals`,
        body: meal,
        method: 'POST'
      })

      expect(result).toEqual(newMeal)
    })

    it('del() ok', async () => {
      const mealId = 'mealId'

      await sut.del(mealId)

      expect(sut.request).toHaveBeenCalledExactlyOnceWith({
        path: `/meals/${mealId}`,
        method: 'DELETE'
      })
    })

    it('addFoodItem() ok', async () => {
      const mealId = 'mealId'
      const foodItem = {
        ean: '1234567890123',
        weight: 100,
        unit: 'g'
      }
      sut.request = vi.fn(() => 'theNewFoodItemId')
      const result = await sut.addFoodItem(mealId, foodItem)

      expect(sut.request).toHaveBeenCalledExactlyOnceWith({
        path: `/meals/${mealId}/add`,
        method: 'PATCH',
        body: foodItem
      })

      expect(result).toEqual('theNewFoodItemId')
    })

    it('delFoodItem() ok', async () => {
      const mealId = 'mealId'
      const foodItemId = 'foodItemId'

      await sut.delFoodItem(mealId, foodItemId)

      expect(sut.request).toHaveBeenCalledExactlyOnceWith({
        path: `/meals/${mealId}/del/${foodItemId}`,
        method: 'PATCH'
      })
    })

    it('updFoodItem() ok', async () => {
      const mealId = 'mealId'
      const foodItem = {
        id: 'foodItemId',
        weight: 100,
        unit: 'g'
      }

      await sut.updFoodItem(mealId, foodItem)

      expect(sut.request).toHaveBeenCalledExactlyOnceWith({
        path: `/meals/${mealId}/upd`,
        method: 'PATCH',
        body: foodItem
      })
    })
  })
})
