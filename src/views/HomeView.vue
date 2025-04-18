<script setup>
import { ref, onMounted } from 'vue'
import { addDays, subDays, format } from 'date-fns'
import { MealService } from '@/services/meal.service.js'
import MealList from '@/components/MealList.vue'

const mealService = new MealService()

const current = ref(new Date())
function next() {
  current.value = addDays(current.value, 1)
}

function prev() {
  current.value = subDays(current.value, 1)
}

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

    <MealList :date="format(current, 'yyyy-MM-dd')" />

  </main>
</template>
