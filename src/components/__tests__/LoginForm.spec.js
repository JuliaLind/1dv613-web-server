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

import LoginForm from '../login/LoginForm.vue'

vi.mock('@/services/auth.service.js', () => {
  return {
    AuthService: vi.fn().mockImplementation(() => {
      return {
        login: vi.fn().mockResolvedValue({ token: 'mock-token' })
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

describe('LoginForm', () => {
  let router
  let wrapper
  let emailInput
  let passwordInput
  let submitButton
  let authServiceInstance
  const email = 'julia@email.com'
  const password = 'password123'

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: { template: '<div></div>' } }]
    })

    vi.spyOn(router, 'push')

    wrapper = mount(LoginForm, {
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
    submitButton = wrapper.find('button[type="submit"]')
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('ok, submits the login form successfully,redirects to home page with welcome message', async () => {
    await emailInput.setValue(email)
    await passwordInput.setValue(password)
    await submitButton.trigger('submit')

    expect(authServiceInstance.login).toHaveBeenCalledExactlyOnceWith({ email, password })
    expect(alertSuccessMock).toHaveBeenCalledWith('Welcome')
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('not ok, displays an error message when login fails', async () => {
    const errorMsg = 'Incorrect email or password'
    authServiceInstance.login.mockRejectedValueOnce(new Error(errorMsg))

    await emailInput.setValue(email)
    await passwordInput.setValue(password)
    await submitButton.trigger('submit')

    expect(authServiceInstance.login).toHaveBeenCalledExactlyOnceWith({ email, password })

    expect(alertErrorMock).toHaveBeenCalledWith('Login failed', errorMsg)
    expect(router.push).not.toHaveBeenCalled()
  })


  const badCredentials = [
    {
      email: 'julia@email.com',
      password: '',
      errorMessage: 'Please fill in all mandatory fields',
      reason: 'password is empty'
    },
    {
      email: '',
      password: 'password123',
      errorMessage: 'Please fill in all mandatory fields',
      reason: 'email is empty'
    }
  ]

  for (const { email, password, errorMessage, reason } of badCredentials) {
    it(`not ok, displays an error message when ${reason}, login method should not be called`, async () => {
      await emailInput.setValue(email)
      await passwordInput.setValue(password)
      await submitButton.trigger('submit')

      expect(alertErrorMock).toHaveBeenCalledWith('Login failed', errorMessage)
      expect(authServiceInstance.login).not.toHaveBeenCalled()
      expect(router.push).not.toHaveBeenCalled()
    })
  }
})
