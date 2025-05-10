<script setup>
import { computed } from 'vue'
import MealItem from '@/components/home/meallist/MealItem.vue'
import { useDayStore } from '@/stores/day.store.js'

const store = useDayStore()

const props = defineProps({
  type: {
    type: String,
    required: true
  },
})

const meal = computed(() => {
  return store.meals[props.type]
})

</script>

<template>
  <div class="bg-white rounded-l shadow-md p-4">
    <header class="flex items-center justify-between">
      <h2 class="text-l font-bold capitalize">{{ meal.getName() }}</h2>
      <span class="text-slate-500 font-bold text-m">{{ meal.kcal }} kcal</span>
    </header>
    <div class="flex flex-col gap-1 mt-2">
      <MealItem v-for="food in meal.foodItems" :key="food.id" :mealId="meal.id" :food="food"
        @delete="$emit('delete', food.id)" />
    </div>
    <footer class=" flex justify-end">
      <Button class="p-button-text primary-color" :aria-label="'Add food'" icon="pi pi-plus" @click="$emit('select')" />
    </footer>
  </div>
</template>

<style scoped></style>