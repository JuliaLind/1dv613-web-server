<script setup>
import { ref, defineProps, computed } from 'vue'
import { weightedValue } from '@/helpers/nutrients'

const { info } = defineProps({
  info: {
    type: Object,
    required: true,
  }
})

const food = ref(info)
const weightOptions = [{ name: 'g', code: 'g' }]


const data = computed(() => {
  const rows = []
  rows.push({
    name: 'kcal',
    value: weightedValue(food.value.weight, food.value.kcal_100g)
  })
  for (const nutrient of Object.keys(food.value.macros_100g)) {
    rows.push({
      // regex: find capital letter and replace it
      // with space + the found letter, globally.
      // then convert to lowercase
      // example saturatedFat -> saturated fat
      name: nutrient.replace(/([A-Z])/g, ' $1').toLowerCase(),
      value: weightedValue(food.value.weight, food.value.macros_100g[nutrient])
    })
  }
  return rows
})

</script>

<template>
  <div v-if="food" class="bg-white rounded-lg shadow-md p-4 mb-4">
    <DataTable :value="data" class="p-datatable-sm text-xs">
      <Column field="name" header="Nutrient" />
      <Column field="value" header="Value" class="text-right" />
    </DataTable>

    <footer class="flex justify-end mt-4">
      <div class="flex items-center justify-between gap-1">
        <InputNumber v-model="food.weight" inputId="integeronly" :min="0" :max="5000"
          @input="e => food.weight = e.value" fluid class="basis-full" />
        <Select v-model="food.unit" :options="weightOptions" optionValue="code" optionLabel="name" class="basis-10" />
        <Button @click="$emit('done', food)" class="basis-30" :aria-label="'Add'" icon="pi pi-check" fluid />

      </div>
    </footer>
  </div>
</template>

<style scoped></style>