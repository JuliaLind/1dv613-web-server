<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store.js'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { createToastService } from '@/services/toast.service'
import { useConfirm } from "primevue/useconfirm"

const userStore = useUserStore()
const router = useRouter()
const toast = useToast()
const toastService = createToastService(toast)
const confirm = useConfirm()

const form = ref({
  email: '',
  password: '',
})

const proceed = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you really want to delete your profile? This action is irreversible.',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: async () => {
      try {
        await userStore.deleteProfile(form.value)
        router.push('/login')
        toastService.alertSuccess('Profile deleted', 'Your profile has been deleted successfully')
      } catch (error) {
        toastService.alertError('Deletion failed', error.message)
      }
    },
    reject: () => {
      toastService.alertInfo('Cancelled', 'Wise choice, keep tracking your meals and you will reach your goals!')
    }
  })
}


</script>

<template>
  <ConfirmPopup></ConfirmPopup>

  <form class="flex flex-col gap-6 p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md border-t-4 border-red-500 mt-10">
    <span class="text-xs font-semibold uppercase text-red-500 tracking-wide">Danger zone</span>

    <h2 class="text-xl font-bold text-gray-800">Delete Profile</h2>

    <p class="text-sm text-gray-600 leading-relaxed">
      This action is <span class="font-semibold text-red-600">irreversible</span>.
      All your data will be permanently deleted.
    </p>

    <p class="text-sm text-gray-600 leading-relaxed">
      To confirm deletion, please enter your email and password below.
    </p>

    <Fluid>
      <div class="flex flex-col gap-4">
        <FloatLabel variant="on">
          <InputText id="email" v-model="form.email" />
          <label for="email">Email</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Password id="password" v-model="form.password" toggleMask required maxlength="255" />
          <label for="password">Password</label>
        </FloatLabel>
      </div>
    </Fluid>

    <Button @click.prevent="proceed" type="submit" label="Delete profile" size="large" severity="danger"
      class="text-base font-semibold tracking-wide px-6 py-3" />
  </form>
</template>


<style scoped></style>