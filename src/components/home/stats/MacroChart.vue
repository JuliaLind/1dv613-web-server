<script setup>
import Chart from 'primevue/chart'
import { computed } from 'vue'
import { useDayStore } from '@/stores/day.store.js'
import { chartColors } from '@/config/colors'


const dayStore = useDayStore()


const macrosForChart = computed(() => {
  const macros = dayStore.getMacros()
  return {
    labels: ['Protein', 'Fat', 'Carbs', 'Fiber'],
    datasets: [
      {
        data: [macros.protein, macros.fat, macros.carbohydrates, macros.fiber],
        backgroundColor: [
          chartColors.primary,
          chartColors.red,
          chartColors.green,
          chartColors.lightBlue
        ]
      }
    ]
  }
})
</script>


<template>
    <div class="chart-container">
      <Chart type="pie" :data="macrosForChart" class="w-full md:w-[30rem]" />
    </div>
</template>

<style scoped>

.chart-container {
  width: 100%;
  max-width: 22rem;
}

</style>