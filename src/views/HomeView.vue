<script setup>
import { ref, onMounted, computed } from 'vue'
import { addDays, subDays, format } from 'date-fns'
import { MealService } from '@/services/meal.service.js'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import MealList from '@/components/MealList.vue'
import { FoodService } from '@/services/food.service'

import { createToastService } from '@/services/toast.service'
import FoodDetail from '@/components/FoodDetail.vue'

const currentMeal = ref(null)
const currentDate = ref(new Date())

async function next() {
  currentDate.value = addDays(currentDate.value, 1)
  await fetchMeals()
}

async function prev() {
  currentDate.value = subDays(currentDate.value, 1)
  await fetchMeals()
}

const formattedDate = computed(() => {
  return format(currentDate.value, 'yyyy-MM-dd')
})
const weekday = computed(() => {
  return format(currentDate.value, 'EEEE')
})



const router = useRouter()
const toast = useToast()
const toastService = createToastService(toast)

const mealService = new MealService()
const meals = ref({})
const visible = ref(false)

async function fetchMeals() {
  try {
    const data = await mealService.index(formattedDate.value)
    meals.value = data
  } catch (error) {
    if (error.message === 'jwt expired') {
      toastService.alertError('Session expired', 'Please login again')
      router.push('/login')
      return
    }
    toastService.alertError('Something went wrong', 'Please try again later')
  }
}

const foodService = new FoodService()
let page = 1
const fetchMore = ref(true)
const products = ref([])
const query = ref('')

async function fetchProducts() {
  try {
    const data = await getUnfiltered()

    products.value = [...products.value, ...data]
  } catch (error) {
    toastService.alertError('Something went wrong', 'Please try again later')
  }
}

async function search() {
  try {
    const data = await getFiltered()
    products.value = [...products.value, ...data]
  } catch (error) {
    toastService.alertError('Something went wrong', 'Please try again later')
  }
}

async function getFiltered() {
  try {
    const data = await foodService.search(query.value, page)
    page = data.page + 1
    if (data.to === data.total || data.foodItems.length === 0) {
      fetchMore.value = false
    }
    return data.foodItems
  } catch (error) {
    toastService.alertError('Something went wrong', 'Please try again later')
  }
}

async function getUnfiltered() {
  try {
    const data = await foodService.index(page)

    page = data.page + 1

    if (data.to === data.total || data.foodItems.length === 0) {
      fetchMore.value = false
    }

    return data.foodItems
  } catch (error) {
    toastService.alertError('Something went wrong', 'Please try again later')
  }
}

async function loadMore() {
  if (query.value.length > 2) {
    await search()
  } else {
    await fetchProducts()
  }
}

async function onInput() {
  page = 1
  let data = []

  if (query.value.length > 0) {
    data = await getFiltered()
  } else if (query.value.length === 0) {
    data = await getUnfiltered()
  }
  products.value = data
}


onMounted(async () => {
  await fetchMeals()
  await fetchProducts()
})

function selectMeal(type) {
  currentMeal.value = meals.value[type]

  visible.value = true
}

async function setItem(food) {
  const item = {
    ean: food.ean,
    weight: food.weight,
    unit: food.unit
  }
  try {
    if (!currentMeal.value.id) {
      const meal = await mealService.post({
        date: formattedDate.value,
        type: currentMeal.value.type,
        foodItems: [item]
      })
      currentMeal.value = meal
      meals.value[currentMeal.value.type] = meal
    } else {
      const newId = await mealService.addFoodItem(currentMeal.value.id, item)
      food.id = newId

      currentMeal.value.foodItems.push(food)
    }
  } catch (error) {
    if (error.status === 401) {
      router.push('/login')
      toastService.alertError('Session expired', 'Please login again')
      return
    }
    toastService.alertError('Something went wrong', 'Please try again later')
    console.error('Error fetching data:', error)
  }
}

async function removeFoodItem({ foodId, type }) {
  try {
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
  } catch (error) {
    if (error.status === 401) {
      router.push('/login')
      toastService.alertError('Session expired', 'Please login again')
      return
    }
    toastService.alertError('Something went wrong', 'Please try again later')
    console.error('Error fetching data:', error)
  }

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
      totals.kcal += Math.round(foodItem.kcal_100g / 100 * foodItem.weight)
      for (const nutrient of Object.keys(totals)) {
        if (nutrient === 'kcal') {
          continue
        }
        totals[nutrient] += Math.round(foodItem.macros_100g[nutrient] / 100 * foodItem.weight)
      }
    }
  }

  return totals
})

</script>

<template>
  <main>
    <div id="date-picker" class="flex items-center justify-center gap-4">
      <Button @click="prev" class="p-button-text text-xl text-slate-800 primary-color primary-color-text"
        :aria-label="'Previous date'" icon="pi pi-chevron-left" />
      <span>{{ weekday }}</span>
      <span>{{ formattedDate }}</span>
      <Button @click="next" class="p-button-text text-xl text-slate-800 primary-color" :aria-label="'Next date'"
        icon="pi pi-chevron-right" />
    </div>
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
    @delete="removeFoodItem"/>



    <!-- Products list -->
    <Drawer v-model:visible="visible" position="right">
      <template #header>
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="query" placeholder="Search" @input="onInput" />
        </IconField>
      </template>
      <Accordion value="0">
        <AccordionPanel v-for="product in products" :key="product.ean" :value="product.ean">
          <AccordionHeader>
            <div class="w-full text-left flex flex-row gap-4">
              <img v-if="product.img.sm" :src="product.img.sm" :alt="product.name"
                class="w-16 h-16 object-cover rounded-lg mb-2" />
              <div class="flex flex-col gap-1 w-full">
                <span class="text-left w-full font-semibold text-slate-600 capitalize text-sm">
                  {{ product.name }}, {{ product.brand ?? '' }}
                </span>
                <span class="text-left w-full text-slate-500 text-sm">
                  {{ product.kcal_100g }} kcal per 100g
                </span>
              </div>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <FoodDetail :ean="product.ean" @add-food="setItem" />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
      <div class="flex justify-center">
        <Button label="Load more" @click="loadMore" text class="mt-1" />
      </div>
    </Drawer>

  </main>
</template>
