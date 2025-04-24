<script setup>
import { onMounted } from 'vue'

import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import MealList from '@/components/MealList.vue'

import DateChanger from '@/components/DateChanger.vue'
import { createToastService } from '@/services/toast.service'
import { fnWrapper } from '@/helpers/helpers'
import { useMealStore } from '@/stores/meal.js'

const store = useMealStore()
const router = useRouter()
const toast = useToast()
const toastService = createToastService(toast)


function handleError(error) {
  if (error.status === 401) {
    router.push('/login')
    toastService.alertError('Session expired', 'Please login again')
    return
  }
  toastService.alertError('Something went wrong', 'Please try again later')
}


onMounted(async () => {
  await fnWrapper(store.setMeals, handleError)
})

</script>

<template>
  <main>
    <DateChanger :date="store.currentDate"
      @update="(newDate) => { store.setDate(newDate); fnWrapper(store.setMeals, handleError) }" />
    <Toolbar>
      <template #start>
      </template>

      <template #center>
      </template>

      <template #end>
        <span class="text-xs">{{ store.data.kcal }} kcal</span>
      </template>
    </Toolbar>

    <MealList :key="store.currentDate" @error="handleError" />
  </main>
</template>
