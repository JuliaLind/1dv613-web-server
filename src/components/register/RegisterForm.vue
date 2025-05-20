<script setup>
import { subYears } from 'date-fns'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { AuthService } from '@/services/auth.service'
import { createToastService } from '@/services/toast.service'
import {
  validateEmail, validatePassword, validateBirthDate,
  matchPasswords
} from '@/helpers/validate'

const toast = useToast()
const authService = new AuthService()
const router = useRouter()
const toastService = createToastService(toast)

const today = new Date()
const minDate = subYears(today, 18)

const form = ref({
  birthDate: '',
  email: '',
  password: '',
  confirmPassword: ''
})


/**
 * Handle form submission.
 *
 * @param {SubmitEvent} event - The submit event
 * @returns {Promise<void>} - A promise that resolves when the form is submitted
 * @throws {Error} - Throws an error if the form is invalid
 */
async function handleSubmit(event) {
  event.preventDefault()

  const { birthDate, email, password, confirmPassword } = form.value

  try {
    validateBirthDate(birthDate, minDate)
    validateEmail(email)
    validatePassword(password)
    matchPasswords(password, confirmPassword)

    await authService.register({
      birthDate,
      email,
      password
    })

    toastService.alertSuccess('Registration successful', 'Please log in')
    router.push('/login')
  } catch (error) {
    toastService.alertError('Registration failed', error.message)
  }
}

</script>

<template>
  <form @submit="handleSubmit" class="flex flex-col gap-4 p-6 bg-white max-w-md w-full mx-auto">
    <Fluid>
      <div class="flex flex-col gap-2">
        <FloatLabel variant="on">
          <input type="date" required id="birthDate" v-model="form.birthDate"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-filled" />
          <label for="birthDate">Date of birth</label>
        </FloatLabel>


        <FloatLabel variant="on">
          <InputText id="email" type="email" v-model="form.email" required />
          <label for="email">Email</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Password inputId="password" v-model="form.password" toggleMask :minlength="8" :maxlength="255" required :feedback="false" />
          <label for="password">Password</label>
        </FloatLabel>


        <FloatLabel variant="on">
          <Password v-model="form.confirmPassword" required toggleMask inputId="confirmPassword" :feedback="false" />
          <label for="confirmPassword">Confirm Password</label>
        </FloatLabel>
      </div>
    </Fluid>

    <Button type="submit" label="Submit" size="large" class="btn-primary btn-lg" />
    <p>
      Already have an account?
      <RouterLink to="/login" class="text-primary-color underline">
        Login
      </RouterLink>
    </p>
    <!-- <p>
      By registering, you agree to our
      <a href="">Terms of Service</a> and
      <a href="">Privacy Policy</a>.
    </p> -->
  </form>
</template>

<style scoped></style>
