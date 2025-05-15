<script setup>
import { computed } from 'vue'
import { useDayStore } from '@/stores/day.store.js'
import { useUserStore } from '@/stores/user.store.js'
import { differenceInDays } from 'date-fns'


const dayStore = useDayStore()
const userStore = useUserStore()


const daysToGoal = computed(() => {
  if (!userStore.isSet) {
    return null
  }

  const days = differenceInDays(userStore.targetDate, dayStore.selectedDate)
  return days > 0 ? days : 0
})

const kcalClass = computed(() => {
  if (!userStore.isSet || dayStore.kcal <= userStore.dailyLimit) {
    return 'ok'
  }

  return 'not-ok'
})

const diffWeight = computed(() => {
  if (!userStore.isSet) {
    return null
  }

  const diff = userStore.historyEntry.currentWeight - userStore.user.targetWeight
  return diff > 0 ? diff.toFixed(1) : 0
})

</script>

<template>
  <div id="display" class="header-toolbar">
        <div class="summary-item circle days-circle" v-if="userStore.isSet">
          <div class="days-text">{{ daysToGoal }}</div>
          <p class="label days-label">days to goal</p>
        </div>

        <div class="summary-item circle kcal-circle">
          <div class="kcal-number">
            <span :class="kcalClass">{{ dayStore.kcal }}</span>
            <span class="daily-budget" v-if="userStore.isSet">/ {{ userStore.dailyLimit }}</span>
          </div>
          <p class="label kcal-label">kcal</p>
        </div>

        <div class="summary-item circle days-circle" v-if="userStore.isSet">
          <div class="days-text">{{ diffWeight }}</div>
          <p class="label days-label">kg to goal</p>
        </div>
  </div>
</template>

<style scoped>
.header-toolbar {
  background-color: var(--primary-100);
  color: var(--primary-600);
  padding: 0.5rem 1rem;
  box-shadow: var(--box-shadow);
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;
  height: fit-content;
  z-index: 5;
}

.circle {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: bold;
  flex-direction: column;
  width: 70px;
  height: 70px;
}

.days-circle {
  color: var(--primary-600);
  background: var(--primary-50);
  justify-content: flex-start;
}

.kcal-circle {
  background-color: #f0faff;
  color: var(--primary-600);
}

.daily-budget,
.days-label {
  text-wrap: nowrap;
  white-space: nowrap;
}

.days-text {
  font-size: var(--text-3xl);
  font-weight: var(--bolder);
}

.kcal-number {
  text-align: center;
}

.daily-budget {
  font-size: var(--text-base);
  position: relative;
  top: 0.5rem;
}

.kcal-number span:first-of-type {
  font-size: var(--text-3xl);
  font-weight: var(--bolder);
}

.label {
  font-size: var(--text-xs);
  text-align: center;

}

.days-label {
  margin-top: -0.5rem;
}

.kcal-label {
  font-size: var(--text-sm);
  color: var(--primary-700);
}
</style>