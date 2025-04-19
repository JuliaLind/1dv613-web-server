const dataUrl = import.meta.env.VITE_DATA_URL
import { AuthService } from './auth.service.js'

/**
 * Service for handling foods related data.
 */
export class MealService {
  #authService

  constructor (authService = new AuthService()) {
    this.#authService = authService
  }

  async request(params = { path, method: 'GET', body }) {
    let res = await this.fetch(params)

    if (res.status === 401) {
      await this.#authService.refresh()

      res = await this.fetch(params)
    }

    if (!res.ok || res.status === 204) {
      return undefined
    }

    const data = await res.json()

    return data
  }

  async fetch({ path, method = 'GET', body = undefined }) {
    const accessToken = localStorage.getItem('accessToken')
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }

    const response = await fetch(`${dataUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    return response
  }

  async index(date=new Date()) {
    const path = `/meals/date/${date}`
    const data = await this.request({ path })

    const types = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3']

    for (const type of types) {
      if (!data[type]) {
        data[type] = {
          id: null,
          type,
          foodItems: []
        }
      }
    }
    return data
  }

  async post(meal) {
    const path = '/meals'
    const data = await this.request({ path, method: 'POST', body: meal })
    console.log('new meal: ', data)
    return data
  }

  async del(mealId) {
    const path = `/meals/${mealId}`
    const data = await this.request({ path, method: 'DELETE' })
    return data
  }
  async addFoodItem(mealId, foodItem) {
    const path = `/meals/${mealId}/add`
    const data = await this.request({ path, method: 'PATCH', body: foodItem })
    return data
  }

  async delFoodItem(mealId, foodItemId) {
    const path = `/meals/${mealId}/del/${foodItemId}`
    await this.request({ path, method: 'PATCH' })

  }
  async updFoodItem(mealId, foodItem) {
    const path = `/meals/${mealId}/upd`
    const data = await this.request({ path, method: 'PATCH', body: foodItem })
    return data
  }

}