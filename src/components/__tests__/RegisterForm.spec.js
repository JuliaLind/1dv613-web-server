import { describe, it, expect, vi, afterEach, beforeEach, afterAll } from 'vitest'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Fluid from 'primevue/fluid'

import RegisterForm from '../register/RegisterForm.vue'

vi.mock('@/services/auth.service.js', () => {
  return {
    AuthService: vi.fn().mockImplementation(() => {
      return {
        register: vi.fn().mockResolvedValue({ token: 'mock-token' })
      }
    })
  }
})

const alertSuccessMock = vi.fn()
const alertErrorMock = vi.fn()

vi.mock('@/services/toast.service.js', () => {
  return {
    createToastService: vi.fn(() => ({
      alertSuccess: alertSuccessMock,
      alertError: alertErrorMock
    }))
  }
})

describe('RegisterForm', () => {
  let router
  let wrapper
  let emailInput
  let passwordInput
  let confirmPasswordInput
  let birthDateInput
  let submitButton
  let authServiceInstance
  const email = 'julia@email.com'
  const password = 'password123'
  const birthDate = '1990-01-01'
  const minBirthDate = new Date()
    .setFullYear(new Date().getFullYear() - 18)

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div></div>' } },
        { path: '/login', component: { template: '<div></div>' } }]
    })

    vi.spyOn(router, 'push')

    wrapper = mount(RegisterForm, {
      global: {
        plugins: [router, PrimeVue, ToastService],
        components: {
          InputText,
          FloatLabel,
          Password,
          Button,
          Fluid
        },
        stubs: {
          RouterLink: true
        }
      }
    })

    await nextTick()

    authServiceInstance = wrapper.vm.authService

    emailInput = wrapper.findComponent({ name: 'InputText' })
    passwordInput = wrapper.find('#password')
    confirmPasswordInput = wrapper.find('#confirmPassword')
    birthDateInput = wrapper.find('#birthDate')
    submitButton = wrapper.find('button[type="submit"]')
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('ok, submits the register form successfully,redirects to login page with succsess message', async () => {
    await emailInput.setValue(email)
    await passwordInput.setValue(password)
    await confirmPasswordInput.setValue(password)
    await birthDateInput.setValue(birthDate)
    await submitButton.trigger('submit')

    expect(authServiceInstance.register).toHaveBeenCalledExactlyOnceWith({ birthDate, email, password })
    expect(alertSuccessMock).toHaveBeenCalledWith('Registration successful', 'Please log in')
    expect(router.push).toHaveBeenCalledWith('/login')
  })

  it('not ok, displays an error message when registration fails', async () => {
    const errorMsg = 'The email is already registered'
    authServiceInstance.register.mockRejectedValueOnce(new Error(errorMsg))

    await emailInput.setValue(email)
    await passwordInput.setValue(password)
    await confirmPasswordInput.setValue(password)
    await birthDateInput.setValue(birthDate)
    await submitButton.trigger('submit')

    expect(authServiceInstance.register).toHaveBeenCalledExactlyOnceWith({ birthDate, email, password })

    expect(alertErrorMock).toHaveBeenCalledWith('Registration failed', errorMsg)
    expect(router.push).not.toHaveBeenCalled()
  })

  const badCredentials = [
    {
      email: 'bad@email@lnu.com',
      password,
      confirmPassword: password,
      birthDate,
      reason: 'invalid email format'
    },
    {
      email,
      password: '',
      confirmPassword: password,
      birthDate,
      reason: 'password is empty'
    },
    {
      email,
      password,
      confirmPassword: '',
      birthDate,
      reason: 'confirm password is empty'
    },
    {
      email,
      password,
      confirmPassword: 'wrongpassword',
      birthDate,
      reason: 'passwords do not match'
    },
    {
      email,
      password,
      confirmPassword: password,
      birthDate: '',
      reason: 'birth date is empty'
    },
    {
      email,
      password,
      confirmPassword: password,
      birthDate: minBirthDate,
      reason: 'user is less than 18 years old',
    },
    {
      email: '',
      password,
      confirmPassword: password,
      birthDate,
      reason: 'email is empty'
    }
  ]

  for (const { email, password, confirmPassword, birthDate, reason } of badCredentials) {
    it(`not ok, displays an error message when ${reason}, register method should not be called`, async () => {
      await emailInput.setValue(email)
      await passwordInput.setValue(password)
      await confirmPasswordInput.setValue(confirmPassword)
      await birthDateInput.setValue(birthDate)
      await submitButton.trigger('submit')

      expect(alertErrorMock).toHaveBeenCalledWith('Registration failed', expect.any(String))
      expect(authServiceInstance.register).not.toHaveBeenCalled()
      expect(router.push).not.toHaveBeenCalled()
    })
  }
})
