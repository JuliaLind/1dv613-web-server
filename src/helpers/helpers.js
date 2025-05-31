import { isRef, unref } from 'vue'
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
 * @param router
 * @returns {void}
 */
export function handleError(error, toast, router) {
  const toastService = createToastService(toast)

    if (error.status === 401) {
    router.push('/login')
    toastService.alertError('Session expired', 'Please login again')
    return
  }
  toastService.alertError('Action failed.', error.message, 'Please try again later')
}


/**
 * Resize an image file to a specific size and return a data-URL.
 *
 * @param {File} file The original image file
 * @param {number} size The desired width and height (in px) for the resized image
 * @returns {Promise<string>} A Promise that resolves to a base64 encoded dataUrl string.
 */
export function resizeImage(file, size) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const reader = new FileReader()

    // Step 2: When FileReader has loaded the original file as a data url:
    reader.onload = (e) => {
      // step 4: called when the image has finished loading after assigning the src attribute below
      img.onload = () => {
        canvas.width = size
        canvas.height = size

        // Draw the original image onto our square canvas
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, size, size)

        const dataUrl = canvas.toDataURL('image/jpeg') // put the resized image into a data url

        // step 5: return the data url with the resized image
        resolve(dataUrl)
      }

      // step 3: make the image load the original file
      img.src = e.target.result // this is the data url of the original image
    }

    reader.onerror = () => {
      reader.abort()
      reject(new Error('Failed to read file as Data URL'))
    }

    // step 1: read the file, when finished loading the above onload function will be called
    reader.readAsDataURL(file)
  })
}