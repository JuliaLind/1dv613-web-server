import { describe, it, expect, vi, afterEach } from 'vitest'
import { tryCatch } from '../helpers.js'


describe('helpers module', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  describe('tryCatch', () => {
    it('ok, should call function with correct arguments,', async () => {
      const func = vi.fn()
      const errorHandler = vi.fn()
      const arg1 = 'arg1'
      const arg2 = 'arg2'
      const arg3 = 'arg3'

      await tryCatch(func, errorHandler, arg1, arg2, arg3)
      expect(func).toHaveBeenCalledTimes(1)
      expect(func).toHaveBeenCalledWith(arg1, arg2, arg3)
      expect(errorHandler).not.toHaveBeenCalled()
    })

    it('not ok, function throws, should call error handler', async () => {
      const func = vi.fn(() => {
        throw new Error('error')
      })
      const errorHandler = vi.fn()
      const arg1 = 'arg1'
      const arg2 = 'arg2'
      const arg3 = 'arg3'

      await tryCatch(func, errorHandler, arg1, arg2, arg3)
      expect(func).toHaveBeenCalledTimes(1)
      expect(func).toHaveBeenCalledWith(arg1, arg2, arg3)
      expect(errorHandler).toHaveBeenCalledWith(expect.any(Error))
    })
  })

})