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
  img: {
    type: Object,
    required: false
  }
})


</script>

<template>
<Button
  variant="text"
  class="w-full text-left py-3 px-2 hover:bg-slate-50 transition-colors border-b border-slate-200 flex flex-row"
>
  <img
    v-if="props.img"
    :src="props.img"
    :alt="props.name"
    class="w-16 h-16 object-cover rounded-lg mb-2"
  />
  <div class="flex flex-col gap-1 w-full">
    <span class="text-left w-full font-semibold text-slate-800 capitalize">
      {{ props.name }}, {{ props.brand ?? '' }}
    </span>
    <span class="text-left w-full text-slate-500 text-sm">
      {{ props.kcal_100g }} kcal per 100g
    </span>
  </div>
</Button>
</template>

<style scoped>

</style>