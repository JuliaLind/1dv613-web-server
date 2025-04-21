<script setup>
import { defineProps } from 'vue'

defineProps({
  img: {
    type: String,
    required: false
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
  }
})



</script>

<template>
  <div class="w-full text-left flex flex-row gap-4">
    <img v-if="img" :src="img" :alt="name" class="w-16 h-16 object-cover rounded-lg mb-2" />
    <div class="flex flex-col gap-1 w-full">
      <span class="text-left w-full font-semibold text-slate-600 capitalize text-sm">
        {{ name }}, {{ brand ?? '' }}
      </span>
      <span class="text-left w-full text-slate-500 text-sm">
        {{ kcal_100g }} kcal per 100g
      </span>
    </div>
  </div>
</template>
