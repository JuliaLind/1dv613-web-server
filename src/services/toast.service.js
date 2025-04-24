/**
 * Create a toast service for displaying notifications.
 *
 * @param {object} toast - The toast object from PrimeVue.
 * @returns {object} - The toast service with alert methods.
 */
export const createToastService = (toast) => ({
  /**
   * 
   * @param {string} summary - The summary of the alert (will show in the header as title text).
   * @param {string} detail - The detail of the alert (will show in the body as smaller text).
   * @param {object} config - associative array with
   * type and icon
   */
  alert(summary, detail, config) {
    toast.add({
      summary: summary,
      detail: detail,
      life: 3000,
      sticky: false,
      closable: true,
      ...config
    })
  },

  /**
   * Adds a success message to the toast.
   *
   * @param {string} summary - The summary of the alert (will show in the header as title text).
   * @param {string} detail - The detail of the alert (will show in the body as smaller text).
   */
  alertSuccess(summary, detail) {
    this.alert(summary, detail, {
      severity: 'success',
      icon: 'pi pi-check'
    })
  },

  /**
   * Adds an error message to the toast.
   *
   * @param {string} summary - The summary of the alert (will show in the header as title text).
   * @param {string} detail - The detail of the alert (will show in the body as smaller text).
   */
  alertError(summary, detail) {
    this.alert(summary, detail, {
      severity: 'error',
      icon: 'pi pi-times'
    })
  },

  /**
   * Adds a warning message to the toast.
   *
   * @param {string} summary - The summary of the alert (will show in the header as title text).
   * @param {string} detail - The detail of the alert (will show in the body as smaller text).
   */
  alertWarn(summary, detail) {
    this.alert(summary, detail, {
      severity: 'warn',
      icon: 'pi pi-exclamation-triangle'
    })
  },

  /**
   * Adds an info message to the toast.
   *
   * @param {string} summary - The summary of the alert (will show in the header as title text).
   * @param {string} detail - The detail of the alert (will show in the body as smaller text).
   */
  alertInfo(summary, detail) {
    this.alert(summary, detail, {
      severity: 'info',
      icon: 'pi pi-info-circle'
    })
  }
})
