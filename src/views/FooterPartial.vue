<script setup>
import { useToast } from "primevue/usetoast"
import { AuthService } from "@/services/auth.service"
import { createToastService } from "@/services/toast.service"
import { useRouter } from "vue-router"
import { useUserStore } from '@/stores/user.store.js'
import { ref } from 'vue'
import DeleteForm from '@/components/footer/DeleteForm.vue'
import DataForm from '@/components/footer/DataForm.vue'
import Toolbar from 'primevue/toolbar'

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
  <!-- Keep tailwind classes for the Drawer component, for some reason does not work with corresponding vanilla css-->
  <Drawer id="profile" v-model:visible="visible" position="bottom" modal
    class="!h-[96vh] max-h-[96vh] max-w-[768px] rounded-t-2xl shadow-2xl">
    <template #header>
      <h2>Your Profile</h2>
    </template>
    <DataForm @close="visible = false" />
    <DeleteForm />
  </Drawer>
  <Toolbar id="bottom-nav">
    <template #start>
      <!-- Keep Primevue classes for the button -->
      <Button id="profile-btn" icon="pi pi-user" text class="p-button-text primary-color" @click="visible = true" />
    </template>

    <template #center>
    </template>

    <template #end>
      <!-- Keep Primevue classes for the button -->
      <Button id="signout-btn" icon="pi pi-sign-out" text @click="signout" class="p-button-text primary-color" />
    </template>
  </Toolbar>
</template>

<style scoped>
:root {
  --p-icon-size: 3rem;
}

h2 {
  font-size: var(--text-xl);
  font-weight: var(--bold);
  color: var(--grey-800);
}

.p-drawer-header {
  padding: var(--space-xs) !important;
}

#bottom-nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}
</style>
