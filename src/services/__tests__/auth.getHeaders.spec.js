import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthService } from '../auth.service.js'


describe('Auth service, getHeaders', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })


  const accessToken = 'myaccesstoken'
  const expHeaders = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }

  it('ok, should return headers with access token', async () => {

    const tokenService = {
      getAccessToken: vi.fn(() => accessToken),
      getAuthHeader: vi.fn(() => expHeaders),
    }
    const authService = new AuthService(tokenService, {})
    authService.refresh = vi.fn()


    const headers = await authService.getHeaders()

    expect(tokenService.getAccessToken).toHaveBeenCalledTimes(1)
    expect(tokenService.getAuthHeader).toHaveBeenCalledWith(accessToken)
    expect(authService.refresh).not.toHaveBeenCalled()
    expect(headers).toEqual(expHeaders)
  })

  it('not ok, first call to getAccessToken throws error with status 401, should call getAccessToken second time and return headers with access token', async () => {
    const tokenService = {
      getAccessToken: vi
        .fn()
        .mockImplementationOnce(() => {
          const error = new Error('Token expired')
          error.status = 401
          throw error
        })
        .mockImplementationOnce(() => accessToken),
      getAuthHeader: vi.fn(() => expHeaders),
    }
    const authService = new AuthService(tokenService, {})
    authService.refresh = vi.fn()
    const headers = await authService.getHeaders()

    expect(tokenService.getAccessToken).toHaveBeenCalledTimes(2)
    expect(tokenService.getAuthHeader).toHaveBeenCalledWith(accessToken)
    expect(authService.refresh).toHaveBeenCalledTimes(1)
    expect(headers).toEqual(expHeaders)
  })

  it('not ok, both calls to getAccessToken throw error with status 401, should let error propagate', async () => {
    const errMsg = 'Token expired'
    const tokenService = {
      getAccessToken: vi
        .fn(() => {
          const error = new Error(errMsg)
          error.status = 401
          throw error
        }),
      getAuthHeader: vi.fn(),
    }
    const authService = new AuthService(tokenService, {})
    authService.refresh = vi.fn()

    await expect(authService.getHeaders()).rejects.toThrow(errMsg)

    expect(tokenService.getAccessToken).toHaveBeenCalledTimes(2)
    expect(authService.refresh).toHaveBeenCalledTimes(1)
    expect(tokenService.getAuthHeader).not.toHaveBeenCalled()
  })

  it('not ok, no token found in local storage, should let error propagate', async () => {
    const errMsg = 'No token found'
    const tokenService = {
      getAccessToken: vi
        .fn(() => {
          throw new Error(errMsg)
        }),
      getAuthHeader: vi.fn(),
    }
    const authService = new AuthService(tokenService, {})
    authService.refresh = vi.fn()

    await expect(authService.getHeaders()).rejects.toThrow(errMsg)

    expect(tokenService.getAccessToken).toHaveBeenCalledTimes(1)
    expect(authService.refresh).not.toHaveBeenCalled()
    expect(tokenService.getAuthHeader).not.toHaveBeenCalled()
  })
})