import { describe, it, expect, vi, afterEach } from 'vitest'
import { jwtDecode } from 'jwt-decode'
import { getUnixTime } from 'date-fns'

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}))
vi.mock('date-fns', () => ({
  getUnixTime: vi.fn(),
}))
import { TokenService } from '../token.service'



describe('Token service', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    localStorage.clear()
  })

  const tokens = {
    accessToken: 'myaccesstoken',
    refreshToken: 'myrefreshtoken',
  }

  it('setTokens', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem') // localStorage.setItem
    const sut = new TokenService()

    sut.setTokens(tokens)

    expect(setItemSpy).toHaveBeenCalledTimes(2)
    expect(setItemSpy).toHaveBeenCalledWith('accessToken', tokens.accessToken)
    expect(setItemSpy).toHaveBeenCalledWith('refreshToken', tokens.refreshToken)
    expect(localStorage.getItem('accessToken')).toBe(tokens.accessToken)
    expect(localStorage.getItem('refreshToken')).toBe(tokens.refreshToken)
  })

  describe('getAccessToken - req 1.4.4 checks accessToken for expiry between getting from local storage and returning to requesting service', () => {
    it('ok, should return access token from local storage', () => {
      const sut = new TokenService()
      Storage.prototype.getItem = vi.fn(() => tokens.accessToken)
      sut.isExpiring = vi.fn(() => false)

      const accessToken = sut.getAccessToken()

      expect(accessToken).toBe(tokens.accessToken)
      expect(Storage.prototype.getItem).toHaveBeenCalledExactlyOnceWith('accessToken')
    })

    it('not ok, no access token in local storage, should throw error', () => {
      const sut = new TokenService()
      Storage.prototype.getItem = vi.fn(() => null)

      expect(() => sut.getAccessToken()).toThrow('No token found')

      expect(Storage.prototype.getItem).toHaveBeenCalledExactlyOnceWith('accessToken')
    })

    it('not ok, access token expired, should throw error', () => {
      const sut = new TokenService()
      Storage.prototype.getItem = vi.fn(() => 'thisIsAnExpiredToken')
      sut.isExpiring = vi.fn(() => true)

      expect(() => sut.getAccessToken()).toThrow('Token is expiring')

      expect(Storage.prototype.getItem).toHaveBeenCalledExactlyOnceWith('accessToken')
    })
  })

  describe('getRefreshToken', () => {
    it('ok should return refresh token from local storage', () => {
      const sut = new TokenService()
      Storage.prototype.getItem = vi.fn(() => tokens.refreshToken)

      const refreshToken = sut.getRefreshToken()

      expect(refreshToken).toBe(tokens.refreshToken)
      expect(Storage.prototype.getItem).toHaveBeenCalledExactlyOnceWith('refreshToken')
    })


    it('not ok, no refresh token found local storage, should throw error', () => {
      const sut = new TokenService()
      Storage.prototype.getItem = vi.fn(() => null)

      expect(() => sut.getRefreshToken()).toThrow('No token found')

      expect(Storage.prototype.getItem).toHaveBeenCalledExactlyOnceWith('refreshToken')
    })
  })

  it('clearTokens', () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')
    const sut = new TokenService()
    sut.clearTokens()
    expect(removeItemSpy).toHaveBeenCalledTimes(2)
    expect(removeItemSpy).toHaveBeenCalledWith('accessToken')
    expect(removeItemSpy).toHaveBeenCalledWith('refreshToken')
  })

  it('getAuthHeader', () => {
    const sut = new TokenService()
    const token = 'anytoken'

    const header = sut.getAuthHeader(token)

    expect(header).toEqual({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    })
  })

  describe('handleError', () => {
    it('401 error, should clear tokens', () => {
      const errMsg = 'Token expired'
      const sut = new TokenService()
      sut.clearTokens = vi.fn()
      const error = new Error(errMsg)
      error.status = 401

      expect(() => sut.handleError(error)).toThrow(errMsg)

      expect(sut.clearTokens).toHaveBeenCalledTimes(1)
    })

    it('400 error, should not clear tokens', () => {
      const errMsg = 'Bad request'
      const sut = new TokenService()
      sut.clearTokens = vi.fn()
      const error = new Error(errMsg)
      error.status = 400

      expect(() => sut.handleError(error)).toThrow(errMsg)

      expect(sut.clearTokens).not.toHaveBeenCalled()
    })
  })

  describe('isLoggedOut', () => {
    it('ok, should clear tokens', () => {
      const sut = new TokenService()
      sut.clearTokens = vi.fn()

      sut.isLoggedOut(204)

      expect(sut.clearTokens).toHaveBeenCalledTimes(1)
    })

    it('not ok, should not clear tokens', () => {
      const errMsg = 'Something went wrong'
      const sut = new TokenService()
      sut.clearTokens = vi.fn()

      expect(() => sut.isLoggedOut(500)).toThrow(errMsg)

      expect(sut.clearTokens).not.toHaveBeenCalled()
    })
  })

  describe('isExpiring', () => {
    it('ok, exactly 11 seconds left, should return false', () => {
      const sut = new TokenService()
      const token = {
        exp: 51,
      }

      jwtDecode.mockReturnValue(token)
      getUnixTime.mockReturnValue(40)

      const result = sut.isExpiring(token)

      expect(result).toBe(false)
    })

    it('not ok, exactly 10 seconds left, should return true', () => {
      const sut = new TokenService()
      const token = {
        exp: 50,
      }

      jwtDecode.mockReturnValue(token)
      getUnixTime.mockReturnValue(40)

      const result = sut.isExpiring(token)

      expect(result).toBe(true)
    })

    it('not ok, 9 seconds left, should return true', () => {
      const sut = new TokenService()

      const token = {
        exp: 50
      }
      jwtDecode.mockReturnValue(token)
      getUnixTime.mockReturnValue(41)

      const result = sut.isExpiring(token)

      expect(result).toBe(true)
    })
  })
})