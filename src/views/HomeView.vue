<script setup>
import { onMounted } from 'vue'

import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import MealList from '@/components/MealList.vue'

import DateChanger from '@/components/DateChanger.vue'
import { createToastService } from '@/services/toast.service'
import { fnWrapper } from '@/helpers/helpers'
import { useMealStore } from '@/stores/meal.js'
import FooterPartial from './FooterPartial.vue'

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
  <main class="grid-layout">
    <DateChanger :date="store.currentDate"
      @update="(newDate) => { store.setDate(newDate); fnWrapper(store.setMeals, handleError) }" class="p-4" />
    <div class="pl-4 pr-4">
      <Toolbar>
        <template #start>
        </template>

        <template #center>
        </template>

        <template #end>
          <span class="text-xs">{{ store.data.kcal }} kcal</span>
        </template>
      </Toolbar>
    </div>

    <div class="scroll-container p-4">

      <MealList :key="store.currentDate" @error="handleError" />
    </div>
    <FooterPartial />
  </main>
</template>

<style scoped>
.grid-layout {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  height: 100vh;
}

.scroll-container {
  overflow-y: auto;
  min-height: 0;
}
</style>
