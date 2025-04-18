<script setup>
import { ref, defineProps } from 'vue'
import MealItem from '@/components/MealItem.vue'
import title from 'title'

const props = defineProps({
  id: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true
  },
  foods: {
    type: Array,
    required: false,
    default: () => []
  }
})

const kcal = ref(0)

for (const food of props.foods) {
  kcal.value += (food.kcal_100g / 100 * food.weight)
}

// let name = title(props.type)
let name = props.type
if (props.type.startsWith('snack')) {
  name = 'Snacks'
}


</script>

<template>
<div>
  <header class="flex items-center justify-between">
    <h2 class="text-2xl font-bold text-slate-800 capitalize">{{ name }}</h2>
    <span class="text-slate-500 text-sm">{{ kcal }} kcal</span>
  </header>
  <div class="flex flex-col gap-2 mt-4">
    <MealItem
      v-for="food in props.foods"
      :key="food.ean"
      :ean="food.ean"
      :name="food.name"
      :brand="food.brand"
      :weight="food.weight"
      :weight_unit="food.weight_unit"
      :kcal_100g="food.kcal_100g"
    />
  </div>
  <footer class="flex items-center justify-between mt-4">
    <Button
      class="p-button-text text-xl text-slate-800 primary-color"
      :aria-label="'Add food'"
      icon="pi pi-plus"
    />
</footer>
</div>
</template>

<style scoped>

</style>