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
 * @param {Date} birthDate - the birth date to be validated
 * @param {Date} minDate - the min date to be considered valid
 */
export function validateBirthDate(birthDate, minDate) {
  console.log('birthDate', birthDate)
  console.log('minDate', minDate)
  if (!birthDate || birthDate > minDate) {
    throw new Error('You must be at least 18 years old to create an account')
  }
}

/**
 * Ensures that the password has at least 8 characters.
 *
 * @param {string} password - the password to be validated 
 */
export function validatePassword(password) {
  if (!password || password.length < 8) {
    throw new Error('Validation error', 'Password must be at least 8 characters long')
  }
}


/**
 * Checks that all mandatory fields are filled.
 * If a field is empty, an error is thrown.
 *
 * @param {object} fields - associative array of field names and values
 */
export function validateMandatory(fields) {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      throw new Error(`Validation error: ${key} is required`)
    }
  }
}
