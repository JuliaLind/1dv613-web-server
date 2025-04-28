import { describe, it, expect, vi, afterEach } from 'vitest'
import { mockResponse } from './helpers.js'
import { AuthService } from '../auth.service.js'

describe('Auth service, refresh', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  const tokens = {
    accessToken: 'myaccesstoken',
    refreshToken: 'myrefreshtoken',
  }

  it('refresh, ok', async () => {
    const tokenService = {
      getRefreshToken: vi.fn(() => tokens.refreshToken),
      setTokens: vi.fn(),
      handleError: vi.fn(),
      getAuthHeader: vi.fn(() => ({
        Authorization: `Bearer ${tokens.refreshToken}`,
        'Content-Type': 'application/json',
      })),
    }
    const response = mockResponse(201, tokens)

    const fetchService = {
      request: vi.fn(() => {
        return response
      }),
      handleResponse: vi.fn(() => {
        return tokens
      }),
    }

    const authService = new AuthService(tokenService, fetchService)

    await authService.refresh()

    expect(fetchService.request).toHaveBeenCalledExactlyOnceWith(
      {
        path: '/refresh',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.refreshToken}`,
        },
      },
    )

    expect(fetchService.handleResponse).toHaveBeenCalledTimes(1)
    expect(fetchService.handleResponse).toHaveBeenCalledWith(expect.objectContaining({
      status: 201
    }))

    expect(tokenService.setTokens).toHaveBeenCalledTimes(1)
    expect(tokenService.setTokens).toHaveBeenCalledWith(tokens)
    expect(tokenService.handleError).not.toHaveBeenCalled()
  })

  it('refresh, not ok, request failed', async () => {
    const errMsg = 'Could not connect to server'
    const fetchService = {
      request: vi.fn(() => {
        throw new Error(errMsg)
      }),
      handleResponse: vi.fn(),
    }

    const tokenService = {
      getRefreshToken: vi.fn(() => tokens.refreshToken),
      setTokens: vi.fn(),
      handleError: vi.fn(() => {
        throw new Error(errMsg)
      }),
      getAuthHeader: vi.fn(() => ({
        Authorization: `Bearer ${tokens.refreshToken}`,
        'Content-Type': 'application/json',
      })),
    }

    const authService = new AuthService(tokenService, fetchService)

    await expect(authService.refresh()).rejects.toThrow(errMsg)

    expect(fetchService.request).toHaveBeenCalledExactlyOnceWith(
      {
        path: '/refresh',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.refreshToken}`,
        },
      })
    expect(fetchService.handleResponse).not.toHaveBeenCalled() // if request fails, handleResponse is not called
    expect(tokenService.setTokens).not.toHaveBeenCalled() // if request fails, setTokens is not called
    expect(tokenService.handleError).toHaveBeenCalledWith(expect.objectContaining({
      message: errMsg,
    }))
  })

  it('refresh, not ok, fetchService.handleResponse failed', async () => {
    const response = mockResponse(201, tokens)
    const errMsg = 'Bad response from server'

    const fetchService = {
      request: vi.fn(() => {
        return response
      }),
      handleResponse: vi.fn(() => {
        throw new Error(errMsg)
      }),
    }

    const tokenService = {
      getRefreshToken: vi.fn(() => tokens.refreshToken),
      setTokens: vi.fn(),
      handleError: vi.fn(() => {
        throw new Error(errMsg)
      }),
      getAuthHeader: vi.fn(() => ({
        Authorization: `Bearer ${tokens.refreshToken}`,
        'Content-Type': 'application/json',
      })),
    }

    const authService = new AuthService(tokenService, fetchService)

    await expect(authService.refresh()).rejects.toThrow(errMsg)

    expect(fetchService.request).toHaveBeenCalledExactlyOnceWith(
      {
        path: '/refresh',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.refreshToken}`,
        },
      })
    expect(fetchService.handleResponse).toHaveBeenCalledWith(response)
    expect(tokenService.setTokens).not.toHaveBeenCalled() // if request fails, setTokens is not called
    expect(tokenService.handleError).toHaveBeenCalledWith(expect.objectContaining({
      message: errMsg,
    }))
  })

})