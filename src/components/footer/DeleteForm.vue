<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store.js'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { createToastService } from '@/services/toast.service'
import { useConfirm } from "primevue/useconfirm"
import { isFilled} from '@/helpers/validate'

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
  if (!isFilled(form.value)) {
    toastService.alertError('Validation error', 'Please fill in email and password')
    return
  }

  confirm.require({
    target: event.currentTarget,
    message: 'Do you really want to delete your account? This action is irreversible.',
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
        toastService.alertSuccess('Account deleted', 'Your account has been deleted successfully')
      } catch (error) {
        toastService.alertError('Deletion failed', error.message)
      }
    },
    reject: () => {
      form.value = {
        email: '',
        password: ''
      }
      toastService.alertInfo('Cancelled', 'Wise choice, keep tracking your meals and you will reach your goals!')
    }
  })
}
</script>

<template>
  <ConfirmPopup></ConfirmPopup>

  <form id="delete-form">
    <span class="danger-zone">Danger zone</span>

    <h2>Delete Profile</h2>

    <p>
      This action is <span class="emphasize-danger">irreversible</span>.
      Your account with all of your data will be permanently deleted.
    </p>

    <p>
      To confirm deletion, please enter your email and password below.
    </p>

    <Fluid>
      <fieldset>
        <FloatLabel variant="on">
          <InputText id="email" v-model="form.email" />
          <label for="email">Email</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Password id="password" v-model="form.password" toggleMask required :feedback="false" maxlength="255" />
          <label for="password">Password</label>
        </FloatLabel>
      </fieldset>
    </Fluid>

    <Button @click.prevent="proceed" type="submit" label="Delete profile" size="large" severity="danger" class="btn-lg delete-btn" />
  </form>
</template>


<style scoped>

h2 {
  font-size: var(--text-xl);
  font-weight: var(--bolder);
  color: var(--grey-800);
}

.delete-btn {
  background: linear-gradient(to bottom, var(--red-500), var(--red-600));
}

/* .delete-btn {
  font-size: var(--text-base);
  font-weight: var(--bold);
  padding: calc(var(--space-std) / 2) var(--space-std);
  border-radius: var(--rounded);
  text-transform: uppercase;
} */

form {
  margin-top: var(--space-std);
  display: flex;
  flex-direction: column;
  gap: var(--space-std);
  padding: var(--space-std);
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
  background-color: var(--white);
  border-radius: var(--rounded-sm);
  box-shadow: var(--box-shadow);
  border-top: 4px solid var(--red-500);
}

fieldset {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

form p {
  font-size: var(--text-sm);
  color: var(--grey-600);
  line-height: 1.625;
}

.danger-zone {
  font-size: var(--text-xs);
  font-weight: var(--bold);
  text-transform: uppercase;
  color: var(--red-500);
  letter-spacing: 0.05em;
}

.emphasize-danger {
  font-weight: var(--bold);
  color: var(--red-600);
}

</style>