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

  async request(params = { path, method: 'GET', body: undefined }) {
    let res = await this.fetch(params)

    if (res.status === 401) {
      await this.#authService.refresh()
  
      res = await this.fetch(params)
    }

    if (!res.ok || res.status === 204) {
      return undefined
    }
    return res.json()
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
      body: JSON.stringify(body),
    })

    return response
  }

  async index(date=new Date()) {
    const path = `/meals/date/${date}`
    const data = await this.request({ path })
    return data
  }
}