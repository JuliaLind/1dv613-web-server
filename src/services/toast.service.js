/**
 * Create a toast service for displaying notifications.
 *
 * @param {object} toast - The toast object from PrimeVue.
 * @returns {object} - The toast service with alert methods.
 */
export const createToastService = (toast) => ({
  /**
   * Generic alert method to add a message to the toast.
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
      // sticky: false,
      closable: true,
      group: 'orange',
      icon: '',
      ...config
    })
  },

  /**
   * Adds a success message to the toast.
   *
   * @param {string} summary - The summary of the alert (will show in the header as title text).
   * @param {string} detail - The detail of the alert (will show in the body as smaller text).
   * @param config
   */
  alertSuccess(summary, detail, config = {}) {
    this.alert(summary, detail, {
      severity: 'success',
      // icon: 'pi pi-check',
      ...config
    })
  },

  /**
   * Adds an error message to the toast.
   *
   * @param {string} summary - The summary of the alert (will show in the header as title text).
   * @param {string} detail - The detail of the alert (will show in the body as smaller text).
   * @param config
   */
  alertError(summary, detail, config = {}) {
    this.alert(summary, detail, {
      severity: 'error',
      // icon: 'pi pi-times'
      ...config
    })
  },

  /**
   * Adds a warning message to the toast.
   *
   * @param {string} summary - The summary of the alert (will show in the header as title text).
   * @param {string} detail - The detail of the alert (will show in the body as smaller text).
   * @param config
   */
  alertWarn(summary, detail, config = {}) {
    this.alert(summary, detail, {
      severity: 'warn',
      // icon: 'pi pi-exclamation-triangle'
      ...config
    })
  },

  /**
   * Adds an info message to the toast.
   *
   * @param {string} summary - The summary of the alert (will show in the header as title text).
   * @param {string} detail - The detail of the alert (will show in the body as smaller text).
   * @param config
   */
  alertInfo(summary, detail, config = {}) {
    this.alert(summary, detail, {
      severity: 'info',
      // icon: 'pi pi-info-circle',
      ...config
    })
  }
})
