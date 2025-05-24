<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/auth.service'
import { useToast } from 'primevue/usetoast'
import { createToastService } from '@/services/toast.service'
import { validateMandatory } from '@/helpers/validate'

const authService = new AuthService()
const form = ref({
  email: '',
  password: ''
})

const toast = useToast()
const router = useRouter()
const toastService = createToastService(toast)

/**
 * Called when the user submits the login form.
 *
 * @param {SubmitEvent} event - The submit event 
 */
async function handleSubmit(event) {
  event.preventDefault()

  try {
    validateMandatory(form.value)
    await authService.login(form.value)
    router.push('/')
    toastService.alertSuccess('Welcome')
  } catch (error) {
    toastService.alertError('Login failed', error.message)
  }
}
</script>

<template>
  <form @submit="handleSubmit" class="flex flex-col gap-4 p-6 bg-white max-w-md w-full mx-auto">
    <Fluid>
      <div class="flex flex-col gap-2">
        <FloatLabel variant="on">
          <InputText id="email" v-model="form.email" required />
          <label for="email">Email</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Password inputId="password" v-model="form.password" toggleMask required maxlength="255" />
          <label for="password">Password</label>
        </FloatLabel>
      </div>
    </Fluid>

    <Button type="submit" class="btn-primary btn-lg" label="Login" size="large" />
  </form>

  <p>
    Don't have an account yet?
    <RouterLink to="/register" class="text-primary-color underline">
      Register here
    </RouterLink>

  </p>
</template>

<style scoped></style>
