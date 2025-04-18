<script setup>
import { defineProps } from 'vue'
import { ref } from 'vue'


const props = defineProps({
  ean: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: false
  },
  weight: {
    type: Number,
    required: true,
  },
  weight_unit: {
    type: String,
    required: true
  },
  kcal_100g: {
    type: Number,
    required: true
  },
})

const kcal = props.kcal_100g / 100 * props.weight

</script>

<template>
<div>
  <span class="text-2xl font-bold text-slate-800 capitalize">{{ props.name }}, {{ props.brand ?? '' }}</span>
  <span class="text-slate-500 text-sm">{{ props.weight }} {{ props.weight_unit }}</span>
  <span class="text-slate-500 text-sm">{{ kcal }} kcal</span>
</div>
</template>

<style scoped>

</style>