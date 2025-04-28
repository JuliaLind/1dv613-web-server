/* global global */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { mockFetch } from '@/services/__tests__/helpers.js'
import { FetchService } from '@/services/fetch.service.js'

import { badFetch } from '@/services/__tests__/helpers.js'



describe('FetchService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  const res = 'someresponse'
  const params = {
    path: 'path',
  }
  const baseUrl = 'thebaseUrl'
  const sut = new FetchService(baseUrl)

  it('ok without request body, should return the response from server', async () => {
    mockFetch(201, res)

    const result = await sut.request(params)

    expect(global.fetch).toHaveBeenCalledExactlyOnceWith(
      baseUrl + params.path,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: undefined,
      }
    )

    expect(result.status).toEqual(201)
    expect(await result.json()).toEqual(res)
  })

  it('ok with request body, should return the response from server', async () => {
    mockFetch(201, res)

    const data = {
      key: 'value'
    }

    const result = await sut.request({
      ...params,
      body: data,
    })

    expect(global.fetch).toHaveBeenCalledExactlyOnceWith(
      baseUrl + params.path,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

    expect(result.status).toEqual(201)
    expect(await result.json()).toEqual(res)
  })

  it('not ok, failed to get response from server', async () => {

    badFetch()

    const params = {
      path: 'path',
    }
    const errMsg = 'Could not connect to server'

    const requestPromise = sut.request(params)

    await expect(requestPromise).rejects.toThrow(errMsg)

    expect(global.fetch).toHaveBeenCalledExactlyOnceWith(
      baseUrl + params.path,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      }
    )
  })
})