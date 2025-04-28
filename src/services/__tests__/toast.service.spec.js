import { createToastService } from '../toast.service'
import { describe, it, expect, vi, afterEach, afterAll } from 'vitest'

describe('createToastService', () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('alert', () => {
    const toast = {
      add: vi.fn(),
    }
    const sut = createToastService(toast)
    it('alert, should call toast.add with correct parameters', () => {
      const summary = 'message title'
      const detail = 'message detail'
      const config = {
        severity: 'success',
        icon: 'pi pi-check',
      }
      sut.alert(summary, detail, config)
      expect(toast.add).toHaveBeenCalledWith({
        summary,
        detail,
        life: 3000,
        sticky: false,
        closable: true,
        ...config,
      })
    })
  })

  describe('different alert types', () => {
    const sut = createToastService({})
    sut.alert = vi.fn()
    const summary = 'message title'
    const detail = 'message detail'

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('alertSuccess, should call alert with severity success', () => {
      sut.alertSuccess(summary, detail)
      expect(sut.alert).toHaveBeenCalledWith(summary, detail, {
        severity: 'success',
        icon: 'pi pi-check',
      })
    })

    it('alertError, should call alert with severity error', () => {
      sut.alertError(summary, detail)
      expect(sut.alert).toHaveBeenCalledWith(summary, detail, {
        severity: 'error',
        icon: 'pi pi-times',
      })
    })

    it('alertWarn, should call alert with severity warn', () => {
      sut.alertWarn(summary, detail)
      expect(sut.alert).toHaveBeenCalledWith(summary, detail, {
        severity: 'warn',
        icon: 'pi pi-exclamation-triangle',
      })
    })

    it('alertInfo, should call alert with severity info', () => {
      sut.alertInfo(summary, detail)
      expect(sut.alert).toHaveBeenCalledWith(summary, detail, {
        severity: 'info',
        icon: 'pi pi-info-circle',
      })
    })
  })








})