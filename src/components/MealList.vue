<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { addDays, subDays, format } from 'date-fns'
import Meal from '@/components/Meal.vue'
import FoodList from '@/components/FoodList.vue'
import { MealService } from '@/services/meal.service.js'

const props = defineProps({
  date: {
    type: String,
    required: false,
    default: () => []
  }
})

const mealService = new MealService()
const meals = ref({})


const fetchData = async () => {
  try {
    meals.value = await mealService.index(props.date)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Use onMounted to call fetchData after the component is mounted
onMounted(async () => {
  await fetchData()
})

const types = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3']

const current = ref(null)
const selectView = ref(false)

function addFood(type) {
  const meal = meals.value[type]
  if (meal) {
    current.value = {
      id: meal.id,
      foods: meal.foods,
    }
  } else {
    current.value = {
      type,
      date: props.date,
      foods: []
    }
  }
  selectView.value = true
}

function closeFoodList() {
  current.value = null
}

</script>

<template>
    <div v-show="!current" id="meal-list" class="flex flex-col gap-4 mt-4">
      <Meal
        v-for="type in types"
        :key="type"
        :id="meals.type?.id"
        :type="type"
        :foods="meals.type?.foods"
        @add-food="addFood(type)"
      />
    </div>
    <FoodList
      v-if="current"
      :foods="current.foods"
      @close="closeFoodList"
    />
</template>
