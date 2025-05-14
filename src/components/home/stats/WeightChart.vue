<script setup>
import 'chartjs-adapter-date-fns'
import Chart from 'primevue/chart'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user.store.js'
import { differenceInCalendarDays } from 'date-fns'


const userStore = useUserStore()

function getActualProgress() {
  const data = userStore.user.history.map(entry => ({
    date: new Date(entry.effectiveDate).getTime(),
    weight: entry.currentWeight
  }))
  const reversedData = data.reverse()

  return reversedData
}

function getFirstEntry(history) {
  return history[history.length - 1]
}

function getExpectedProgress() {
  const firstEntry = getFirstEntry(userStore.user.history)
  const currentEntry = userStore.historyEntry

  const expected = [
    {
      date: new Date(firstEntry.effectiveDate).getTime(),
      weight: firstEntry.currentWeight
    },
    {
      date: new Date().getTime(),
      weight: currentEntry.currentWeight
    },
    {
      date: new Date(userStore.targetDate).getTime(),
      weight: userStore.user.targetWeight
    }
  ]

  return expected
}

const chartData = computed(() => {
  if (!userStore.isSet) {
    return null
  }

  const actual = getActualProgress()
  const expected = getExpectedProgress()

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
    new Date(userStore.user.history[0].effectiveDate),
    new Date(getFirstEntry(userStore.user.history).effectiveDate),
  ) + 1  // Add 1 to include the start date
  const widthInRem = daysCount * 4  // 0.5rem spacing between days

  return {
    width: `${widthInRem}rem`, 
    maxWidth: 'none'
  }
})

// const chartWidth = computed(() => {
//   const daysCount = differenceInCalendarDays(
//     new Date(userStore.user.history[0].effectiveDate),
//     new Date(getFirstEntry(userStore.user.history).effectiveDate),
//   ) + 1  // Add 1 to include the start date
//   return daysCount * 0.5  // 0.5rem spacing between days
// })
</script>


<template>
  <div v-if="userStore.isSet" class="scroll-container">
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