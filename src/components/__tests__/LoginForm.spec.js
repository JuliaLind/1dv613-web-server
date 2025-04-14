import { describe, it, expect, vi, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'
import LoginForm from '../LoginForm.vue'
import { authService } from '@/services/auth.service'

describe('LoginForm', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('Submit login form, ok', () => {
    authService.login = vi.fn()
    const wrapper = mount(LoginForm)
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const submitButton = wrapper.find('button[type="submit"]')
    const email = 'julia@email.com'
    const password = 'password123'
    emailInput.setValue(email)
    passwordInput.setValue(password)
    submitButton.trigger('submit')
    expect(authService.login).toHaveBeenCalledExactlyOnceWith({ email, password })
  })
})
