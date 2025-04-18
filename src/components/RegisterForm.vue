<script setup>
import { ref } from 'vue'
import { format } from 'date-fns'
import { AuthService } from '@/services/auth.service'

const authService = new AuthService()

const birthDate = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const minDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 18)


/**
 * Handle form submission.
 *
 * @param {SubmitEvent} event - The submit event
 * @returns {Promise<void>} - A promise that resolves when the form is submitted
 * @throws {Error} - Throws an error if the form is invalid
 */
async function handleSubmit(event) {
  if (!form.checkValidity() || confirmPassword.value !== password.value) {
      return
    }

  event.preventDefault()
  try {
    const form = event.target
    await authService.register({
      birthDate: birthDate.value,
      email: email.value,
      password: password.value
    })
  } catch (error) {
    // TODO add a toast or something
    console.error(error.message)
  }
}

</script>

<template>
  <form @submit="handleSubmit" class="flex flex-col gap-4 max-w-md w-full mx-auto">
    <FloatLabel variant="on">
      <DatePicker id="birthDate" v-model="buttondisplay" showIcon fluid :showOnFocus="false" dateFormat="yyyy-mm-dd" :min="format(minDate, 'yyyy-MM-dd')" required/>
      <label for="birthDate">Date of birth</label>
    </FloatLabel>

      <FloatLabel variant="on">
        <InputText id="email" type="email" v-model="email" />
        <label for="email">Email</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Password id="password" v-model="password" toggleMask feedback="false" minlength="8" maxlength="255" required />
        <label for="password">Password</label>
      </FloatLabel>


    <FloatLabel variant="on">
    <Password v-model="confirmPassword" toggleMask :invalid="!confirmPassword || confirmPassword !== form.password" minlength="8"/>
      <label for="on_label">Confirm Password</label>
    </FloatLabel>

    <Button type="submit" label="Submit" />
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
