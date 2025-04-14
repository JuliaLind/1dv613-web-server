import { describe, it, expect, vi, afterEach } from 'vitest'

import { authService } from '../auth.service.js'

describe('Auth service', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    localStorage.clear()
  })

  const tokens = {
    accessToken: 'myacccesstoken',
    refreshToken: 'myrefreshtoken',
  }

  it('login, ok', async () => {
    // save for later restoring
    const originalSetTokens = authService.setTokens
    const originalPost = authService.post

    // mock the dependencies
    authService.post = vi.fn().mockResolvedValueOnce(tokens)
    authService.setTokens = vi.fn()

    const credentials = {
      username: 'julia@email.com',
      password: 'password123',
    }
    await authService.login(credentials)

    expect(authService.post).toHaveBeenCalledExactlyOnceWith('/login', credentials)
    expect(authService.setTokens).toHaveBeenCalledExactlyOnceWith(tokens)

    // restor original implementations
    authService.setTokens = originalSetTokens
    authService.post = originalPost
  })

  it('setTokens, ok', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

    const tokens = {
      accessToken: 'myaccesstoken',
      refreshToken: 'myrefreshtoken',
    }

    authService.setTokens(tokens)

    expect(setItemSpy).toHaveBeenCalledTimes(2)
    expect(setItemSpy).toHaveBeenCalledWith('accessToken', tokens.accessToken)
    expect(setItemSpy).toHaveBeenCalledWith('refreshToken', tokens.refreshToken)
    expect(localStorage.getItem('accessToken')).toBe(tokens.accessToken)
    expect(localStorage.getItem('refreshToken')).toBe(tokens.refreshToken)

    localStorage.clear()
  })
})