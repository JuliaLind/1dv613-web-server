/* global global */

import { vi } from 'vitest'


export function mockResponse(status, data) {
  return {
    json: () => new Promise((resolve) => resolve(data)),
    status: status,
  }
}

export function mockBadJsonResponse() {
  return {
    json: () => Promise.reject(new Error('Bad json')),
    status: 201,
  }
}

/**
 * Mocks the global fetch function to return a resolved promise with the given status and data.
 *
 * @param {number} status - the response status
 * @param {any} data - the response data
 */
export function mockFetch(status, data) {
  global.fetch = vi.fn()
  fetch.mockResolvedValue(mockResponse(status, data))
}

/**
 * Mocks a fetch with "bad json" response.
 *
 */
export function badJsonFetch() {
  global.fetch = vi.fn()
  fetch.mockResolvedValue(mockBadJsonResponse())
}

export function badFetch() {
  global.fetch = vi.fn()
  fetch.mockRejectedValue(
    new Error('Could not connect to server')
  )
}