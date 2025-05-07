<script setup>
import { ref } from 'vue'
import ProductList from '@/components/ProductList.vue'
import { useDayStore } from '@/stores/day.store.js'
import SingleMeal from '@/components/SingleMeal.vue'
import { Meal } from '@/models/Meal.js'

const store = useDayStore()
const visible = ref(false)
const emit = defineEmits(['error'])

function handleError(error) {
  console.log(error)
  emit('error', error)
}

/**
 * Adds a food item to the selected meal.
 *
 * @param {object} food - the food item to add to the meal 
 */
async function addToSelected(food) {
  try {
    await store.addToSelected(food)
  } catch (error) {
    handleError(error)
  }
}


/**
 * Deletes a food item from the meal.
 *
 * @param {string} id - the id of the food item to delete
 * @param {string} type - the type of the meal
 */
async function delItem(id, type) {
  try {
    await store.delItem(id, type)
  } catch (error) {
    handleError(error)
  }
}


</script>

<template>
  <div v-if="store.meals" id="meal-list" class="flex flex-col gap-2">
    <SingleMeal v-for="type in Object.keys(Meal.TYPES)" :key="type" :type="type"
      @select="store.selectMeal(type); visible = true" @delete="foodId => delItem(foodId, type)"
      @error="$emit('error')" />
  </div>
  <ProductList v-model:visible="visible" @add-food="addToSelected" />
</template>
