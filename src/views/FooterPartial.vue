<script setup>
import { useToast } from "primevue/usetoast"
import { AuthService } from "@/services/auth.service"
import { createToastService } from "@/services/toast.service"
import { useRouter } from "vue-router"
import UserProfile from '@/components/footer/UserProfile.vue'
import { useUserStore } from '@/stores/user.store.js'
// import { computed, ref } from 'vue'
import { ref } from 'vue'

const toast = useToast()
const toastService = createToastService(toast)
const authService = new AuthService()
const router = useRouter()
const userStore = useUserStore()


async function signout() {
  try {
    await authService.logout()
    await userStore.clearUserData()
  } catch (error) {
    if (error.status !== 401) {
      toastService.alertError('Log out failed', error.message)
    }
  }

  // sign out even if 401
  router.push('/login')
  toastService.alertSuccess('Logged out successfully', 'Bye!')
}

const visible = ref(false)


// TODO add badge to user profile icon if user data is not completed or weight has not been updated today
// const message = computed(() => {
//   if (!userStore.isSet) {
//     return 'Complete your profile to get a personalized experience'
//   }

//   if (!userStore.isUpdated) {
//     return 'Update your weight each day to get a more accurate target date'
//   }

//   return null
// })


</script>

<template>
  <Drawer v-model:visible="visible" position="bottom" modal
    class="!h-[96vh] max-h-[96vh] max-w-[768px] rounded-t-2xl shadow-2xl">
    <UserProfile @close="visible = false" />
  </Drawer>
  <Toolbar class="w-full justify-between z-10">

    <template #start>
      <Button icon="pi pi-user" text class="p-button-text primary-color" @click="visible = true" />
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
