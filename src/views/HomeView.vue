<script setup>
import { ref, onMounted } from 'vue'
import { addDays, subDays, format } from 'date-fns'
import Meal from '@/components/Meal.vue'
import { MealService } from '@/services/meal.service.js'

const mealService = new MealService()

const current = ref(new Date())
function next() {
  current.value = addDays(current.value, 1)
}

function prev() {
  current.value = subDays(current.value, 1)
}

const meals = ref({})


const fetchData = async () => {
  try {
    meals.value = await mealService.index(current.value)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Use onMounted to call fetchData after the component is mounted
onMounted(fetchData)

const types = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3']

</script>

<template>
  <main>
    <div id="date-picker" class="flex items-center justify-center gap-4">
      <Button
      @click="prev"
      class="p-button-text text-xl text-slate-800 primary-color primary-color-text"
      :aria-label="'Previous date'"
      icon="pi pi-chevron-left"
      
    />
      <span>{{ format(current, 'yyyy-MM-dd') }}</span>
      <Button
      @click="next"
      class="p-button-text text-xl text-slate-800 primary-color"
      :aria-label="'Next date'"
      icon="pi pi-chevron-right"
    />
    </div>

    <div class="flex flex-col gap-4 mt-4">
      <Meal
        v-for="type in types"
        :key="type"
        :id="meals.type?.id"
        :type="type"
        :foods="meals.type?.foods"
      />
    </div>
  </main>
</template>
