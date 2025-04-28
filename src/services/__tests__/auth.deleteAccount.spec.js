import { describe, it, expect, vi, afterEach } from 'vitest'
import { AuthService } from '../auth.service.js'


describe('Auth service, deleteAccount', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('ok, tokenService.isLoggedOut should be called', async () => {
    const tokenService = {
      isLoggedOut: vi.fn(),
    }
    const fetchService = {
      request: vi.fn(() => {
        return {
          status: 204,
        }
      }),
    }
    const authService = new AuthService(tokenService, fetchService)


    const credentials = {
      username: 'julia@email.com',
      password: 'password123',
    }
    await authService.deleteAccount(credentials)

    expect(fetchService.request).toHaveBeenCalledExactlyOnceWith({
      method: 'DELETE',
      path: '/',
      body: credentials,
    })


    expect(tokenService.isLoggedOut).toHaveBeenCalledTimes(1)
    expect(tokenService.isLoggedOut).toHaveBeenCalledWith(204, [204])
  })
})