<script setup>
import { onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import MealList from '@/components/home/meallist/MealList.vue'

import DateChanger from '@/components/home/DateChanger.vue'
import { createToastService } from '@/services/toast.service'
import { handleError } from '@/helpers/helpers'
import { useDayStore } from '@/stores/day.store.js'
import FooterPartial from './FooterPartial.vue'
import { useUserStore } from '@/stores/user.store.js'
import HeaderDisplay from '@/components/home/HeaderDisplay.vue'

import MacroStats from '@/components/home/stats/StatsOverv.vue'


import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import TotalProgress from '@/components/home/stats/TotalProgress.vue'
import WeekProgress from '@/components/home/stats/WeekProgress.vue'


const dayStore = useDayStore()
const userStore = useUserStore()
const toast = useToast()
const toastService = createToastService(toast)


/**
 * Fetches user data from the server
 * If the user data is not found, it shows an alert to complete the profile
 */
async function fetchUserData() {
  await userStore.fetchUserData()
  if (!userStore.isSet) {
    toastService.alertInfo('Complete your profile', 'Complete your profile to get a personalized experience', {life: 5000})
    return
  }
  if ((new Date(userStore.user.updatedAt)).getTime() < (new Date()).getTime()) {
    toastService.alertInfo('Update your weight', 'Update your weight each day to get the most out of the app', {life: 5000})
  }
}

/**
 * Fetches the user data and the meals for the current date
 */
async function init() {
  try {
    await dayStore.fetchMeals()
    await fetchUserData()
  } catch (error) {
    handleError(error, toast)
  }
}

/**
 * Sets the new date and fetches the meals for that date
 *
 * @param {Date} newDate - The new date to set
 */
async function changeDate(newDate) {
  try {
    dayStore.setDate(newDate)
    userStore.setDate(newDate)
    await dayStore.fetchMeals() // 404 will not throw an error
  } catch (error) {
    handleError(error, toast)
  }
}

onMounted(async () => {
  await init()
})

</script>

<template>
  <main>
    <DateChanger :date="dayStore.selectedDate" @update="changeDate" />

    <Tabs value="0" class="tab-view">
      <TabList>
        <Tab value="0" id="log-tab">Log</Tab>
        <Tab value="1" id="stats-tab">Stats</Tab>
        <Tab value="2" id="progress-tab" v-if="userStore.isSet">Progress</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0" class="tab-content" id="log-view">
          <HeaderDisplay class="header" />
          <div>
            <MealList :key="dayStore.selectedDate" />
          </div>
        </TabPanel>

        <TabPanel value="1" class="tab-content" id="stats-view">
          <MacroStats />
        </TabPanel>

        <TabPanel value="2" class="tab-content" id="progress-view" v-if="userStore.isSet">
          <TotalProgress />
          <WeekProgress />
        </TabPanel>
      </TabPanels>
    </Tabs>

    <FooterPartial />
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh !important;
}

header {
  z-index: 10;
}


footer {
  z-index: 10;
  margin-top: auto;
}

.p-tabpanels {
  overflow-y: auto !important;
  position: relative;
  padding: 0;
}

.p-tablist-tab-list {
  padding: 0;
  margin: 0;
}

.p-tablist-tab-list button {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.tab-view {
  max-height: 100%;
  overflow: hidden;
}

.tab-view button {
  color: var(--primary-700) !important;
}

.header {
  position: sticky;
  top: 0;
}

.scroll-container {
  overflow-y: auto !important;
}
</style>