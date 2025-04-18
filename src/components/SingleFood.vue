<script setup>
import { ref, defineProps, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FoodService }from '@/services/food.service'

import { createToastService } from '@/services/toast.service'
const toast = useToast()
const toastService = createToastService(toast)
const  foodService = new FoodService()

const props = defineProps({
  ean: {
    type: String,
    required: true
  }
})

const food = ref(null)

onMounted(async () => {
  try {
    food.value = await foodService.get(props.ean)
  } catch (error) {
    toastService.alertError('Fetch error', error.message)
    console.error('Error fetching data:', error)
  }
})

const weight = ref(0)
const weightUnit = ref('g')
const weightOptions = [{name: 'Gram', code: 'g'}]

function calcValue (value_100g, weight) {
  return value_100g / 100 * weight
}

const data = computed(() => {
  const calc = {}

  for (const nutrient of [
    'kcal', 'fat', ' carbohydrates', 'sugars', 'fiber', 'protein', 'salt'
  ]) {
    calc[nutrient] = calcValue(food.value[`${nutrient}_100g`], weight.value)
  }
  return calc
})

</script>

<template>
<div v-if="food" class="bg-white rounded-lg shadow-md p-6">
  <header class="flex items-center justify-between">
    <h2 class="text-l font-bold text-slate-800 capitalize">{{ food.name }}, {{ food.brand }}</h2>
  
    <Button label="Add" size="small" @click="$emit('add-food', weight, weightUnit)" />
  </header>
  <div class="flex flex-col gap-2 mt-4">
    <div class="flex items-center justify-between">
      <span class="text-slate-500 text-sm">Kcal</span>
      <span class="text-slate-800 text-xl font-bold">{{ data.kcal }} kcal</span>
    </div>
  </div>

  <footer class="flex justify-end mt-4">
    <div class="flex items-center justify-between">
      <InputNumber v-model="weight" inputId="minmax-buttons" mode="decimal" showButtons :min="0" :max="5000" fluid />
      <Select
        v-model="weightUnit"
        :options="weightOptions"
        optionValue="code"
        optionLabel="name"
        placeholder="Select a meal"
        class="w-full md:w-56" fluid
      />

    </div>
</footer>
</div>
</template>

<style scoped>

</style>