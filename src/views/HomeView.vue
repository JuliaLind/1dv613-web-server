<script setup>
import { ref, onMounted, computed } from 'vue'
import { format } from 'date-fns'
import { MealService } from '@/services/meal.service.js'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import MealList from '@/components/MealList.vue'

import DateChanger from '@/components/DateChanger.vue'
import { createToastService } from '@/services/toast.service'

import ProductList from '@/components/ProductList.vue'
import { weightedNutrients } from '@/helpers/nutrients'
import { fnWrapper } from '@/helpers/helpers'

const currentMeal = ref(null)
const currentDate = ref(format(new Date(), 'yyyy-MM-dd'))

const router = useRouter()
const toast = useToast()
const toastService = createToastService(toast)

const mealService = new MealService()
const meals = ref({})
const visible = ref(false)

function handleError(error) {
  if (error.status === 401) {
    router.push('/login')
    toastService.alertError('Session expired', 'Please login again')
    return
  }
  toastService.alertError('Something went wrong', 'Please try again later')
}

async function fetchMeals() {
  const data = await mealService.index(currentDate.value)
  meals.value = data
}

onMounted(async () => {
  await fnWrapper(fetchMeals, handleError)
})

/**
 * Selects the meal to add new food items to.
 *
 * @param {string} type - the type of meal, for example breakfast, lunch, snack2 
 */
function selectMeal(type) {
  currentMeal.value = meals.value[type]

  visible.value = true
}

async function newMeal (item, prelItem) {
  const temp = meals.value[currentMeal.value.type]
  const newMeal = {
      date: currentDate.value,
      type: currentMeal.value.type,
      foodItems: [item]
    }
    // optimistic update
    meals.value[currentMeal.value.type] = {
      ...newMeal,
      id: 'prel',
      foodItems: [prelItem]
    }
  try {
    const meal = await mealService.post(newMeal)
    currentMeal.value = meal
    meals.value[currentMeal.value.type] = meal
  } catch (error) {
    // reverse update if error
    meals.value[currentMeal.value.type] = temp
    handleError(error)
  }
}

async function addFoodItem (item, prelItem) {
  try {
    // optimistic update
    currentMeal.value.foodItems.push(prelItem)
    const newId = await mealService.addFoodItem(currentMeal.value.id, item)
    prelItem.id = newId
  } catch (error) {
    // reverse update if error
    currentMeal.value.foodItems.pop()
    handleError(error)
  }
}


async function setItem(food) {
  const item = {
    ean: food.ean,
    weight: food.weight,
    unit: food.unit
  }

  const prelItem = {
    ...food,
    id: 'prel'
  }

  if (!currentMeal.value.id) {
    await newMeal(item, prelItem)
  } else {
    await addFoodItem(item, prelItem)
  }
}

async function removeFoodItem({ foodId, type }) {
  const meal = meals.value[type]

  if (meal.foodItems.length === 1) {
    await mealService.del(meal.id)
    meals.value[type] = {
      id: null,
      type: type,
      foodItems: []
    }
    return
  }
  await mealService.delFoodItem(meal.id, foodId)

  meal.foodItems = meal.foodItems.filter((item) => item.id !== foodId)
}

async function updFoodItem({ food, type }) {
  const { id, weight, unit } = food
  const meal = meals.value[type]
  await mealService.updFoodItem(meal.id, { id, weight, unit })
  const foodItem = meal.foodItems.find((item) => item.id === id)
  foodItem.weight = weight
  foodItem.unit = unit
}

const data = computed(() => {
  let totals = {
    kcal: 0,
    protein: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    sugars: 0,
    fiber: 0,
    salt: 0
  }

  for (const meal of Object.values(meals.value)) {
    for (const foodItem of meal.foodItems) {
      const foodNutrients = weightedNutrients(foodItem.weight, {
        ...foodItem.macros_100g,
        kcal: foodItem.kcal_100g
      })
      Object.keys(totals).forEach(key => {
        totals[key] += foodNutrients[key] || 0
      })
    }
  }

  return totals
})

</script>

<template>
  <main>
    <DateChanger :date="currentDate"
      @update="(newDate) => { currentDate = newDate; fnWrapper(fetchMeals, handleError) }" />
    <Toolbar>
      <template #start>
      </template>

      <template #center>
      </template>

      <template #end>
        <span class="text-xs">{{ data.kcal }} kcal</span>
      </template>
    </Toolbar>

    <MealList :key="currentDate" :meals="meals" @add-food="selectMeal"
      @delete="(data) => fnWrapper(removeFoodItem, handleError, data)"
      @update="(data) => fnWrapper(updFoodItem, handleError, data)" />

    <ProductList v-model:visible="visible" :meal="currentMeal"
      @add-food="(data) => fnWrapper(setItem, handleError, data)" />
  </main>
</template>
