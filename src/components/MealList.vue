<script setup>
import { defineProps } from 'vue'
import Meal from '@/components/SingleMeal.vue'


const props = defineProps({
  meals: {
    type: Object,
    required: true
  }
})


</script>

<template>
    <div id="meal-list" class="flex flex-col gap-4 mt-4">
      <Meal
        v-if="props.meals"
        v-for="(meal, type) in props.meals" 
        :key="type"
        :type="type"
        :foodItems="meal.foodItems"
        @add-food="$emit('add-food', type)"
        @delete="(foodId) => $emit('delete', { foodId, type })"
        @update="(food) => $emit('update', { food, type })"
      />
    </div>
</template>
