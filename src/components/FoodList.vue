<script setup>
import { ref, onMounted } from 'vue'
import { FoodService } from '@/services/foodService'

const props = defineProps({
  foods: {
    type: Array,
    required: false,
    default: () => []
  }
})


const foodService = new FoodService()
const counter = ref(props.foods.length)
const items = ref([])

const foods = props.foods.map((food) => {
  return {
    ean: food.ean,
    weight: food.weight,
    weight_unit: food.weight_unit,
  }
})

let page = 1

async function fetchData () {
  try {
    const data = await foodService.index(page)
    items.value = [...items.value, ...data]
    page++
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(async () => {
  await fetchData()
})

</script>

<template>
  <div class="flex flex-col gap-2 mt-4">
    <ListItem
      v-for="food in items"
      :key="food.ean"
      :ean="food.ean"
      :name="food.name"
      :brand="food.brand"
      :kcal_100g="food.kcal_100g"
      @add-food="(weight) => foods.push({ean: food.ean, weight, unit: 'g'}), counter++"
    />
  </div>
</template>

<style scoped>

</style>
