<script setup>
import { defineProps, computed } from 'vue'
import MealItem from '@/components/MealItem.vue'
import { weightedValue } from '@/helpers/nutrients'


const props = defineProps({
  id: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true
  },
  foodItems: {
    type: Array,
    required: false,
    default: () => []
  }
})

const kcal = computed(() => {
  let totalKcal = 0
  for (const food of props.foodItems) {
    totalKcal += weightedValue(food.weight, food.kcal_100g)
  }
  return totalKcal
})

let name = props.type
if (props.type.startsWith('s')) {
  name = 'Snacks'
}


</script>

<template>
  <div class="bg-white rounded-l shadow-md p-4">
    <header class="flex items-center justify-between">
      <h2 class="text-l font-bold capitalize">{{ name }}</h2>
      <span class="text-slate-500 font-bold text-m">{{ kcal }} kcal</span>
    </header>
    <div class="flex flex-col gap-1 mt-2">
      <MealItem v-for="food in foodItems" :key="food.id" :food="food" @delete="$emit('delete', food.id)"
        @update="$emit('update', food)" />
    </div>
    <footer class="flex justify-end">
      <Button class="p-button-text text-xl text-slate-800 primary-color" :aria-label="'Add food'" icon="pi pi-plus"
        @click="$emit('add-food')" />
    </footer>
  </div>
</template>

<style scoped></style>