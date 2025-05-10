<script setup>
import { Food } from '@/models/Food.js'

const props = defineProps({
  food: {
    type: Food,
    required: true,
  }
})

const food = props.food.clone()

</script>

<template>
  <div v-if="food" class="bg-white rounded-lg shadow-md p-4 mb-4">
    <header class="flex justify-end mt-1">
      <form class="flex items-center justify-between gap-1">
        <InputNumber v-model="food.weight" inputId="integeronly" id="weight" :min="0" :max="5000"
          @input="e => food.weight.value = e.value" fluid class="basis-full" />
        <Select v-model="food.unit" id="unit" :options="Food.UNITS" optionValue="code" optionLabel="name"
          @change="e => food.unit.value = e.value" class="basis-10" />
        <Button @click="$emit('done', food.toData())" class="basis-30" :aria-label="'Add'" icon="pi pi-check" fluid />
      </form>
    </header>

    <table class="mt-4 min-w-full text-xs text-left border border-gray-200 rounded shadow-sm overflow-hidden">
      <thead class="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
        <tr>
          <th class="px-4 py-2">Nutrient</th>
          <th class="px-4 py-2 text-right">Value</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="item in food.contents.value" :key="item.name">
          <td class="px-4 py-2 text-gray-800">{{ item.name }}</td>
          <td class="px-4 py-2 text-right text-gray-800">{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped></style>