<script setup>
import { computed } from 'vue'
import MealItem from '@/components/home/meallist/MealItem.vue'
import { useDayStore } from '@/stores/day.store.js'
import { useUserStore } from '@/stores/user.store'

const dayStore = useDayStore()
const userStore = useUserStore()

const props = defineProps({
  type: {
    type: String,
    required: true
  },
})

/**
 * Calculates the kcalories left to distribute for remaining meals.
 *
 * @returns {number} - the kcalories left to distribute in the current day
 */
function kcalToDistribute() {
  return userStore.dailyLimit - dayStore.kcal
}


const meal = computed(() => {
  return dayStore.meals[props.type]
})

/**
 * Calculates suggested calories for the meal
 *
 * @returns {number} - the suggested calories for the meal
 */
function calcSuggestedKcal() {
  const suggested = Math.round(kcalToDistribute() * (meal.value.getDistribution() / dayStore.percentToDistr))
  return suggested > 0 ? suggested : 0
}

</script>

<template>
  <div class="meal" :id="type">
    <header>
      <h2>{{ meal.getName() }}</h2>
      <span class="meal-kcal">{{ meal.kcal }} kcal</span>
    </header>
    <div class="item-container">
      <MealItem v-for="food in meal.foodItems" :key="food.id" :mealId="meal.id" :food="food"
        @delete="$emit('delete', food.id)" />
      <div v-if="meal.isEmpty() && userStore.isSet" class="text-center text-grey-500">
        <p class="suggested">Suggested: {{ calcSuggestedKcal() }} kcal</p>
      </div>

    </div>
    <footer>
      <Button class="p-button-text primary-color add-food-btn" :aria-label="'Add food'" icon="pi pi-plus" @click="$emit('select')" />
    </footer>
  </div>
</template>

<style scoped>
.meal {
  background-color: var(--white);
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  box-shadow: 0 4px 6px -1px var(--light-shadow),
    0 2px 4px -2px var(--light-shadow);
  padding: 1rem;

}

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
  gap: 0.25rem;
  margin-top: 0.5rem;
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

.suggested {
  text-align: left;
  font-size: 1.125rem;
  color: var(--primary-700);
  font-weight: var(--medium);
  margin-top: 0.5rem;
  margin-left: 0.25rem;
}
</style>