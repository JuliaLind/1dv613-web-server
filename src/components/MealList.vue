<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Meal from '@/components/Meal.vue'
import FoodList from '@/components/FoodList.vue'
import { createToastService } from '@/services/toast.service'
import { MealService } from '@/services/meal.service.js'


const router = useRouter()
const toast = useToast()
const toastService = createToastService(toast)

const props = defineProps({
  meals: {
    type: Object,
    required: true
  }
})

const types = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3']


</script>

<template>
    <div id="meal-list" class="flex flex-col gap-4 mt-4">
      <Meal
        v-for="type in types"
        :key="type"
        :id="meals.type?.id"
        :type="type"
        :foods="meals.type?.foods"
        @add-food="$emit('add-food', type)"
      />
    </div>
</template>
