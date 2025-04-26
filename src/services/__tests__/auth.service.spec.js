import { describe, it, expect, vi, afterEach } from 'vitest'

import { AuthService } from '../auth.service.js'

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
  const authService = new AuthService()

  it('login, ok', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    const originalPost = authService.post

    // mock the dependencies
    authService.post = vi.fn().mockResolvedValueOnce(tokens)

    const credentials = {
      username: 'julia@email.com',
      password: 'password123',
    }
    await authService.login(credentials)

    expect(authService.post).toHaveBeenCalledExactlyOnceWith('/login', credentials)

    expect(setItemSpy).toHaveBeenCalledTimes(2)
    expect(setItemSpy).toHaveBeenCalledWith('accessToken', tokens.accessToken)
    expect(setItemSpy).toHaveBeenCalledWith('refreshToken', tokens.refreshToken)
    expect(localStorage.getItem('accessToken')).toBe(tokens.accessToken)
    expect(localStorage.getItem('refreshToken')).toBe(tokens.refreshToken)

    authService.post = originalPost
  })

  // it('setTokens, ok', () => {
  //   const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

  //   const tokens = {
  //     accessToken: 'myaccesstoken',
  //     refreshToken: 'myrefreshtoken',
  //   }

  //   authService.setTokens(tokens)

  //   expect(setItemSpy).toHaveBeenCalledTimes(2)
  //   expect(setItemSpy).toHaveBeenCalledWith('accessToken', tokens.accessToken)
  //   expect(setItemSpy).toHaveBeenCalledWith('refreshToken', tokens.refreshToken)
  //   expect(localStorage.getItem('accessToken')).toBe(tokens.accessToken)
  //   expect(localStorage.getItem('refreshToken')).toBe(tokens.refreshToken)

  //   localStorage.clear()
  // })
})