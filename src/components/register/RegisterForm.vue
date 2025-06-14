<script setup>
import { subYears, format } from 'date-fns'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { AuthService } from '@/services/auth.service'
import { createToastService } from '@/services/toast.service'
import {
  validateEmail, validatePassword, validateBirthDate,
  matchPasswords,
  validateMandatory
} from '@/helpers/validate'
import TermsAndConditions from '@/components/TermsAndConditions.vue'

const toast = useToast()
const authService = new AuthService()
const router = useRouter()
const toastService = createToastService(toast)

const today = new Date()
const latestDate = format(subYears(today, 18), 'yyyy-MM-dd')

const form = ref({
  birthDate: '',
  email: '',
  password: '',
  confirmPassword: ''
})


/**
 * Handle form submission.
 *
 * @param {SubmitEvent} event - The submit event
 * @returns {Promise<void>} - A promise that resolves when the form is submitted
 * @throws {Error} - Throws an error if the form is invalid
 */
async function handleSubmit(event) {
  event.preventDefault()

  const { birthDate, email, password, confirmPassword } = form.value

  try {
    validateMandatory({
      birthDate,
      email,
      password,
      confirmPassword
    })
    validateBirthDate(birthDate, latestDate)
    validateEmail(email)
    validatePassword(password)
    matchPasswords(password, confirmPassword)

    await authService.register({
      birthDate,
      email,
      password
    })

    toastService.alertSuccess('Registration successful', 'Please log in')
    router.push('/login')
  } catch (error) {
    toastService.alertError('Registration failed', error.message)
  }
}

const visible = ref(false)

</script>

<template>
  <form @submit="handleSubmit">
    <Fluid>
      <fieldset>
        <FloatLabel variant="on">
          <input type="date" required id="birthDate" class="p-filled p-inputtext p-inputtext-fluid" v-model="form.birthDate" />
          <label for="birthDate">Date of birth</label>
        </FloatLabel>


        <FloatLabel variant="on">
          <InputText id="email" type="email" v-model="form.email" required />
          <label for="email">Email</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Password inputId="password" v-model="form.password" toggleMask :minlength="8" :maxlength="255" required
            :feedback="false" />
          <label for="password">Password</label>
        </FloatLabel>


        <FloatLabel variant="on">
          <Password v-model="form.confirmPassword" required toggleMask inputId="confirmPassword" :feedback="false" />
          <label for="confirmPassword">Confirm Password</label>
        </FloatLabel>
      </fieldset>
    </Fluid>

    <Button type="submit" label="Submit" size="large" class="btn-primary btn-lg" />
    <p>
      Already have an account?
      <RouterLink to="/login" class="text-primary-color underline">
        Login
      </RouterLink>
    </p>
    <p>
      By registering, you agree to our
      <a href="" @click.prevent="visible = !visible">Terms & Conditions</a>.
      <Drawer id="terms-and-conditions" v-model:visible="visible" position="bottom" modal
        class="!h-[96vh] !h-[96dvh] !max-h-[96vh] !max-h-[96dvh] max-w-[768px] rounded-t-2xl shadow-2xl terms-container">
        <template #header>
          <h1>Terms and Conditions</h1>
        </template>
        <TermsAndConditions @close="visible = false" />
      </Drawer>

    </p>
  </form>

</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--white);
  max-width: var(--max-width);
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

#terms-and-conditions h1 {
  font-size: var(--text-xl);
  font-weight: var(--bold);
  color: var(--grey-800);
}

a {
  text-decoration: underline;
}

fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* input[type="date"] {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid var(--grey-300);
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

input[type="date"]:focus {
  border-color: var(--blue-500);
  outline: none;
  box-shadow: 0 0 0 3px var(--clear-blue);
} */
</style>
