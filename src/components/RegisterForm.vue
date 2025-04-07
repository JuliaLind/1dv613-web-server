<script setup>
import { ref } from 'vue'
import { subYears, format } from 'date-fns'
import { authService } from '@/services/auth.service'


const form = ref({
  username: '',
  birthDate: '',
  email: '',
  password: '',
})
const confirmPassword = ref('')
const minBirthDate = subYears(new Date(), this.age)

/**
 * Validates the form inputs.
 */
function validateForm() {
  if (form.value.password !== confirmPassword.value) {
    throw new Error('Passwords do not match')
  }
}


/**
 * Handle form submission.
 *
 * @param {SubmitEvent} event - The submit event
 * @returns {Promise<void>} - A promise that resolves when the form is submitted
 * @throws {Error} - Throws an error if the form is invalid
 */
async function handleSubmit(event) {
  event.preventDefault()
  try {
    validateForm()

    await authService.register(form.value)
  } catch (error) {
    // TODO add a toast or something
    console.error(error.message)
  }
}


</script>

<template>
  <form @submit="handleSubmit" class="register-form">
    <label for="username">Username</label>
    <input
      type="text"
      id="username"
      v-model="form.username"
      placeholder="Enter your username"
      title="Username must start with a letter, followed by 2-29 alphanumeric characters, dashes, or underscores."
      required,
      maxlength="30"
      pattern="^[A-z][A-z0-9-_]{2,29}$"
    />
    <label for="birthDate">Birth Date</label>
    <input
      type="date"
      id="birthDate"
      :min="format(minBirthDate, 'yyyy-MM-dd')"
      v-model="form.birthDate"
      placeholder="Enter your birth date"
      title="You must be at least 18 years old to register."
      required
    />
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      v-model="form.email"
      placeholder="Enter your email"
      required
    />
    <label for="password">Password</label>
    <input
      type="password"
      id="password"
      v-model="form.password"
      placeholder="Enter your password"
      minlength="8"
      title="Password must be at least 8 characters long"
      maxlength="256"
      required
    />
    <label for="confirmPassword">Confirm Password</label>
    <input
      type="password"
      id="confirmPassword"
      v-model="confirmPassword"
      placeholder="Confirm your password"
      required
    />
    <button type="submit">Register</button>
    <p>
      Already have an account? <a href="/login">Login</a>
    </p>
    <p>
      By registering, you agree to our
      <a href="">Terms of Service</a> and
      <a href="">Privacy Policy</a>.
    </p>
  </form>
</template>

<style scoped>

</style>
