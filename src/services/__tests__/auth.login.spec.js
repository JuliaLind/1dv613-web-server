import { describe, it, expect, vi, afterEach } from 'vitest'

import { AuthService } from '../auth.service.js'
import { mockResponse } from './helpers.js'


describe('Auth service, login', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  const tokens = {
    accessToken: 'myaccesstoken',
    refreshToken: 'myrefreshtoken',
  }

  it('ok, should call on tokenService to store tokens', async () => {
    const tokenService = {
      setTokens: vi.fn(),
    }
    const fetchService = {
      request: vi.fn(() => {
        return {
          status: 201,
        }
      }),
      handleResponse: vi.fn(() => {
        return tokens
      }),
    }
    const authService = new AuthService(tokenService, fetchService)

    const credentials = {
      email: 'julia@email.com',
      password: 'password123',
    }
    await authService.login(credentials)

    expect(fetchService.request).toHaveBeenCalledWith(
      {
        path: '/login',
        body: credentials,
      }
    )

    expect(fetchService.handleResponse).toHaveBeenCalledTimes(1)
    expect(fetchService.handleResponse).toHaveBeenCalledWith(expect.objectContaining({
      status: 201
    }))

    expect(tokenService.setTokens).toHaveBeenCalledTimes(1)
    expect(tokenService.setTokens).toHaveBeenCalledWith(tokens)
  })

  it('login, not ok, should not call tokenService.setTokens method', async () => {
    const errMsg = 'Invalid credentials'
    const tokenService = {
      setTokens: vi.fn(),
    }
    const fetchService = {
      request: vi.fn(() => {
        return {
          status: 401,
        }
      }),
      handleResponse: vi.fn(() => {
        throw new Error(errMsg)
      }),
    }
    const authService = new AuthService(tokenService, fetchService)

    fetchService.request.mockResolvedValue(
      mockResponse(401, {
        message: errMsg,
      })
    )


    const credentials = {
      email: 'julia@email.com',
      password: 'password123',
    }

    await expect(authService.login(credentials)).rejects.toThrow(errMsg)

    expect(fetchService.request).toHaveBeenCalledTimes(1)
    expect(fetchService.request).toHaveBeenCalledWith(
      {
        body: credentials,
        path: '/login',
      }
    )

    expect(tokenService.setTokens).not.toHaveBeenCalled()


    expect(fetchService.handleResponse).toHaveBeenCalledWith(expect.objectContaining({
      status: 401
    }))
  })
})