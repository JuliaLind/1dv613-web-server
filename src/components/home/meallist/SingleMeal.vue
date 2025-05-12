<script setup>
import { computed } from 'vue'
import MealItem from '@/components/home/meallist/MealItem.vue'
import { useDayStore } from '@/stores/day.store.js'

const store = useDayStore()

const props = defineProps({
  type: {
    type: String,
    required: true
  },
})

const meal = computed(() => {
  return store.meals[props.type]
})

</script>

<template>
  <div class="bg-white rounded-l shadow-md p-4">
    <header>
      <h2>{{ meal.getName() }}</h2>
      <span class="meal-kcal">{{ meal.kcal }} kcal</span>
    </header>
    <div class="item-container">
      <MealItem v-for="food in meal.foodItems" :key="food.id" :mealId="meal.id" :food="food"
        @delete="$emit('delete', food.id)" />
    </div>
    <footer>
      <Button class="p-button-text primary-color" :aria-label="'Add food'" icon="pi pi-plus" @click="$emit('select')" />
    </footer>
  </div>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2 {
  font-size: var(--text-xl);
  font-weight: var(--bolder);
  text-transform: capitalize;
}

.item-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-top: calc(var(--space-m) / 2);
}

.meal-kcal {
  color: var(--grey-500);
  font-weight: var(--bolder);
  font-size: var(--text-base);
}

footer {
  display: flex;
  justify-content: flex-end;
}
</style>