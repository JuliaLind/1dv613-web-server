import { describe, it, expect, vi, afterEach } from 'vitest'
import { mockResponse, mockBadJsonResponse } from '@/services/__tests__/helpers.js'
import { FetchService } from '@/services/fetch.service.js'

describe('FetchService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  const data = 'someresponse'
  const sut = new FetchService()

  it('ok, should return the data from response', async () => {
    const response = mockResponse(201, data)
    const res = await sut.handleResponse(response)

    expect(res).toEqual(data)
  })

  it('ok, 204 response, should return undefined', async () => {
    const response = mockResponse(204, undefined)
    const res = await sut.handleResponse(response)

    expect(res).toEqual(undefined)
  })

  it('not ok, json parse error, should throw error', async () => {
    const errMsg = 'Bad response from server'
    const response = mockBadJsonResponse()

    await expect(sut.handleResponse(response)).rejects.toThrow(errMsg)
  })

  it('not ok, error status code, should throw error with message sent in response from server', async () => {
    const errMsg = 'You did something wrong'
    const response = mockResponse(400, {
      message: errMsg,
    })

    await expect(sut.handleResponse(response)).rejects.toThrow(errMsg)
  })
})