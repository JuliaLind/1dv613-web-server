<script setup>
import { ref } from 'vue'
import { authService } from '@/services/auth.service'


const form = ref({
  username: '',
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
    <!-- <p>
      <a href="/forgot-password">Forgot Password?</a>
    </p>
    -->
  </form>
</template>

<style scoped>

</style>
