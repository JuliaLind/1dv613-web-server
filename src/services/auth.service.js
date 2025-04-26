import { jwtDecode } from "jwt-decode"

import { getUnixTime } from 'date-fns'

const authUrl = import.meta.env.VITE_AUTH_URL


/**
 * Service for handling authentication requests.
 */
export class AuthService {
  #contentTypeHeader = {
    'Content-Type': 'application/json',
  }

  /**
   * 
   * @param {object} token - json web token 
   * @param {number} seconds - minimum number fo seconds until expiration
   * @returns {boolean} - true if the token is expiring within the provided seconds,
   * otherwise false
   */
  #isExpiring(token, seconds = 10) {
    // no error-catching, let propagate
    const payload = jwtDecode(token)
    const now = getUnixTime(new Date())

    return payload.exp <= now + seconds
  }

  /**
   * Returns the header template for a request with the provided token.
   *
   * @param {object} token - json web token
   * @returns {object} - the header template where the bearer token is set
   */
  #getAuthHeader(token) {
    return {
      ...this.#contentTypeHeader,
      Authorization: `Bearer ${token}`,
    }
  }

  #getRefreshConf() {
    const token = localStorage.getItem('refreshToken')

    if (!token) {
      throw new Error('No refresh token found')
    }

    return {
      method: 'POST',
      headers: this.#getAuthHeader(token),
    }
  }

  /**
   * Throws an error if the response status is 401.
   *
   * @param {object} response - response from the server
   */
  #isUnauthorized(response) {
    if (response.status === 401) {
      const error = new Error('Unauthorized')
      error.status = 401
      throw error
    }
  }

  /**
   * Throws an error if the response status is not ok.
   *
   * @param {object} response - the response from server
   */
  async #isOk(response) {
    const data = await response.json()

    if (response.status >= 400) {
      throw new Error(data.message)
    }

    return data
  }

  /**
   * Handles the response from a fetch request.
   *
   * @param {object} response - The response object from the fetch request.
   * @returns the parsed JSON data if the response is ok, otherwise throws an error.
   * @throws {Error} If the response is not ok or if JSON parsing fails.
   */
  async #handleRes(response) {
    this.#isUnauthorized(response)

    try {
      const data = await this.#isOk(response)

      return data
    } catch {
      throw new Error('Something went wrong')
    }
  }

  /**
   * Handles errors that occur during authentication requests.
   *
   * @param {object} error - The error object.
   * @throws {Error} If the error status is 401, clears tokens and throws an error.
   */
  #handleError(error) {
    if (error.status === 401) {
      this.#clearTokens()
    }
    throw new Error(error.message)
  }

  /**
   * Stores the access and refresh tokens in local storage.
   *
   * @param {object} tokens - access and refresh tokens.
   * @param {string} tokens.accessToken - The access token.
   * @param {string} tokens.refreshToken - The refresh token.
   */
  #setTokens(tokens) {
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  }

  /**
   * Clears the access and refresh tokens from local storage.
   */
  #clearTokens() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  /**
   * Returns the headers for a request with the current access token.
   * Refreshes the token if it's less than 10 seconds to expiration.
   *
   * @returns {object} headers for a request containing the bearer token
   */
  async getHeaders() {
    const token = localStorage.getItem('accessToken')

    if (this.#isExpiring(token)) {
      await this.refresh()
    }

    return this.#getAuthHeader(token)
  }

  /**
   * Sends a POST request containing a body
   * to the authentication server.
   *
   * @param {string} path - The endpoint path.
   * @param {object} data - The request payload.
   * @returns {Promise<object>} The response data.
   */
  async #post(path, data) {
    const response = await fetch(
      authUrl + path,
      {
        method: 'POST',
        headers: this.#contentTypeHeader,
        body: JSON.stringify(data)
      }
    )
    return await this.#handleRes(response)
  }

  /**
   * Registers a new user.
   *
   * @param {object} user - The user object containing registration details.
   * @param {string} user.email - The user's email address.
   * @param {string} user.password - The user's password.
   * @param {string} user.username - The user's username.
   * @param {string} user.birthdate - The user's birthdate. 
   */
  async register(user) {
    await this.#post('/register', user)
  }

  /**
   * Logs in the user.
   *
   * @param {object} credentials - The credentials object containing login details.
   * @param {string} credentials.username - The user's username.
   * @returns {object} The response data containing the access token and refresh token.
   * @throws {Error} If the login fails.
   * @throws {Error} If the response is not ok or if JSON parsing fails.
   */
  async login(credentials) {
    const res = await this.#post('/login', credentials)
    this.#setTokens(res)
  }

  /**
   * Refreshes the access token using the refresh token.
   *
   * @returns {object} The response data containing the new access token and refresh token.
   * @throws {Error} If the refresh fails.
   */
  async refresh() {
    try {
      const response = await fetch(
        authUrl + '/refresh',
        this.#getRefreshConf()
      )

      const res = await this.#handleRes(response)
      this.#setTokens(res)
    } catch (error) {
      this.#handleError(error)
    }
  }

  /**
   * Refreshes the access token using the refresh token.
   *
   * @returns {object} The response data containing the new access token and refresh token.
   * @throws {Error} If the refresh fails.
   */
  async logout() {
    try {
      const response = await fetch(
        authUrl + '/logout',
        this.#getRefreshConf()
      )

      if ([204, 401].includes(response.status)) {
        this.#clearTokens()
      }
    } catch (error) {
      this.#handleError(error)
    }
  }
}