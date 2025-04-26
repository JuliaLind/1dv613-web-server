<script setup>
import { computed } from 'vue'
import MealItem from '@/components/MealItem.vue'
import { nutrientsPerMeal } from '@/helpers/nutrients'
import { useMealStore } from '@/stores/meal.js'

const store = useMealStore()

const props = defineProps({
  type: {
    type: String,
    required: true
  },
})

const data = computed(() => {
  return store.meals[props.type]
})

const nutrients = computed(() => {
  return nutrientsPerMeal(data.value)
})


let name = props.type
if (name.startsWith('s')) {
  name = 'Snacks'
}

const emit = defineEmits(['delete', 'error', 'select'])

/**
 * Deletes a food item from the meal.
 *
 * @param {string} id - the id of the food item to delete
 */
async function delItem(id) {
  try {
    await store.delItem(id, props.type)
  } catch (error) {
    emit('error', error)
  }
}

</script>

<template>
  <div class="bg-white rounded-l shadow-md p-4">
    <header class="flex items-center justify-between">
      <h2 class="text-l font-bold capitalize">{{ name }}</h2>
      <span class="text-slate-500 font-bold text-m">{{ nutrients.kcal }} kcal</span>
    </header>
    <div class="flex flex-col gap-1 mt-2">
      <MealItem v-for="food in data.foodItems" :key="food.id" :mealId="data.id" :food="food"
        @delete="delItem(food.id)" />
    </div>
    <footer class=" flex justify-end">
      <Button class="p-button-text primary-color" :aria-label="'Add food'" icon="pi pi-plus" @click="$emit('select')" />
    </footer>
  </div>
</template>

<style scoped></style>