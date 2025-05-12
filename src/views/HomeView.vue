<script setup>
import { onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import MealList from '@/components/home/meallist/MealList.vue'

import DateChanger from '@/components/home/DateChanger.vue'
import { createToastService } from '@/services/toast.service'
import { handleError } from '@/helpers/helpers'
import { useDayStore } from '@/stores/day.store.js'
import FooterPartial from './FooterPartial.vue'
import { useUserStore } from '@/stores/user.store.js'
import HeaderDisplay from '@/components/home/HeaderDisplay.vue'


const dayStore = useDayStore()
const userStore = useUserStore()
const toast = useToast()
const toastService = createToastService(toast)

async function fetchUserData() {
  try {
    await userStore.fetchUserData()
  } catch (error) {
    if (error.status === 404) {
      toastService.alertInfo('Complete your profile', 'Complete your profile to get a personalized experience')
      return
      // TODO should filling out the form be mandatory?
    }
    throw error
  }
}

async function init() {
  try {
    await dayStore.fetchMeals()
    await fetchUserData()
  } catch (error) {
    handleError(error, toast)
  }
}

async function changeDate(newDate) {
  try {
    dayStore.setDate(newDate)
    await dayStore.fetchMeals()
    userStore.setDate(newDate)
  } catch (error) {
    handleError(error, toast)
  }
}


onMounted(async () => {
  await init()
})

</script>

<template>
  <main class="grid-layout">
    <DateChanger :date="dayStore.selectedDate" @update="changeDate" />

    <HeaderDisplay />

    <div class="scroll-container">
      <MealList :key="dayStore.selectedDate" />
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
  padding: var(--space-m);
}
</style>
