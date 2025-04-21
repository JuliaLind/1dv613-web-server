
export const createToastService = (toast) => ({
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
  alertSuccess(summary, detail) {
    this.alert(summary, detail, {
      severity: 'success',
      icon: 'pi pi-check'
    })
  },
  alertError(summary, detail) {
    this.alert(summary, detail, {
      severity: 'error',
      icon: 'pi pi-times'
    })
  },
  alertWarn(summary, detail) {
    this.alert(summary, detail, {
      severity: 'warn',
      icon: 'pi pi-exclamation-triangle'
    })
  },
  alertInfo(summary, detail) {
    this.alert(summary, detail, {
      severity: 'info',
      icon: 'pi pi-info-circle'
    })
  }
})
