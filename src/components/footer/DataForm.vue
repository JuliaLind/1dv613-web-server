<script setup>
import { ref, computed, toRaw } from 'vue'
import { useUserStore } from '@/stores/user.store.js'
import { CalcService } from '@/services/calc.service'
import { useToast } from 'primevue/usetoast'
import { isFilled } from '@/helpers/validate'
import { handleError } from '@/helpers/helpers'
import { createToastService } from '@/services/toast.service'

const userStore = useUserStore()
const toast = useToast()
const toastService = createToastService(toast)
const form = ref({
  ...toRaw(userStore.user)
})

async function saveProfile(event) {
  event.preventDefault()

  // TODO add validation and toast
  const {
    height,
    currentWeight,
    targetWeight,
    activityLevel,
    weeklyChange,
    gender
  } = form.value

  if (!isFilled({ height, currentWeight, targetWeight, activityLevel, weeklyChange, gender })) {
    toastService.alertError('All fields are mandatory')
    return
  }

  try {
    await userStore.updUserData({
      height,
      currentWeight,
      targetWeight,
      activityLevel,
      weeklyChange,
      gender
    })
    toastService.alertSuccess('Profile updated', 'Your profile has been updated successfully')
  } catch (error) {
    handleError(error, toast)
  }
}

const dailyKcal = computed(() => {
  const { height, currentWeight, targetWeight, activityLevel, weeklyChange, gender } = form.value

  const age = userStore.age

  if (!isFilled({ weeklyChange, targetWeight, currentWeight })) {
    return '...calculating'
  }
  const maintenanceKcal = CalcService.maintenanceKcal(gender, age, height, currentWeight, activityLevel)

  return CalcService.dailyLimit(weeklyChange, targetWeight, currentWeight, maintenanceKcal)
})

const targetDate = computed(() => {
  const { weeklyChange, targetWeight, currentWeight } = form.value

  if (!isFilled({ weeklyChange, targetWeight, currentWeight })) {
    return '...calculating'
  }
  return CalcService.targetDate(weeklyChange, targetWeight, currentWeight)
})

</script>

<template>
  <form @submit.prevent="saveProfile"
    class="flex flex-col gap-6 p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md border-t-4 border-primary-300">
    <h2 class="text-xl font-semibold text-gray-800">User Profile</h2>

    <!-- Gender -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
      <div class="flex gap-4">
        <label v-for="option in CalcService.genderOptions" :key="option.value"
          class="inline-flex items-center gap-2 text-sm">
          <input type="radio" class="form-radio text-primary-600" name="gender" :value="option.value"
            v-model="form.gender" />
          <span class="capitalize">{{ option.descr }}</span>
        </label>
      </div>
    </div>

    <!-- Height & Current Weight -->
    <Fluid>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label for="height" class="text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <InputNumber v-model="form.height" id="height" inputId="height" suffix=" cm" :min="1" :step="1"
            class="w-full" />
        </div>

        <div class="flex flex-col">
          <label for="currentWeight" class="text-sm font-medium text-gray-700 mb-1">Current Weight (kg)</label>
          <InputNumber v-model="form.currentWeight" id="currentWeight" inputId="currentWeight" suffix=" kg" :min="1"
            class="w-full" />
        </div>
      </div>
    </Fluid>

    <!-- Activity Level -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
      <div class="flex flex-col gap-3">
        <label v-for="[key, value] in Object.entries(CalcService.activityLevelOptions)" :key="key"
          class="flex items-start gap-3 text-sm">
          <input type="radio" class="mt-1 form-radio text-primary-600" name="activityLevel" :value="key"
            v-model="form.activityLevel" />
          <div>
            <span class="font-medium">{{ value.name }}</span>
            <p class="text-gray-500 text-xs leading-relaxed">{{ value.description }}</p>
          </div>
        </label>
      </div>
    </div>

    <!-- Target Weight -->
    <div class="flex flex-col">
      <label for="targetWeight" class="text-sm font-medium text-gray-700 mb-1">Target Weight (kg)</label>
      <input id="targetWeight" type="number" min="40"
        class="form-input px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500"
        v-model="form.targetWeight" />
    </div>

    <!-- Weekly Change -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Weekly Change</label>
      <div class="flex flex-wrap gap-4">
        <label v-for="option in CalcService.changeOptions" :key="option.value"
          class="inline-flex items-center gap-2 text-sm">
          <input type="radio" class="form-radio text-primary-600" name="weeklyChange" :value="option.value"
            v-model="form.weeklyChange" />
          <span>{{ option.descr }}</span>
        </label>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Daily Kcal</label>
      <p class="text-lg font-semibold text-gray-800">{{ dailyKcal }}</p>
      <p class="text-sm text-gray-500">This is the amount of calories you should consume daily to reach your target
        weight.</p>
      <p class="text-sm text-gray-500">You will reach your goal on {{ targetDate }}.</p>
    </div>

    <!-- Save Button -->
    <Button type="submit" label="Save" size="large"
      class="mt-4 bg-primary-600 text-white text-base font-semibold py-3 rounded-xl hover:bg-primary-700 transition" />
  </form>
</template>


<style scoped></style>