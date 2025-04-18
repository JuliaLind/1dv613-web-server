<script setup>
import { ref } from 'vue'
import { AuthService } from '@/services/auth.service'

const authService = new AuthService()
const email = ref('')
const password = ref('')


async function handleSubmit (event) {
  const form = event.target

  if (!form.checkValidity()) {
    return
  }

  event.preventDefault()
  try {
    await authService.login({
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
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 max-w-md w-full mx-auto">

      <FloatLabel variant="on">
        <InputText id="email" v-model="email" />
        <label for="email">Email</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Password id="password" v-model="password" toggleMask feedback="false" required maxlength="255"/>
        <label for="password">Password</label>
      </FloatLabel>
      <Message v-if="passwordError" severity="error" class="mt-1">{{ passwordError }}</Message>
      
    <Button type="submit" label="Login" />
  </form>
</template>

<style scoped>

</style>
