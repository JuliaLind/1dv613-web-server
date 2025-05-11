<script setup>
import { useDayStore } from '@/stores/day.store.js'
import { useUserStore } from '@/stores/user.store.js'


const dayStore = useDayStore()
const userStore = useUserStore()

</script>

<template>
  <div class="pl-4 pr-4">
    <Toolbar>
      <template #start>
      </template>

      <template #center>
        <span class="text-xs">
          weight: {{ userStore.weightOnSelectedDate ?? '?' }} kg
        </span>
      </template>

      <template #end>
        <span class="text-xs">{{ dayStore.kcal }} {{ userStore.isSet ? ' / ' + userStore.dailyLimit : ''
          }} kcal</span>
      </template>
    </Toolbar>
  </div>
</template>

<style scoped></style>
