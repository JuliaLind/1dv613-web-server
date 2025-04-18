const dataUrl = import.meta.env.VUE_DATA_URL
import { AuthService } from './auth.service.js'

/**
 * Service for handling foods related data.
 */
export class MealService {
  #authService

  constructor (authService = new AuthService()) {
    this.#authService = authService
  }

  async request(params = { path, method: 'GET', body: {} }) {
    let res = await this.fetch(params)
    let ok = true

    if (res.status === 401) {
      ok = await this.#authService.refresh()
    }

    if (!ok) {
      return undefined
    }

    res = await this.fetch(params)

    if (res.status === 204) {
      return undefined
    }
    return res.json()
  }

  async fetch({ path, method = 'GET', body = {} }) {
    const accessToken = localStorage.getItem('accessToken')
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }

    const response = await fetch(`${dataUrl}/v1/${path}`, {
      method,
      headers,
      body: JSON.stringify(body),
    })

    return response
  }

  async index(date=new Date()) {
    const path = `meals/date/${date}`
    const data = await this.request({ path })
    return data
  }
}