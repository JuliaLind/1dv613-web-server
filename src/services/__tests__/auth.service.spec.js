import { describe, it, expect, vi, afterEach } from 'vitest'
import { mockFetch } from './helpers.js'

import { AuthService } from '../auth.service.js'
const authUrl = import.meta.env.VITE_AUTH_URL

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

  describe('login', () => {
    it('login, ok', async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      mockFetch(201, tokens)

      const credentials = {
        username: 'julia@email.com',
        password: 'password123',
      }
      await authService.login(credentials)

      expect(global.fetch).toHaveBeenCalledExactlyOnceWith(authUrl + '/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        }
      )

      expect(setItemSpy).toHaveBeenCalledTimes(2)
      expect(setItemSpy).toHaveBeenCalledWith('accessToken', tokens.accessToken)
      expect(setItemSpy).toHaveBeenCalledWith('refreshToken', tokens.refreshToken)
      expect(localStorage.getItem('accessToken')).toBe(tokens.accessToken)
      expect(localStorage.getItem('refreshToken')).toBe(tokens.refreshToken)
    })
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