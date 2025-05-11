/* global global */

import { vi } from 'vitest'

/**
 * Mocks a response object with a json method that resolves to the given data.
 *
 * @param {number} status - the response status
 * @param {any} data - the response data
 * @returns {object} - the mocked response object
 */
export function mockResponse(status, data) {
  return {
    json: () => new Promise((resolve) => resolve(data)),
    status: status,
  }
}

/**
 * Mocks a response object with ok status but
 * a json method that rejects with an error, to resemble
 * a parsing error.
 *
 * @returns {object} - the mocked response object with a bad json method
 */
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
 * Mocks global fetch to return a "bad json" response.
 */
export function badJsonFetch() {
  global.fetch = vi.fn()
  fetch.mockResolvedValue(mockBadJsonResponse())
}

/**
 * Mocks global fetch to return a rejected promise with an error message.
 */
export function badFetch() {
  global.fetch = vi.fn()
  fetch.mockRejectedValue(
    new Error('Could not connect to server')
  )
}