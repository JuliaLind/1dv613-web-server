import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Password from 'primevue/password'
import Button from 'primevue/button'

import LoginForm from '../LoginForm.vue'

vi.mock('@/services/auth.service.js', () => {
  return {
    AuthService: vi.fn().mockImplementation(() => {
      return {
        login: vi.fn().mockResolvedValue({ token: 'mock-token' })
      }
    })
  }
})

describe('LoginForm', () => {
  let router

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: []
    })

  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('submits the login form successfully', async () => {
    const wrapper = mount(LoginForm, {
      global: {
        plugins: [router, PrimeVue, ToastService],
        components: {
          InputText,
          FloatLabel,
          Password,
          Button
        },
        stubs: {
          RouterLink: true
        }
      }
    })

    await nextTick()

    const emailInput = wrapper.findComponent({ name: 'InputText' })

    const passwordInput = wrapper.find('#password input')
    const submitButton = wrapper.find('button[type="submit"]')

    const email = 'julia@email.com'
    const password = 'password123'

    await emailInput.setValue(email)
    await passwordInput.setValue(password)

    await submitButton.trigger('submit')
    const authServiceInstance = wrapper.vm.authService

    expect(authServiceInstance.login).toHaveBeenCalledOnce()
    expect(authServiceInstance.login).toHaveBeenCalledWith({ email, password })
  })
})
