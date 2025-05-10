import { isRef, unref } from 'vue'
import { useRouter } from 'vue-router'
import { createToastService } from '@/services/toast.service.js'


/**
 * Calls and async function and handles the error
 * by calling the errorHandler function.
 *
 * @param {Function} fn - any async function
 * @param {array} args - arguments to be passed to the function
 * @param {Function} errorHandler - function to handle the error
 * @returns {Promise<any>} - the result of the function
 */
export async function tryCatch(fn, errorHandler, ...args) {
  try {
    return await fn(...args)
  } catch (error) {
    errorHandler(error)
  }
}

/**
 * Unwraps a value if it is a ref.
 * If it is not a ref, it returns the value as is.
 *
 * @param {object} value - the value to be unwrapped
 * @returns {object} - the unwrapped value
 */
export function unwrap(value) {
  return isRef(value) ? unref(value) : value
}

/**
 * If the error is due to failed authentication,
 * redirects to the login page with an error message. Otherwise only displays
 * the error message.
 *
 * @param {Error} error - the caught error
 * @param {object} toast - the Primevue toast object
 * @returns {void}
 */
export function handleError(error, toast) {
  const router = useRouter()
  const toastService = createToastService(toast)

    if (error.status === 401) {
    router.push('/login')
    toastService.alertError('Session expired', 'Please login again')
    return
  }
  toastService.alertError('Action failed.', error.message, 'Please try again later')
}
