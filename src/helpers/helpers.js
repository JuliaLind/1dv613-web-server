/**
 * Csalls and async function and handles the error
 * by calling the errorHandler function.
 *
 * @param {Function} fn - any async function
 * @param {array} args - arguments to be passed to the function
 * @param {Function} errorHandler - function to handle the error
 * @returns {Promise<any>} - the result of the function
 */
export async function fnWrapper(fn, errorHandler, ...args) {
  try {
    return await fn(...args)
  } catch (error) {
    errorHandler(error)
  }
}