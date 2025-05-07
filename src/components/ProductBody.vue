<script setup>
import FoodDetail from '@/components/FoodDetail.vue'
import { Food } from '@/models/Food.js'


const { food } = defineProps({
  food: {
    type: Food,
    required: true
  }
})

</script>

<template>
  <FoodDetail :food="food" @done="foodInfo => $emit('add-food', foodInfo)" />
</template>

<style scoped></style>