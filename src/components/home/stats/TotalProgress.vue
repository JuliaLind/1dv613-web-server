<script setup>
import { useUserStore } from '@/stores/user.store.js'
import WeightChart from '@/components/home/stats/WeightChart.vue'



const userStore = useUserStore()

/**
 * Returns the actual weight progress of the user.
 *
 * @returns {Array} - An array of objects containing the date and weight, in chronological order (earliest first)
 */
function getActualProgress() {
  if (!userStore.isSet) {
    return []
  }

  const data = userStore.user.history.map(entry => ({
    date: new Date(entry.effectiveDate).getTime(),
    weight: entry.currentWeight
  }))
  const reversedData = data.reverse()

  return reversedData
}

/**
 * Returns the first entry of the user's history,
 * which contains the start date and weight.
 *
 * @param {Array} history - the history of the user
 * @returns {Object} - the first entry of the history
 */
function getFirstEntry(history) {
  return history[history.length - 1]
}

/**
 * Returns the expected weight progress of the user.
 *
 * @returns {Array} - An array of objects containing the date and weight,
 * in chronological order (earliest first).
 * The first date is the intially registered date and weight, and the second date is the target date and weight.
 */
function getExpectedProgress() {
  if (!userStore.isSet) {
    return []
  }

  const firstEntry = getFirstEntry(userStore.user.history)

  const expected = [
    {
      date: new Date(firstEntry.effectiveDate).getTime(),
      weight: firstEntry.currentWeight
    },
    {
      date: new Date(userStore.targetDate).getTime(),
      weight: userStore.user.targetWeight
    }
  ]


  return expected
}


</script>


<template>
    <WeightChart :actual="getActualProgress()" :expected="getExpectedProgress()" :chartTitle="'As of start'"/>

</template>
<style scoped>
</style>