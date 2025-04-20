const dataUrl = import.meta.env.VITE_DATA_URL

/**
 * Service for handling foods related data.
 */
export class FoodService {
  /**
   * Gets a paginated list of food items
   * in alphabetical order by name.
   *
   * @param {number} page - page number
   * @returns {Promise<Array>} - list of food items
   * @throws {Error} - if the request fails
   */
  async index(page = 1) {
    const response = await fetch(`${dataUrl}/foods?page=${page}`)
    if (!response.ok) {
      throw new Error('Failed to fetch food items')
    }
    const data = await response.json()
    return data
  }

  async search(query, page = 1) {
    const response = await fetch(`${dataUrl}/foods/search/${encodeURIComponent(query)}?page=${page}`)
    if (!response.ok) {
      throw new Error('Failed to fetch food items')
    }
    const data = await response.json()
    return data
  }

  async get(ean) {
    const response = await fetch(`${dataUrl}/foods/ean/${ean}`)
    if (!response.ok) {
      throw new Error('Failed to fetch food item')
    }
    const data = await response.json()
    return data
  }
}