<script setup>
import { useToast } from "primevue/usetoast"
import { AuthService } from "@/services/auth.service"
import { createToastService } from "@/services/toast.service"
import { useRouter } from "vue-router"
import { useUserStore } from '@/stores/user.store.js'
import { ref, computed } from 'vue'
import DeleteForm from '@/components/footer/DeleteForm.vue'
import DataForm from '@/components/footer/DataForm.vue'
import Toolbar from 'primevue/toolbar'
import { OverlayBadge } from "primevue"

const toast = useToast()
const toastService = createToastService(toast)
const authService = new AuthService()
const router = useRouter()
const userStore = useUserStore()


/**
 * Signs out the user and clears the user data from the state.
 */
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

const updatedToday = computed(() => {
  return userStore.isSet && (new Date(userStore.user.updatedAt)).getTime() <= (new Date()).getTime()
})

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
  <Toolbar id="bottom-nav" >
    <template #start>
      <!-- Keep Primevue classes for the button -->
      <div class="overlay-container">
      <Button id="profile-btn" icon="pi pi-user" aria-label="Open profile" class="p-button-text primary-color nav-btn" @click="visible = true" />
      <OverlayBadge v-if="!updatedToday" severity="warn"></OverlayBadge>
      </div>
    </template>

    <template #center>
    </template>

    <template #end>
      <!-- Keep Primevue classes for the button -->
      <Button id="signout-btn" aria-label="Sign out" icon="pi pi-sign-out" @click="signout" class="p-button-text primary-color nav-btn" />
    </template>
  </Toolbar>
</template>

<style scoped>
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

/* Styling for the overlay container */
.overlay-container {
  position: relative;
  padding: 1rem;
}

/* Styling for the badge */
.overlay-container .p-overlaybadge {
  position: absolute;
  top: 20px;
  right: 20px;
}

.p-toolbar {
  padding: 0 !important;
}
</style>
