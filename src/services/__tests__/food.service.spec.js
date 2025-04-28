import { describe, it, expect, vi, afterEach } from 'vitest'
import { mockResponse } from './helpers.js'
import { FoodService } from '../food.service.js'

describe('Food service', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('index() ok, should return the food items from response', async () => {
    const foods = [
      {
        id: '1',
        name: 'Pizza',
        kcal_100g: 300,
      },
      {
        id: '2',
        name: 'Burger',
        kcal_100g: 500,
      },
    ]

    const response = mockResponse(201, {
      foodItems: foods
    })

    const fetchService = {
      request: vi.fn(() => {
        return response
      }),
      handleResponse: vi.fn(() => {
        return foods
      }),
    }

    const foodService = new FoodService(fetchService)


    const result = await foodService.index(5)

    expect(fetchService.request).toHaveBeenCalledWith(
      {
        method: 'GET',
        path: '/foods?page=5',
      }
    )

    expect(fetchService.handleResponse).toHaveBeenCalledTimes(1)
    expect(fetchService.handleResponse).toHaveBeenCalledWith(response)

    expect(result).toEqual(foods)
  })

  it('search() ok, should return the food items from response', async () => {
    const query = 'pizza'
    const foods = [
      {
        id: '1',
        name: 'Pizza',
        kcal_100g: 300,
      },
      {
        id: '2',
        name: 'Panpizza',
        kcal_100g: 500,
      },
      {
        id: '3',
        name: 'Pizzabagel',
        kcal_100g: 200,
      },
    ]

    const response = mockResponse(201, {
      foodItems: foods
    })

    const fetchService = {
      request: vi.fn(() => {
        return response
      }),
      handleResponse: vi.fn(() => {
        return foods
      }),
    }

    const foodService = new FoodService(fetchService)


    const result = await foodService.search(query, 3)

    expect(fetchService.request).toHaveBeenCalledWith(
      {
        method: 'GET',
        path: '/foods/search/pizza?page=3',
      }
    )

    expect(fetchService.handleResponse).toHaveBeenCalledTimes(1)
    expect(fetchService.handleResponse).toHaveBeenCalledWith(response)

    expect(result).toEqual(foods)
  })
})