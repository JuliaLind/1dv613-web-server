import { FetchService } from './fetch.service.js'
const dataUrl = import.meta.env.VITE_DATA_URL

/**
 * Service for handling foods related data.
 */
export class FoodService {
  #fetchService

  constructor(fetchService = new FetchService(dataUrl)) {
    this.#fetchService = fetchService
  }
  /**
   * Gets a paginated list of food items
   * in alphabetical order by name.
   *
   * @param {number} page - page number
   * @returns {Promise<Array>} - list of food items
   * @throws {Error} - if the request fails
   */
  async index(page = 1) {
    // let errors from fetch service propagate
    const response = await this.#fetchService.request({
      method: 'GET',
      path: `/foods?page=${page}`,
    })
    const data = await this.#fetchService.handleResponse(response)
    return data
  }

  /**
   * Gets a list of food items
   * that match the search query.
   *
   * @param {string} query 
   * @param {number} page 
   * @returns {Promise<Array>} - list of food items
   * @throws {Error} - if the request fails
   */
  async search(query, page = 1) {
    const response = await this.#fetchService.request({
      method: 'GET',
      path: `/foods/search/${encodeURIComponent(query)}?page=${page}`,
    })
    const data = await this.#fetchService.handleResponse(response)
    return data
  }

  // maybe no need for this at the current, but don't remove yet
  // async get(ean) {
  //   const response = await fetch(`${dataUrl}/foods/ean/${ean}`)
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch food item')
  //   }
  //   const data = await response.json()
  //   return data
  // }
}