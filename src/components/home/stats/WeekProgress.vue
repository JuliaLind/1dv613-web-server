<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user.store.js'
import WeightChart from '@/components/home/stats/WeightChart.vue'
import { differenceInCalendarDays } from 'date-fns'


const userStore = useUserStore()

const selectedDate = computed(() => {
  return new Date(userStore.selectedDate)
}) // end of the 7 day period

const oneWeekAgo = computed(() => {
  const date = new Date(userStore.selectedDate)
  date.setDate(date.getDate() - 7) // start of the 7 day period

  return date
})

/**
 * Returns the actual progress of the user in the last 7 days
 * @returns {Array} - An array of objects containing the date and weight, in chronological order earliest first
 */
function getActualProgress() {
  if (!userStore.isSet) {
    return []
  }

  const data = userStore.user.history
    .map(entry => ({
      date: new Date(entry.effectiveDate).getTime(),
      weight: entry.currentWeight
    }))
    .filter(entry => entry.date <= selectedDate.value.getTime() && entry.date >= oneWeekAgo.value.getTime())

  const reversedData = data.reverse()

  return reversedData
}

const actual = computed(() => {
  return getActualProgress()
})

/**
 * Calculates the expected weight by the end date,
 * based on initial weight and weekly change.
 * If the end date is before the start date, it returns the initial weight.
 *
 * @param {Date|string} endDate - The date to calculate the expected weight for
 * @returns {number} - The expected weight
 */
function calcExpWeight(endDate) {
  const firstEntry = userStore.user.history[userStore.user.history.length - 1]
  const startWeight = firstEntry.currentWeight
  const startDate = new Date(firstEntry.effectiveDate)
  const days = differenceInCalendarDays(endDate, startDate)
  if (days < 0) {
    return startWeight
  }
  const weightChange = userStore.user.weeklyChange / 7
  return startWeight - weightChange * days
}

/**
 * Returns the expected progress of the user in the last 7 days
 * @returns {Array} - An array of objects containing the date and weight, in chronological order earliest first
 */
function getExpectedProgress() {
  if (!userStore.isSet) {
    return []
  }


  const periodStartEntry = actual.value[0]
  if (!periodStartEntry) {
    return []
  }
  const periodStartDate = new Date(periodStartEntry.date)
  const periodStartWeight = calcExpWeight(periodStartDate)
  const periodEndWeight = calcExpWeight(selectedDate.value)
  const expected = [
    {
      date: periodStartDate.getTime(),
      weight: periodStartWeight
    },
    {
      date: selectedDate.value.getTime(),
      weight: periodEndWeight
    }
  ]


  return expected
}


</script>


<template>
  <WeightChart :actual="actual" :expected="getExpectedProgress()" :chartTitle="'Last 7 days'" />

</template>
<style scoped></style>