import { vi } from 'vitest'

export function createFetchResponse(status, data) {
  return {
    json: () => new Promise((resolve) => resolve(data)),
    status: status,
  }
}

export function mockFetch(status, data) {
  global.fetch = vi.fn()
  fetch.mockResolvedValue(
    createFetchResponse(status, data)
  )
}