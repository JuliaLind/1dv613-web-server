const authUrl = process.env.VUE_AUTH_URL

/**
 * Service for handling authentication requests.
 */
export class DataService {
  /**
   * Sends a POST request containing a body
   * to the authentication server.
   *
   * @param {string} path - The endpoint path.
   * @param {object} data - The request payload.
   * @returns {Promise<object>} The response data.
   */
  async post(path, data) {
    const response = await fetch(dataUrl + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    return await this.handleRes(response)
  }

  /**
   * Handles the response from a fetch request.
   *
   * @param {object} response - The response object from the fetch request.
   * @returns the parsed JSON data if the response is ok, otherwise throws an error.
   * @throws {Error} If the response is not ok or if JSON parsing fails.
   */
  async handleRes(response) {
    let data
    try {
      data = await response.json()
    } catch (error) {
      throw new Error('Something went wrong')
    }
    if (!response.ok) {
      throw new Error(data.message)
    }
    return data
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
    await this.post('/register', user)
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
    return await this.post('/login', credentials)
  }

  /**
   * Refreshes the access token using the refresh token.
   *
   * @param {string} refreshtoken - The refresh token used to obtain a new token pair of access token and refresh token.
   * @returns {object} The response data containing the new access token and refresh token.
   * @throws {Error} If the refresh fails.
   * @throws {Error} If JSON parsing fails.
   */
  async refresh(refreshtoken) {
    const response = await fetch(authUrl + '/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshtoken}`
      },
    })
    return await this.handleRes(response)
  }
}