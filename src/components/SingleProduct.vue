<script setup>
import { ref, defineProps, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import FoodDetail from '@/components/FoodDetail.vue'
import { FoodService }from '@/services/food.service'

import { createToastService } from '@/services/toast.service'
const toast = useToast()
const toastService = createToastService(toast)
const  foodService = new FoodService()

const { ean } = defineProps({
  ean: {
    type: String,
    required: true
  }
})

const food = ref(null)

onMounted(async () => {
  try {
    food.value = await foodService.get(ean)
    food.value.weight = 100
    food.value.unit = 'g'
  } catch (error) {
    toastService.alertError('Fetch error', error.message)
  }
})

</script>

<template>
<FoodDetail v-if="food"
  :info="food" @done="(foodInfo) => { $emit('add-food', foodInfo)}" />
</template>

<style scoped>

</style>