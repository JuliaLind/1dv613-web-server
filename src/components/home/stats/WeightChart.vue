<script setup>
import 'chartjs-adapter-date-fns'
import Chart from 'primevue/chart'
import { ref, computed } from 'vue'
import { differenceInCalendarDays } from 'date-fns'

const { actual, expected, chartTitle } = defineProps({
  actual: {
    type: Array,
    required: true
  },
  expected: {
    type: Array,
    required: true
  },
  chartTitle: {
    type: String,
    default: ''
  }
})


const chartData = computed(() => {
  if (!actual || !expected) {
    return null
  }

  return {
    labels: expected.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Actual Progress',
        data: actual.map(entry => ({ x: entry.date, y: entry.weight })),
        borderColor: '#42A5F5',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Expected Progress',
        data: expected.map(entry => ({ x: entry.date, y: entry.weight })),
        borderColor: '#FF7043',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        borderDash: [5, 5]
      }
    ]
  }
})

const chartOptions = ref({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${context.raw.y}kg`
        }
      }
    },
    title: {
      display: true,
      text: chartTitle,
      font: {
        size: 18,
      },
      padding: {
        bottom: 12,
      },
    }
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
        unitStepSize: 30,
        tooltipFormat: 'yyyy-MM-dd',
        displayFormats: {
          day: 'MMM d'
        }
      },
      title: {
        display: true,
        text: 'Date'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Weight (kg)'
      }
    }
  }
})

const chartContainerStyle = computed(() => {
  const daysCount = differenceInCalendarDays(
    new Date(actual[actual.length - 1].date),
    new Date(actual[0].date),
  ) + 1  // Add 1 to include the start date
  const widthInRem = daysCount * 4  // 0.5rem spacing between days

  return {
    width: `${widthInRem}rem`,
    maxWidth: 'none',
    minWidth: '100%',
  }
})

</script>


<template>
  <div class="scroll-container">
    <div class="chart-container" :style="chartContainerStyle">
      <Chart type="line" :data="chartData" :options="chartOptions" class="w-full h-[20rem]" />
      <!-- <Chart type="line" :data="chartData" :options="chartOptions" :class="'h-[20rem] w-[' +  chartWidth + 'rem]'" /> -->
    </div>
  </div>
</template>
<style scoped>
.scroll-container {
  overflow-x: auto;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  margin-top: 1.5rem;
}
</style>