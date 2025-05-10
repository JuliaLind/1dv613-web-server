import { jwtDecode } from "jwt-decode"
import { getUnixTime } from 'date-fns'

export class TokenService {
  /**
   * 
   * @param {object} token - json web token 
   * @param {number} seconds - minimum number fo seconds until expiration
   * @returns {boolean} - true if the token is expiring within the provided seconds,
   * otherwise false
   */
  isExpiring(token, seconds = 10) {
    // no error-catching, let propagate
    const payload = jwtDecode(token)
    const now = getUnixTime(new Date())

    return payload.exp <= now + seconds
  }

  /**
   * Checks if the user is logged out based on the response status code.
   *
   * @param {number} status - the response status code from server
   * @param {Array<number>} okStatus - array of status codes that are considered ok
   * @throws {Error} - if the status code is not in the okStatus array
   */
  isLoggedOut(status, okStatus = [204, 401]) {
    if (!okStatus.includes(status)) {
      throw new Error('Something went wrong')
    }
    this.clearTokens()
  }

  /**
   * Clears the access and refresh tokens from local storage.
   */
  clearTokens() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  /**
   * Returns the token from local storage.
   *
   * @param {string} type - type of token 
   * @returns {string} - token
   * @throws {Error} - if no token is found
   */
  #getToken(type) {
    const token = localStorage.getItem(type)

    if (!token) {
      throw new Error('No token found')
    }
    return token
  }

  /**
   * Returns the payload of the access token.
   *
   * @param {object} token - json web token 
   * @returns {object} - decoded token payload
   * @throws {Error} - if no token is found
   */
  getPayload() {
    const token = this.#getToken('accessToken')
    return jwtDecode(token)
  }

  /**
   * Returns the access token from local storage.
   *
   * @returns {string} - access token
   */
  getAccessToken() {
    const token = this.#getToken('accessToken')

    if (this.isExpiring(token)) {
      const err = new Error('Token is expiring')
      err.status = 401
      throw err
    }

    return token
  }

  /**
   * Returns the refresh token from local storage.
   *
   * @returns {string} - refresh token
   */
  getRefreshToken() {
    return this.#getToken('refreshToken')
  }

  /**
   * Stores the access and refresh tokens in local storage.
   *
   * @param {object} tokens - access and refresh tokens.
   * @param {string} tokens.accessToken - The access token.
   * @param {string} tokens.refreshToken - The refresh token.
   */
  setTokens(tokens) {
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  }

  getAuthHeader(token) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  /**
  * Handles errors that occur during authentication requests.
  *
  * @param {object} error - The error object.
  * @throws {Error} If the error status is 401, clears tokens and throws an error.
  */
  handleError(error) {
    if (error.status === 401) {
      this.clearTokens()
    }
    throw error
  }
}