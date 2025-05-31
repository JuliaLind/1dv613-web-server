import { describe, it, expect, vi, afterEach, afterAll } from 'vitest'
import { validateEmail, matchPasswords, validateBirthDate, validatePassword, validateMandatory } from '../validate.js'

vi.mock('validator', () => ({
  default: {
    isEmail: vi.fn(),
  }
}))

import validator from 'validator'

describe('validate module', () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('validateEmail', () => {
    const email = 'theemail'

    it('ok, should not throw error for valid email', () => {
      validator.isEmail.mockReturnValue(true)
      expect(() => validateEmail(email)).not.toThrow()
    })

    it('not ok, should throw error for invalid email', () => {
      validator.isEmail.mockReturnValue(false)
      expect(() => validateEmail(email)).toThrow('Please fill in valid email')
    })
  })

  describe('matchPasswords', () => {
    const password1 = 'password'
    const password2 = 'password'

    it('ok, should not throw error when passwords match', () => {
      expect(() => matchPasswords(password1, password2)).not.toThrow()
    })

    const badPasswords = [
      {
        password2: 'differentPassword',
        reason: 'Second password is different',
      },
      {
        password2: '',
        reason: 'Second password is empty',
      },
      {
        password2: null,
        reason: 'Second password is null',
      },
      {
        password2: undefined,
        reason: 'Second password is undefined',
      },
    ]

    for (const { password2, reason } of badPasswords) {
      it(`not ok, should throw error when passwords do not match: ${reason}`, () => {
        expect(() => matchPasswords(password1, password2)).toThrow('Passwords do not match')
      })
    }
  })

  describe('validateBirthDate, latest ok date is 2025-01-01', () => {
    const minDate = new Date('2005-01-01')

    const okBirthDates = [
      {
        birthDate: new Date('2005-01-01'),
        reason: 'Birth date 2025-01-01 is equal to latest date',
      },
      {
        birthDate: new Date('2004-12-31'),
        reason: 'Birth date 2004-12-31 is earlier than latest date',
      },
    ]
    for (const { birthDate, reason } of okBirthDates) {
      it(`ok, should not throw error when birth date is valid: ${reason}`, () => {
        expect(() => validateBirthDate(birthDate, minDate)).not.toThrow()
      })
    }

    const badBirthDates = [
      {
        birthDate: new Date('2005-01-02'),
        reason: 'Birth date is later than latest date',
      },
      {
        birthDate: undefined,
        reason: 'Birth date is undefined',
      },
      {
        birthDate: null,
        reason: 'Birth date is null',
      }
    ]

    for (const { birthDate, reason } of badBirthDates) {
      it(`not ok, should throw error when birth date is invalid: ${reason}`, () => {
        expect(() => validateBirthDate(birthDate, minDate)).toThrow('You must be at least 18 years old to create an account')
      })
    }
  })

  describe('validatePassword', () => {
    const okPassords = [
      {
        password: 'p'.repeat(8),
        reason: 'Password is 8 characters long',
      },
      {
        password: 'p'.repeat(9),
        reason: 'Password is 9 characters long',
      },
    ]

    for (const { password, reason } of okPassords) {
      it(`ok, should not throw error for valid password: ${reason}`, () => {
        expect(() => validatePassword(password)).not.toThrow()
      })
    }
    const badPasswords = [
      {
        password: 'p'.repeat(7),
        reason: 'Password is 7 characters long',
      },
      {
        password: '',
        reason: 'Password is empty',
      }
    ]

    for (const { password, reason } of badPasswords) {
      it(`not ok, should throw error for invalid password: ${reason}`, () => {
        expect(() => validatePassword(password)).toThrow('Password must be at least 8 characters long')
      })
    }
  })

  describe('validateMandatory', () => {
    const fields = {
      field1: 'value1',
      field2: 'value2',
    }

    it('ok, should not throw error when all fields are filled', () => {
      expect(() => validateMandatory(fields)).not.toThrow()
    })

    const badFields = [
      {
        field: 'field1',
        value: '',
        reason: 'Field is empty',
      },
      {
        field: 'field2',
        value: null,
        reason: 'Field is null',
      },
      {
        field: 'field3',
        value: undefined,
        reason: 'Field is undefined',
      },
    ]

    for (const { field, value, reason } of badFields) {
      it(`not ok, should throw error when mandatory field is not filled: ${reason}`, () => {
        const fieldsWithEmptyField = { ...fields, [field]: value }
        expect(() => validateMandatory(fieldsWithEmptyField)).toThrow(`Please fill in all mandatory fields`)
      })
    }
  })
})