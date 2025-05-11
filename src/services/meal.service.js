const dataUrl = import.meta.env.VITE_DATA_URL
import { AuthService } from './auth.service.js'
import { FetchService } from './fetch.service.js'

/**
 * Service for handling foods related data.
 */
export class MealService {
  #authService
  #fetchService

  /**
   * Created a new instance of the MealService.
   *
   * @param {AuthService} authService - the authentication service
   */
  constructor(authService = new AuthService(), fetchService = new FetchService(dataUrl)) {
    this.#authService = authService
    this.#fetchService = fetchService
  }


  /**
   * Makes a fetch request to the server and returns the response.
   *
   * @param {string} path - the path to the resource
   * @param {string} method - the HTTP method to be used
   * @param {object} body - the body of the request
   * @returns {Promise<Response>} - the response from the server
   */
  async request({ path, method = 'GET', body = undefined }) {
    const headers = await this.#authService.getHeaders()

    const response = await this.#fetchService.request({
      path: '/meals' + path,
      method,
      headers,
      body,
    })
    return await this.#fetchService.handleResponse(response)
  }

  /**
   * Fetches all registered meals for the given date.
   *
   * @param {string} date - the date to get the meals for
   * @returns {Promise<object>} - the meals for the given date
   */
  async index(date = new Date()) {
    const data = await this.request({ path: `/date/${date}` })

    return data
  }

  /**
   * Crates a new meal.
   *
   * @param {object} meal - the meal to be created
   * @param {string} meal.type - the type of the meal
   * @param {string} meal.date - the date of the meal
   * @param {array} meal.foodItems - the food items in the meal
   * @param {string} meal.foodItems[].ean - the ean of the food item
   * @param {string} meal.foodItems[].weight - the weight of the food item
   * @param {string} meal.foodItems[].unit - the unit of the food item
   *
   * @returns { object} - the created meal
   */
  async post(meal) {
    const data = await this.request({ path: '/', method: 'POST', body: meal })

    return data
  }

  /**
   * Deletes a meal by id.
   *
   * @param {string} mealId - the id of the meal to be deleted
   */
  async del(mealId) {
    await this.request({ path: `/${mealId}`, method: 'DELETE' })
  }

  /**
   * Adds a food item to a meal.
   *
   * @param {string} mealId - the id of the meal to be updated
   * @param {object} foodItem - the food item to be added to the meal
   * @param {string} foodItem.ean - the ean of the food item
   * @param {string} foodItem.weight - the weight of the food item
   * @param {string} foodItem.unit - the unit of the food item
   *
   * @returns {Promise<string>} - the id of the food item
   */
  async addFoodItem(mealId, foodItem) {
    const foodId = await this.request({ path: `/${mealId}/add`, method: 'PATCH', body: foodItem })
    return foodId
  }

  /**
   * Deletes a food item from a meal.
   *
   * @param {string} mealId - the id of the meal to be updated
   * @param {string} foodItemId - the id of the food item to be removed from the meal
   */
  async delFoodItem(mealId, foodItemId) {
    await this.request({ path: `/${mealId}/del/${foodItemId}`, method: 'PATCH' })
  }

  /**
   * Updates the weight or unit of a food item in a meal.
   *
   * @param {string} mealId - the id of the meal to be updated
   * @param {object} foodItem - the food item to be updated
   * @param {string} foodItem.id - the id of the food item to be updated
   * @param {string} foodItem.weight - the new weight of the food item
   * @param {string} foodItem.unit - the new unit of the food item
   */
  async updFoodItem(mealId, foodItem) {
    await this.request({ path: `/${mealId}/upd`, method: 'PATCH', body: foodItem })
  }

  /**
   * Deletes all meals for the user.
   */
  async deleteAll() {
    await this.request({ path: '/', method: 'DELETE' })
  }
}