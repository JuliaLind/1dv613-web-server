<script setup>
import { ref, defineProps } from 'vue'
import foodService from '@/services/foodService'
import { createToastService } from '@/services/toast.service'
const toast = useToast()
const toastService = createToastService(toast)


const props = defineProps({
  ean: {
    type: String,
    required: true
  }
})

const food = ref(null)

onMounted(async () => {
  try {
    food.value = await foodService.show(props.ean)
  } catch (error) {
    toastService.alertError('Fetch error', error.message)
    console.error('Error fetching data:', error)
  }
})

const weight = ref(0)

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
    <Button label="Cancel" severity="secondary" size="small" @click="$emit('close')"/>
    <h2 class="text-xl font-bold text-slate-800 capitalize">{{ food.name }}, {{ food.brand }}</h2>
    <Button label="Add" size="small" @click="$emit('add-food')"/>
  </header>

  <footer class="flex justify-end mt-4">
    <Button
      class="p-button-text text-xl text-slate-800 primary-color"
      :aria-label="'Add food'"
      icon="pi pi-plus"
      @click="$emit('add-food')"
    />
  </div>
</footer>
</div>
</template>

<style scoped>

</style>