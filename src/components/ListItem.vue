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
  kcal_100g: {
    type: Number,
    required: true
  },
})


</script>

<template>
<Button>
  <span class="text-2xl font-bold text-slate-800 capitalize">{{ props.name }}, {{ props.brand ?? '' }}</span>

  <span class="text-slate-500 text-sm">{{ props.kcal_100g }} kcal per 100g</span>
</Button variant="text" class="w-full text-left">
</template>

<style scoped>

</style>