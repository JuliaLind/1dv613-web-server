<script setup>
import { defineProps, computed } from 'vue'
import FoodDetail from '@/components/FoodDetail.vue'

const props = defineProps({
  food: {
    type: Object,
    required: true
  }
})

const food = computed(() => {
  return {
    ...props.food,
    weight: 100,
    unit: 'g'
  }
})


</script>

<template>
  <FoodDetail :info="food" @done="(foodInfo) => { $emit('add-food', foodInfo) }" />
</template>

<style scoped></style>