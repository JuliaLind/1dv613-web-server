<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user.store.js'
import WeightChart from '@/components/home/stats/WeightChart.vue'
import { differenceInCalendarDays } from 'date-fns'




const userStore = useUserStore()

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

function getActualProgress() {
  if (!userStore.isSet) {
    return []
  }



  const data = userStore.user.history
  .map(entry => ({
    date: new Date(entry.effectiveDate).getTime(),
    weight: entry.currentWeight
  }))
  .filter(entry => entry.date >= oneWeekAgo.getTime())

  const reversedData = data.reverse()

  return reversedData
}

const actual = computed(() => {
  return getActualProgress()
})


function getExpectedProgress() {
  if (!userStore.isSet) {
    return []
  }

  const firstEntry = actual.value[0]

  const expWeightToday = firstEntry.weight - userStore.user.weeklyChange / 7 * differenceInCalendarDays(new Date(), new Date(firstEntry.date))

  const expected = [
    {
      date: (new Date(firstEntry.date)).getTime(),
      weight: firstEntry.weight
    },
    {
      date: (new Date()).getTime(),
      weight: expWeightToday
    }
  ]


  return expected
}


</script>


<template>
    <WeightChart :actual="actual" :expected="getExpectedProgress()" :chartTitle="'Last 7 days'"/>

</template>
<style scoped>
</style>