<script setup>
import { ref } from 'vue'
import { authService } from '@/services/auth.service'


const form = ref({
  email: '',
  password: '',
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
  try {
    await authService.login(form.value)
  } catch (error) {
    // TODO add a toast or something
    console.error(error.message)
  }
}


</script>

<template>
  <form @submit="handleSubmit" class="login-form">
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
    <button type="submit">Log in</button>
    <p>
      Don't have an account? <a href="/register">Register</a>
    </p>
  </form>
</template>

<style scoped>

</style>
