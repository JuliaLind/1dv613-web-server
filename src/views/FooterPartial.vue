<script setup>
import { useToast } from "primevue/usetoast"
import { AuthService } from "@/services/auth.service"
import { createToastService } from "@/services/toast.service"
import { useRouter } from "vue-router"

const toast = useToast()
const toastService = createToastService(toast)
const authService = new AuthService()
const router = useRouter()

async function signout() {
  try {
    await authService.logout()
  } catch (error) {
    if (error.status !== 401) {
      toastService.alertError('Log out failed', error.message)
      return
    }
  }
  router.push('/login')
  toastService.alertSuccess('Logged out successfully', 'Bye!')
}
</script>

<template>
  <Toolbar class="w-full justify-between z-10">

    <template #start>
      <Button icon="pi pi-user" text class="p-button-text primary-color" />
    </template>

    <template #center>
    </template>

    <template #end>
      <Button icon="pi pi-sign-out" text @click="signout" class="p-button-text primary-color" />
    </template>
  </Toolbar>
</template>

<style scoped>
:root {
  --p-icon-size: 3rem;
}
</style>
