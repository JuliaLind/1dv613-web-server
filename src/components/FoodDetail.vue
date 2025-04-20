<script setup>
import { ref, defineProps, onMounted, computed } from 'vue'

const { info } = defineProps({
  info: {
    type: Object,
    required: false,
  }
})

const food = ref(info)

const weightOptions = [{name: 'g', code: 'g'}]

function calcValue (value_100g, weight) {
  return Math.round(value_100g / 100 * weight)
}

const data = computed(() => {
  const rows = []
  rows.push({
    name: 'kcal',
    value: calcValue(food.value.kcal_100g, food.value.weight)
  })
  for (const nutrient of Object.keys(food.value.macros_100g)) {
      rows.push({
        // regex: find capital letter and replace it
        // with space + the found letter, globally.
        // then convert to lowercase
        // example saturatedFat -> saturated fat
        name: nutrient.replace(/([A-Z])/g, ' $1').toLowerCase(),
        value: calcValue(food.value.macros_100g[nutrient], food.value.weight)
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
      <InputNumber v-model="food.weight" inputId="integeronly" :min="0" :max="5000" @input="e => food.weight = e.value" fluid class="basis-full"
      />
      <Select
        v-model="food.unit"
        :options="weightOptions"
        optionValue="code"
        optionLabel="name"
        class="basis-10"
      />
      <Button @click="$emit('done', food)" class="basis-30"
      :aria-label="'Add'" icon="pi pi-check" fluid />

    </div>
</footer>
</div>
</template>

<style scoped>

</style>