<script setup>
import 'chartjs-adapter-date-fns'
import Chart from 'primevue/chart'
import { computed } from 'vue'
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

/**
 * Checks if the actual and expected arrays
 * contains at least one entry each.
 *
 * @returns {boolean} - True if both arrays are not empty
 */
function allSet() {
  return actual.length > 0 && expected.length > 0
}

const chartData = computed(() => {
  if (!allSet()) {
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

const chartOptions = computed(() => {
  if (!allSet()) {
    console.warn('Chart skipped: actual or expected data missing')
    return {}
  }

  // Use first and last dates from actual or expected array for min and max
  const allDates = [...actual, ...expected].map(entry => new Date(entry.date)).sort((a, b) => a - b)
  const minDate = allDates[0].toISOString()
  const maxDate = allDates[allDates.length - 1].toISOString()

  return {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.y}kg`
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
        min: minDate,
        max: maxDate,
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
  }
})

/**
 * Dynamically calculates the chart container's width based on the number of days
 * between the first and last data point in the actual dataset.
 * Ensures a scrollable chart if needed.
 *
 * @returns {Object} - Style object with computed width
 */
const chartContainerStyle = computed(() => {
  if (!allSet()) {
    return {
      width: '100%',
      maxWidth: 'none',
      minWidth: '100%',
    }
  }
  const daysCount = differenceInCalendarDays(
    new Date(actual[actual.length - 1].date),
    new Date(actual[0].date),
  ) + 1
  const widthInRem = daysCount * 4

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
      <Chart v-if="chartData && Object.keys(chartOptions).length > 0" type="line" :data="chartData" :options="chartOptions" class="w-full h-[20rem]" />
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
