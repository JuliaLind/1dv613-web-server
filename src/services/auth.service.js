import { TokenService } from "@/services/token.service"
import { FetchService } from "@/services/fetch.service"

const authUrl = import.meta.env.VITE_AUTH_URL


/**
 * Service for handling authentication requests.
 */
export class AuthService {
  #tokenService
  #fetchService

  /**
   * Creates a new instance of the AuthService.
   *
   * @param {TokenService} tokenService - the service for handling tokens
   * @param {FetchService} fetchService - the service for handling fetch requests
   */
  constructor(tokenService = new TokenService(), fetchService = new FetchService(authUrl)) {
    this.#tokenService = tokenService
    this.#fetchService = fetchService
  }

  /**
   * Returns the configuration for the refresh post request.
   *
   * @returns {object} - the configuration for the refresh request
   */
  #getRefreshHeaders() {
    const token = this.#tokenService.getRefreshToken()
    return this.#tokenService.getAuthHeader(token)
  }

  /**
   * Returns the headers for a request with the current access token.
   * Refreshes the token if it's less than 10 seconds to expiration.
   *
   * @returns {object} headers for a request containing the bearer token
   */
  async getHeaders() {
    let token

    try {
      token = this.#tokenService.getAccessToken()
    } catch (error) {
      // only case - no access token was found in local storage
      if (error.status !== 401) {
        throw error
      }

      // if this throws error, let propagate
      await this.refresh()
      token = this.#tokenService.getAccessToken()

    }

    return this.#tokenService.getAuthHeader(token)
  }

  /**
   * Registers a new user.
   *
   * @param {object} user - The user object containing registration details.
   * @param {string} user.email - The user's email address.
   * @param {string} user.password - The user's password.
   * @param {string} user.username - The user's username.
   * @param {string} user.birthdate - The user's birthdate. 
   *
   * @returns {any} The response data from the server.
   */
  async register(user) {
    const res = await this.#fetchService.request(
      {
        path: '/register',
        body: user,
      }
    )
    return await this.#fetchService.handleResponse(res)
  }

  /**
   * Logs in the user.
   *
   * @param {object} credentials - The credentials object containing login details.
   * @returns {object} The response data containing the access token and refresh token.
   * @throws {Error} If the login fails.
   */
  async login(credentials) {
    let res = await this.#fetchService.request({
      path: '/login',
      body: credentials
    })

    res = await this.#fetchService.handleResponse(res)
    this.#tokenService.setTokens(res)
  }

  /**
   * Deletes the user account.
   *
   * @param {object} credentials - associative
   * array with email and password
   */
  async deleteAccount(credentials) {
    let res = await this.#fetchService.request({
      path: '/',
      method: 'DELETE',
      body: credentials,
    })

    this.#tokenService.isLoggedOut(res.status, [204])
  }

  /**
   * Refreshes the access token using the refresh token.
   *
   * @returns {object} The response data containing the new access token and refresh token.
   * @throws {Error} If the refresh fails.
   */
  async refresh() {
    try {
      let res = await this.#fetchService.request(
        {
          path: '/refresh',
          headers: this.#getRefreshHeaders()
        }
      )
      res = await this.#fetchService.handleResponse(res)
      this.#tokenService.setTokens(res)
    } catch (error) {
      this.#tokenService.handleError(error)
    }
  }

  /**
   * Extracts the payload from the access token.
   *
   * @returns { number} the age of the user from the access token payload
   * @throws {Error} If the token is not found or invalid.
   */
  getPayload() {
    try {
      return this.#tokenService.getPayload()
    } catch (error) {
      error.status = 401
      throw error
    }
  }

  /**
   * Refreshes the access token using the refresh token.
   *
   * @returns {object} The response data containing the new access token and refresh token.
   * @throws {Error} If the refresh fails.
   */
  async logout() {
    const response = await this.#fetchService.request(
      {
        path: '/logout',
        headers: this.#getRefreshHeaders()
      }
    )

    this.#tokenService.isLoggedOut(response.status)
  }
}