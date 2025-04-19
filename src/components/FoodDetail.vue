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
  }
})

const weight = ref(100)
const unit = ref('g')
const weightOptions = [{name: 'g', code: 'g'}]

function calcValue (value_100g, weight) {
  return Math.round(value_100g / 100 * weight)
}

const data = computed(() => {
  const rows = []
  rows.push({
    name: 'kcal',
    value: calcValue(food.value.kcal_100g, weight.value)
  })
  for (const nutrient of Object.keys(food.value.macros_100g)) {
      rows.push({
        // regex: find capital letter and replace it
        // with space + the found letter, globally.
        // then convert to lowercase
        // example saturatedFat -> saturated fat
        name: nutrient.replace(/([A-Z])/g, ' $1').toLowerCase(),
        value: calcValue(food.value.macros_100g[nutrient], weight.value)
      })
    }
  return rows
})

</script>

<template>
<div v-if="food" class="bg-white rounded-lg shadow-md p-4">
  <DataTable :value="data" class="p-datatable-sm text-xs">
  <Column field="name" header="Nutrient" />
  <Column field="value" header="Value" class="text-right"/>
  </DataTable>

  <footer class="flex justify-end mt-4">
    <div class="flex items-center justify-between gap-1">
      <InputNumber v-model="weight" inputId="minmax-buttons" mode="decimal" showButtons :min="0" :max="5000" fluid @input="e => weight = e.value"
      />
      <Select
        v-model="unit"
        :options="weightOptions"
        optionValue="code"
        optionLabel="name"
        placeholder="Select a meal"
        fluid
      />
      <Button label="Add" @click="$emit('add-food', {
        ...food,
        weight,
        unit
      })" />
    </div>
</footer>
</div>
</template>

<style scoped>

</style>