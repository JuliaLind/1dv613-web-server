<script setup>
import { ref } from 'vue'
import { FoodService } from '@/services/foodService'

const foodService = new FoodService()
const items = ref([])
let page = 1

const fetchData = async () => {
  try {
    const data = await foodService.index(page)
    items.value = [...items.value, ...data]
    page++
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}



</script>

<template>

</template>

<style scoped>

</style>
