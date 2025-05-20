/**
 * Module containing validation functions for user input.
 */

import validator from 'validator'

/**
 * Checks that the email address is valid.
 *
 * @param {string} email - the email address to validate 
 */
export function validateEmail(email) {
  if (!(validator.isEmail(email))) {
    throw new Error('Please fill in valid email')
  }
}

/**
 * Checks that the passwords matcb.
 *
 * @param {string} password - password
 * @param {string} confirmPassword  - confirm password
 */
export function matchPasswords(password, confirmPassword) {
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match')
  }
}

/**
 * The date must be earlier or equal to the min date.
 *
 * @param {Date|string} birthDate - the birth date to be validated
 * @param {Date|string} latestDate - the latest date to be considered valid
 */
export function validateBirthDate(birthDate, latestDate) {
  if (!birthDate || new Date(birthDate) > new Date(latestDate)) {
    console.log('birthDate', birthDate)
    console.log('latestDate', latestDate)
    throw new Error('You must be at least 18 years old to create an account')
  }
}

/**
 * Ensures that the password has at least 8 characters.
 *
 * @param {string} password - the password to be validated 
 */
export function validatePassword(password) {
  if (password.trim().length < 8) {
    throw new Error('Password must be at least 8 characters long')
  }
}

/**
 * Checks if all fields contain valid values.
 *
 * @param {object} fields - associative array of field names and values
 * @returns {boolean} true if all fields are filled, false otherwise
 */
export function isFilled(fields) {
  for (const key of Object.keys(fields)) {
    if ([undefined, null, ''].includes(fields[key])) {
      return false
    }
  }
  return true
}


/**
 * Checks that all mandatory fields are filled.
 * If a field is empty, an error is thrown.
 *
 * @param {object} fields - associative array of field names and values
 */
export function validateMandatory(fields) {
  if (!isFilled(fields)) {
    throw new Error(`Please fill in all mandatory fields`)
  }
}
