<script setup>
import { ref, onMounted } from 'vue'
import { FoodService } from '@/services/food.service'
import ListItem from '@/components/ListItem.vue'

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
    console.log(data)
    items.value = [...items.value, ...data.foodItems]
    page = data.page + 1
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(async () => {
  await fetchData()
})

</script>

<template>
  <div v-if="items" class="flex flex-col gap-2 mt-4">
    <ListItem
      v-for="food in items"
      :key="food.ean"
      :ean="food.ean"
      :name="food.name"
      :brand="food.brand"
      :kcal_100g="food.kcal_100g"
      :img="food.img.sm"
      @add-food="(weight) => foods.push({ean: food.ean, weight, unit: 'g'}), counter++"
    />
  </div>
</template>

<style scoped>

</style>
