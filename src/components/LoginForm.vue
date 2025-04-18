<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/auth.service'
import { useToast } from 'primevue/usetoast'
import { createToastService } from '@/services/toast.service'

const authService = new AuthService()
const email = ref('')
const password = ref('')
const toast = useToast()
const router = useRouter()
const toastService = createToastService(toast)

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
    toastService.alertSuccess('Welcome')
    router.push('/')
  } catch (error) {
    toastService.alertError('Login failed', error.message)
    console.error(error.message)
  }
}



</script>

<template>
  <form @submit="handleSubmit" class="flex flex-col gap-4 p-6 bg-white max-w-md w-full mx-auto">

      <FloatLabel variant="on" >
        <InputText id="email" v-model="email" />
        <label for="email">Email</label>
      </FloatLabel>

      <FloatLabel variant="on" >
        <Password id="password" v-model="password" toggleMask  required maxlength="255" />
        <label for="password">Password</label>
      </FloatLabel>
      
    <Button type="submit" label="Login" size="large" />
    </form>

    <p>
      Don't have an account yet? 
      <RouterLink to="/register" class="text-primary-color underline">
        Register here
        </RouterLink>

    </p>
</template>

<style scoped>

</style>
