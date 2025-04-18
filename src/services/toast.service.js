
export const createToastService = (toast) => ({
  alertSuccess (summary, detail) {
    toast.add({
      severity: 'success',
      summary: summary,
      detail: detail,
      life: 3000,
      sticky: false,
      closable: true,
      icon: 'pi pi-check'
    })
  },
  alertError (summary, detail) {
    toast.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: 3000,
      sticky: false,
      closable: true,
      icon: 'pi pi-times'
    })
  },
  alertWarn (summary, detail) {
    toast.add({
      severity: 'warn',
      summary: summary,
      detail: detail,
      life: 3000,
      sticky: false,
      closable: true,
      icon: 'pi pi-exclamation-triangle'
    })
  },
  alertInfo (summary, detail) {
    toast.add({
      severity: 'info',
      summary: summary,
      detail: detail,
      life: 3000,
      sticky: false,
      closable: true,
      icon: 'pi pi-info-circle'
    })
  }
})
