import { describe, it, expect, vi, afterEach } from 'vitest'

import { AuthService } from '../auth.service.js'
import { mockResponse } from './helpers.js'


describe('Auth service, login', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('ok, should call fetchService.request and fetchService.handleResponse', async () => {
    const userid = 'newuserid'
    const response = mockResponse(201, {
      id: userid,
    })
    const fetchService = {
      request: vi.fn(() => {
        return response
      }),
      handleResponse: vi.fn(() => {
        return userid
      }),
    }

    const authService = new AuthService({}, fetchService)
    const credentials = {
      email: 'julia@email.com',
      password: 'password123',
      birthDate: '1990-01-01',
    }
    await authService.register(credentials)

    expect(fetchService.request).toHaveBeenCalledWith(
      {
        path: '/register',
        body: credentials,
      }
    )

    expect(fetchService.handleResponse).toHaveBeenCalledTimes(1)
    expect(fetchService.handleResponse).toHaveBeenCalledWith(expect.objectContaining({
      status: 201
    }))
  })
  it('failed fetch, should let error propagate and not call the handleResponse method', async () => {
    const errMsg = 'Network error'
    const fetchService = {
      request: vi.fn(() => {
        throw new Error(errMsg)
      }),
      handleResponse: vi.fn(),
    }

    const authService = new AuthService({}, fetchService)
    const credentials = {
      email: 'julia@email.com',
      password: 'password123',
      birthDate: '1990-01-01',
    }

    await expect(authService.register(credentials)).rejects.toThrow(errMsg)


    expect(fetchService.request).toHaveBeenCalledWith(
      {
        path: '/register',
        body: credentials,
      }
    )

    expect(fetchService.handleResponse).not.toHaveBeenCalled()
  })
})