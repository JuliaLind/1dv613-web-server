import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthService } from '../auth.service.js'


describe('Auth service, logout', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  const tokens = {
    accessToken: 'myaccesstoken',
    refreshToken: 'myrefreshtoken',
  }

  it('Should call isLoggedOut method of tokenService', async () => {
    const tokenService = {
      getRefreshToken: vi.fn(() => tokens.refreshToken),
      getAuthHeader: vi.fn(() => ({
        Authorization: `Bearer ${tokens.refreshToken}`,
        'Content-Type': 'application/json',
      })
      ),
      isLoggedOut: vi.fn(),
    }

    const fetchService = {
      request: vi.fn(() => {
        return {
          status: 204,
        }
      }),
      handleResponse: vi.fn(() => {
        return tokens
      }),
    }
    const authService = new AuthService(tokenService, fetchService)


    await authService.logout()

    expect(fetchService.request).toHaveBeenCalledWith(
      {
        path: '/logout',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.refreshToken}`,
        },
      }
    )

    expect(tokenService.isLoggedOut).toHaveBeenCalledWith(204)
  })
})