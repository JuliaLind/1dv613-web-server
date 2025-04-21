import PrimeVue from 'primevue/config'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'


import { mount } from '@vue/test-utils'
import LoginForm from '../LoginForm.vue'

import ToastService from 'primevue/toastservice'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Password from 'primevue/password'
import Button from 'primevue/button'



describe('LoginForm', async () => {
  const mockRouter = {
    push: vi.fn()
  }

  const router = createRouter({
    history: createWebHistory(),
    routes: [] // or mock routes
  })
  await router.isReady()

  beforeEach(() => {
    vi.mock('@/services/auth.service.js', () => {
      return {
        AuthService: vi.fn().mockImplementation(() => {
          return {
            login: vi.fn().mockResolvedValue({ token: 'mock-token' })
          }
        })
      }
    })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('Submit login form, ok', async () => {
    const wrapper = mount(LoginForm, {
      global: {
        mocks: {
          $router: mockRouter
        },
        plugins: [
          PrimeVue,
          ToastService
        ],
        components: {
          InputText,
          FloatLabel,
          Password,
          Button
        },
        stubs: { RouterLink: true }
      }
    })

    await nextTick()

    const emailInput = wrapper.find('#email input')

    const passwordInput = wrapper.find('#password input')
    const submitButton = wrapper.find('Button[type="submit"]')
    const email = 'julia@email.com'
    const password = 'password123'
    await emailInput.setValue(email)
    await passwordInput.setValue(password)
    submitButton.trigger('submit')

    const { AuthService } = await import('@/services/auth.service.js')
    expect(AuthService).toHaveBeenCalled()
    expect(AuthService.mock.instances[0].login).toHaveBeenCalledExactlyOnceWith({ email, password })

  })
})
