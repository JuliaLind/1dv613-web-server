const dataUrl = import.meta.env.VUE_DATA_URL

/**
 * Service for handling foods related data.
 */
export class FoodService {
  async index(page = 1) {
    const response = await fetch(`${dataUrl}/v1/foods?page=${page}`)
    if (!response.ok) {
      throw new Error('Failed to fetch food items')
    }
    const data = await response.json()
    return data
  }

  async search(query, page = 1) {
    const response = await fetch(`${dataUrl}/v1/foods?page=${page}&query=${query}`)
    if (!response.ok) {
      throw new Error('Failed to fetch food items')
    }
    const data = await response.json()
    return data
  }
}