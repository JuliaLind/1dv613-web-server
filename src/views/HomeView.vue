<script setup>
import { ref, onMounted, computed } from 'vue'
import { addDays, subDays, format } from 'date-fns'
import { MealService } from '@/services/meal.service.js'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import MealList from '@/components/MealList.vue'
import FoodList from '@/components/FoodList.vue'
import { createToastService } from '@/services/toast.service'

const currentMeal = ref(null)
const currentDate = ref(new Date())
async function next() {
  currentDate.value = addDays(currentDate.value, 1)
  await fetchData()
}

async function prev() {
  currentDate.value = subDays(currentDate.value, 1)
  await fetchData()
}

const formattedDate = computed(() => {
  return format(currentDate.value, 'yyyy-MM-dd')
})


const router = useRouter()
const toast = useToast()
const toastService = createToastService(toast)

const mealService = new MealService()
const meals = ref({})



const fetchData = async () => {
  try {
    meals.value = await mealService.index(formattedDate.value)
    currentMeal.value = null
  } catch (error) {
    if (error.message === 'jwt expired') {
      toastService.alertError('Session expired', 'Please login again')
      router.push('/login')
      return
    }
    toastService.alertError('Something went wrong', 'Please try again later')
    console.error('Error fetching data:', error)
  }
}


onMounted(async () => {
  await fetchData()
})

function addFood(type) {
  const meal = meals.value[type]
  console.log(type, 'selected')
  if (meal) {
    currentMeal.value = {
      id: meal.id,
      foods: meal.foods,
    }
  } else {
    currentMeal.value = {
      type,
      date: currentDate.value,
      foods: []
    }
  }
}

function closeFoodList() {
  currentMeal.value = null
}

</script>

<template>
  <main>
    <div v-show="!currentMeal" id="date-picker" class="flex items-center justify-center gap-4">
      <Button
      @click="prev"
      class="p-button-text text-xl text-slate-800 primary-color primary-color-text"
      :aria-label="'Previous date'"
      icon="pi pi-chevron-left"
      
    />
      <span>{{ formattedDate }}</span>
      <Button
      @click="next"
      class="p-button-text text-xl text-slate-800 primary-color"
      :aria-label="'Next date'"
      icon="pi pi-chevron-right"
    />
    </div>

    <MealList v-show="!currentMeal" :key="currentDate" :meals="meals" @add-food="addFood"/>
    <FoodList
      v-if="currentMeal"
      :foods="currentMeal.foods"
      @close="closeFoodList"
    />
  </main>
</template>
