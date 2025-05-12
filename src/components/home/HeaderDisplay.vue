<script setup>
import { useDayStore } from '@/stores/day.store.js'
import { useUserStore } from '@/stores/user.store.js'


const dayStore = useDayStore()
const userStore = useUserStore()

</script>

<template>
  <div id="display">
    <Toolbar>
      <template #start>
      </template>

      <template #center>
        <span>
          weight: {{ userStore.weightOnSelectedDate ?? '?' }} kg
        </span>
      </template>

      <template #end>
        <span>{{ dayStore.kcal }} {{ userStore.isSet ? ' / ' + userStore.dailyLimit : ''
          }} kcal</span>
      </template>
    </Toolbar>
  </div>
</template>

<style scoped>
#display {
  padding-left: 1rem;
  padding-right: 1rem;

  font-size: var(--text-xs);
}
</style>
