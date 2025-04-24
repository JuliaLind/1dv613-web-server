<script setup>
import { ref } from 'vue'
import ProductList from '@/components/ProductList.vue'
import { useMealStore } from '@/stores/meal.js'
import SingleMeal from '@/components/SingleMeal.vue'

const store = useMealStore()

const visible = ref(false)

const emit = defineEmits(['error'])

function handleError(error) {
  emit('error', error)
}


async function setItem(food) {
  try {
    await store.setItem(food)
  } catch (error) {
    handleError(error)
  }
}


/**
 * Selects the meal to add new food items to.
 *
 * @param {string} type - the type of meal, for example breakfast, lunch, snack2 
 */
function selectMeal(type) {
  store.selectMeal(type)
  visible.value = true
}

</script>

<template>
  <div v-if="store.meals" id="meal-list" class="flex flex-col gap-4 mt-4">
    <SingleMeal v-for="(meal, type) in store.meals" :key="type" :type="type" @select="selectMeal(type)"
      @delete="store.delMeal(type)" @error="handleError" />
  </div>
  <ProductList v-model:visible="visible" @add-food="setItem" />
</template>
