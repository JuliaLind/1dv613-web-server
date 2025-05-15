<script setup>
import { useUserStore } from '@/stores/user.store.js'
import WeightChart from '@/components/home/stats/WeightChart.vue'



const userStore = useUserStore()

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

function getFirstEntry(history) {
  return history[history.length - 1]
}

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