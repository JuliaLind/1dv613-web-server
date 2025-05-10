import { AuthService } from './auth.service.js'
import { FetchService } from './fetch.service.js'
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
   */
  async #deleteFromDataServer() {
    await this.request({ method: 'DELETE' })
    await this.request({ path: '/meals', method: 'DELETE' })
  }



  /**
   * Deletes the user data.
   */
  async delete({ email, password }) {
    try {
      await this.#deleteFromDataServer()
    } catch (error) {
      if (error.status === 401) {
        // user does not need to enter credentials again if both
        // access token and refresh token have expired
        await this.#authService.login({ email, password })
        await this.#deleteFromDataServer()
      }
    }

    await this.#authService.deleteAccount({ email, password })

  }
}