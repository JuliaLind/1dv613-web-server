<script setup>
import Chart from 'primevue/chart'
import { computed } from 'vue'
import { useDayStore } from '@/stores/day.store.js'
import { chartColors } from '@/config/colors'


const dayStore = useDayStore()

const macrosForChart = computed(() => {
  const macros = dayStore.getMacros()

  return {
    labels: ['Protein', 'Fat (excl saturated)', 'Saturated fat', 'Carbs (excl sugar)', 'Sugars', 'Fiber', 'Salts'],
    datasets: [
      {
        data: [macros.protein, macros.fat - macros.saturatedFat, macros.saturatedFat, macros.carbohydrates - macros.sugars, macros.sugars, macros.fiber, macros.salt],
        backgroundColor: [
          chartColors.green,     // Protein
          chartColors.red,         // Fat (excl saturated)
          chartColors.redLight,    // Saturated fat
          chartColors.blue,        // Carbs (excl sugar)
          chartColors.blueLight,   // Sugars
          chartColors.yellow,      // Fiber
          chartColors.orange       // Salt
        ]
      }
    ]
  }
})

function hasAnyMacros() {
  for (const value of macrosForChart.value.datasets[0].data) {
    if (value > 0) {
      return true
    }
  }
  return false
}
</script>




<template>
    <div v-if="hasAnyMacros()" class="chart-container">
      <Chart type="pie" :data="macrosForChart" class="w-full md:w-[30rem]" />
    </div>
</template>

<style scoped>

.chart-container {
  width: 100%;
  max-width: 22rem;
  border: 2px solid var(--primaray-500);
  border-radius: 0.5rem;
}

</style>