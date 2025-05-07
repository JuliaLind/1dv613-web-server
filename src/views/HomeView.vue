<script setup>
import { onMounted } from 'vue'

import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import MealList from '@/components/MealList.vue'

import DateChanger from '@/components/DateChanger.vue'
import { createToastService } from '@/services/toast.service'
import { tryCatch } from '@/helpers/helpers'
import { useDayStore } from '@/stores/day.store.js'
import FooterPartial from './FooterPartial.vue'


const store = useDayStore()
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
  await tryCatch(store.fetchMeals, handleError)
})

</script>

<template>
  <main class="grid-layout">
    <DateChanger :date="store.currentDate"
      @update="(newDate) => { store.setDate(newDate); tryCatch(store.fetchMeals, handleError) }" class="p-4" />
    <div class="pl-4 pr-4">
      <Toolbar>
        <template #start>
        </template>

        <template #center>
        </template>

        <template #end>
          <span class="text-xs">{{ store.kcal }} kcal</span>
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
