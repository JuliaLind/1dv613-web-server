import { AuthService } from './auth.service.js'
import { FetchService } from './fetch.service.js'
import { MealService } from './meal.service.js'
const dataUrl = import.meta.env.VITE_DATA_URL

/**
 * Service for handling foods related data.
 */
export class UserService {
  #authService
  #fetchService

  /**
   * Created a new instance of the Userervice.
   *
   * @param {AuthService} authService - the authentication service
   * @param {FetchService} fetchService - the fetch service
   * @param {string} dataUrl - the URL for the data service
   */
  constructor(authService = new AuthService(), fetchService = new FetchService(dataUrl)) {
    this.#authService = authService
    this.#fetchService = fetchService
  }

  /**
   * Gets the age of the user from the access token payload.
   *
   * @returns {number} - the age of the user
   */
  getAge() {
    const payload = this.#authService.getPayload()

    return payload.user.age
  }


  /**
   * Makes a fetch request to the server and returns the response.
   *
   * @param {string} path - the path to the resource
   * @param {string} method - the HTTP method to be used
   * @param {object} body - the body of the request
   * @returns {Promise<Response>} - the response from the server
   */
  async request({ path = '/user', method = 'GET', body = undefined }) {
    const headers = await this.#authService.getHeaders()
    const response = await this.#fetchService.request({
      path,
      method,
      headers,
      body,
    })
    return await this.#fetchService.handleResponse(response)
  }

  /**
   * Gets the user data.
   *
   * @returns {Promise<object>} - the user data
   */
  async get() {
    const data = await this.request({})

    return data
  }

  /**
   * Updates the user data.
   *
   * @param {object} data - associative array of user data
   * @param {number} data.height - height in cm
   * @param {number} data.currentWeight - current weight in kg
   * @param {number} data.targetWeight - target weight in kg
   * @param {number} data.weeklyChange - target weekly change in kg 
   * @param {number} data.activityLevel - activity level
   * 
   */
  async put(data) {
    await this.request({ method: 'PUT', body: data })
  }

  /**
   * Stores the user data.
   *
   * @param {object} data - associative array of user data
   * @param {number} data.height - height in cm
   * @param {number} data.currentWeight - current weight in kg
   * @param {number} data.targetWeight - target weight in kg
   * @param {number} data.weeklyChange - target weekly change in kg 
   * @param {string} data.activityLevel - activity level
   * 
   */
  async post(data) {
    await this.request({ method: 'POST', body: data })
  }

  /**
   * Deletes all user's data from the
   * dataserver, both personal data and
   * registered meals.
   *
   * @param {MealService} mealService - the meal service to use
   */
  async #deleteFromDataServer(mealService = new MealService(this.#authService, this.#fetchService)) {
    await this.request({ method: 'DELETE' })
    await mealService.deleteAll()
  }

  /**
   * Deletes the user data.
   *
   * @param {object} credentials - associative
   * array with email and password
   */
  async delete(credentials) {
    // make sure credentials are valid before deleting from data server.
    // Make sure that accessToken to be sent to data-server belongs to the user whose credentials have been provided (i.e. a user cannot delete another user's data).
    await this.#authService.login(credentials)
    await this.#deleteFromDataServer()

    // delete from auth-server last, if deletion from
    // data-server fails the account should not be deleted
    await this.#authService.deleteAccount(credentials)
  }
}