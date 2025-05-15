
/**
 * Handles fetch requests and responses.
 */
export class FetchService {
  #baseUrl
  /**
   * Creates a new instance of the FetchService.
   *
   * @param {string} baseUrl - the base URL for the fetch requests
   */
  constructor(baseUrl) {
    this.#baseUrl = baseUrl
  }


  /**
   * Handles the response from a fetch request.
   *
   * @param {object} response - the response object 
   * @returns {any} - the response data
   */
  async handleResponse(response) {
    let data

    // 404 is ok, will happen often if user has not registered
    // data or meals on selected date
    if ([204, 404].includes(response.status)) {
      return undefined
    }

    try {
      data = await response.json()
    } catch {
      throw new Error("Bad response from server")
    }

    if (response.status >= 400) {
      const error = new Error(data.message)
      error.status = response.status
      throw error
    }

    return data
  }

  /**
   * Handles a fetch request.
   *
   * @param {object} options - the options for the fetch request
   * @param {string} options.path - the path for the fetch request
   * @param {object} options.headers - the headers for the fetch request
   * @param {object} options.body - the body for the fetch request
   * @param {string} options.method - the method for the fetch request
   * @returns {object} - the response object
   * @throws {Error} - if the request fails
   */
  async request({
    path,
    headers = {
      'Content-Type': 'application/json'
    },
    body,
    method = 'POST' }) {

    // let errors from fetch propagate
    const response = await fetch(
      this.#baseUrl + path,
      {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      }
    )

    return response
  }
}