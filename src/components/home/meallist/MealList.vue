<script setup>
import { ref } from 'vue'
import ProductList from '@/components/home/productlist/ProductList.vue'
import { useDayStore } from '@/stores/day.store.js'
import SingleMeal from '@/components/home/meallist/SingleMeal.vue'
import { Meal } from '@/models/Meal.js'


const dayStore = useDayStore()
const visible = ref(false)
const emit = defineEmits(['error'])


/**
 * Adds a food item to the selected meal.
 *
 * @param {object} food - the food item to add to the meal 
 */
async function addToSelected(food) {
  try {
    await dayStore.addToSelected(food)
  } catch (error) {
    emit('error', error)
  }
}


/**
 * Deletes a food item from the meal.
 *
 * @param {string} itemId - the id of the food item to delete
 * @param {string} mealType - the type of the meal
 */
async function delItem(itemId, mealType) {
  try {
    await dayStore.delItem(itemId, mealType)
  } catch (error) {
    emit('error', error)
  }
}

</script>

<template>
  <div v-if="dayStore.meals" id="meal-list">
    <SingleMeal v-for="type in Object.keys(Meal.TYPES)" :key="type" :type="type"
      @select="dayStore.selectMeal(type); visible = true" @delete="foodId => delItem(foodId, type)" />
  </div>
  <ProductList v-model:visible="visible" @add-food="addToSelected" />
</template>

<style scoped>
#meal-list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--space-m)/2);
}
</style>
