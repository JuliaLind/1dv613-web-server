<script setup>
import { ref, computed, toRaw } from 'vue'
import { useUserStore } from '@/stores/user.store.js'
import { CalcService } from '@/services/calc.service'
import { useToast } from 'primevue/usetoast'
import { isFilled } from '@/helpers/validate'
import { handleError } from '@/helpers/helpers'
import { createToastService } from '@/services/toast.service'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'

const userStore = useUserStore()
const toast = useToast()
const toastService = createToastService(toast)
const form = ref({
  ...toRaw(userStore.user)
})

const emit = defineEmits(['close'])

/**
 * Saves the entered user profile data to the database.
 *
 * @param {SubmitEvent} event - submit event
 */
async function saveProfile(event) {
  event.preventDefault()

  const {
    height,
    currentWeight,
    targetWeight,
    activityLevel,
    weeklyChange,
    gender
  } = form.value

  if (!isFilled({ gender, height, currentWeight, targetWeight, activityLevel, weeklyChange })) {
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

    emit('close')
    toastService.alertSuccess('Profile updated', 'Your profile has been updated successfully')
  } catch (error) {
    handleError(error, toast)
  }
}

/**
 * Preliminary calculation of daily calorie intake.
 */
const dailyKcal = computed(() => {
  const { height, currentWeight, targetWeight, activityLevel, weeklyChange, gender } = form.value
  const age = userStore.age

  if (!isFilled({ weeklyChange, targetWeight, currentWeight })) {
    return '...'
  }
  const maintenanceKcal = CalcService.maintenanceKcal(gender, age, height, currentWeight, activityLevel)

  return CalcService.dailyLimit(weeklyChange, targetWeight, currentWeight, maintenanceKcal)
})

/**
 * Preliminary calculation of the date when user
 * is expected to reach the target weight.
 */
const targetDate = computed(() => {
  const { weeklyChange, targetWeight, currentWeight } = form.value

  if (!isFilled({ weeklyChange, targetWeight, currentWeight })) {
    return '...'
  }
  return CalcService.targetDate(weeklyChange, targetWeight, currentWeight)
})

</script>

<template>
  <form @submit.prevent="saveProfile">
    <Stepper value="1">
      <StepList>
        <Step value="1"></Step>
        <Step value="2"></Step>
        <Step value="3"></Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="1">
          <fieldset class="form-group static-data">
            <!-- Gender -->
            <div>
              <label>Gender</label>
              <div id="gender-container">
                <label v-for="option in CalcService.genderOptions" :key="option.value" class="for-option">
                  <input type="radio" name="gender" :value="option.value" v-model="form.gender" />
                  <span class="capitalize">{{ option.descr }}</span>
                </label>
              </div>
            </div>

            <!-- Height & Current Weight -->
            <Fluid>
              <div id="height-weight-container">
                <div class="flex-col">
                  <label for="height">Height (cm)</label>
                  <InputNumber v-model="form.height" id="height" inputId="height" suffix=" cm" :maxFractionDigits="1"
                    class="w-full" />
                </div>

                <div class="flex-col">
                  <label for="current-weight">Current Weight (kg)</label>
                  <InputNumber v-model="form.currentWeight" id="current-weight" inputId="current-weight" suffix=" kg"
                    :min="1" class="w-full" :maxFractionDigits="1" />
                </div>
              </div>
            </Fluid>
            <!-- Target Weight -->
            <div class="flex-col">
              <label for="target-weight">Target Weight (kg)</label>
              <InputNumber v-model="form.targetWeight" id="target-weight" inputId="target-weight" suffix=" kg" :min="40"
                :maxFractionDigits="1" class="w-full" />
            </div>
          </fieldset>
          <div class="right btn-container">
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" data-id="next-step-1" @click="activateCallback('2')" />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
          <fieldset class="form-group dynamic-data">
            <!-- Activity Level -->
            <div>
              <label>Activity Level</label>
              <div id="activity-level-container">
                <label v-for="[key, value] in Object.entries(CalcService.activityLevelOptions)" :key="key"
                  class="multiple">
                  <input type="radio" class=".stacked" name="activityLevel" :value="key" v-model="form.activityLevel" />
                  <div>
                    <span class="option-name">{{ value.name }}</span>
                    <p class="option-descr">{{ value.description }}</p>
                  </div>
                </label>
              </div>
            </div>
            <!-- Weekly Change -->
            <div>
              <label>Weekly Change</label>
              <div id="weekly-change-container">
                <label v-for="option in CalcService.changeOptions" :key="option.value" class="for-option">
                  <input type="radio" name="weeklyChange" :value="option.value" v-model="form.weeklyChange" />
                  <span>{{ option.descr }}</span>
                </label>
              </div>
            </div>
          </fieldset>

          <div class="right left btn-container">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" data-id="prev-step-2" @click="activateCallback('1')" />
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')" data-id="next-step-2" />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="3">
          <div class="daily-info-container">
            <div class="daily-kcal-container">
              <p class="label">Daily Kcal</p>
              <div class="kcal-display">
                <p class="kcal">{{ dailyKcal }}</p>
              </div>
              <p class="text-sm text-gray-500">This is the amount of calories you should consume daily to reach your
                target
                weight.</p>
            </div>
            <div class="target-date-container">
              <p class="text-sm text-gray-500">You will reach your goal on</p>
              <p class="target-date">{{ targetDate }}</p>
            </div>
            <!-- Save Button -->
            <Button class="btn" type="submit" label="Save" size="large" />
          </div>
          <div class="btn-container">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" data-id="prev-step-3" @click="activateCallback('2')" />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </form>
</template>


<style scoped>
.btn-container {
  padding-top: var(--space-std);
  display: flex;
}

.right.btn-container {
  justify-content: flex-end;
}

.right.left.btn-container {
  justify-content: space-between;
}

form {
  display: flex;
  flex-direction: column;
  padding: var(--space-std);
  max-width: var(--max-width);
  margin-left: auto;
  margin-right: auto;
  background-color: var(--white);
  border-radius: var(--rounded-sm);
  box-shadow: var(--box-shadow);
  border-top: 4px solid var(--primary-300);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-std);
}

input:focus,
input[type='radio']:focus {
  outline-color: var(--primary-500);
}


#gender-container {
  display: flex;
  gap: var(--space-m);
}

#weekly-change-container {
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--space-m);
  row-gap: var(--space-xs);
  justify-items: flex-start;
}

#height-weight-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-m);
}

#activity-level-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

#target-weight {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

#target-weight:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(56, 178, 172, 0.5);
  /* focus:ring-2 */
}

.flex-col {
  display: flex;
  flex-direction: column;
}

label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--medium);
  color: var(--grey-700);
  margin-bottom: var(--space-xs);
}


label:not(.for-option) {
  font-weight: var(--bold);
  color: var(--primary-600);
  margin-bottom: var(--space-xs);
  margin-top: var(--space-xs);
}


label.multiple {
  display: flex;
  align-items: flex-start;
  gap: calc(var(--space-std) / 2);
}

label.for-option {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--space-std) / 3);
}

.option-name {
  font-weight: var(--medium);
}

.option-descr {
  color: var(--grey-500);
  font-size: var(--text-xs);
  line-height: 1.625;
}

input[type='radio'] {
  -webkit-appearance: radio;
  -moz-appearance: radio;
  appearance: radio;
  color: var(--primary-600);
}

input[type='radio'].stacked {
  margin-top: var(--space-xs);
}

Button.btn {
  margin-top: var(--space-m);
  background-color: var(--primary-600);
  color: var(--white);
  font-size: var(--text-base);
  font-weight: var(--bold);
  padding: calc(var(--space-std) / 2) var(--space-std);
  border-radius: var(--rounded);
  transition: background-color 0.2s ease-in-out;
  letter-spacing: 0.05em;
  width: 100%;
}

Button.btn:active,
Button.btn:hover {
  background-color: var(--primary-800);
  cursor: pointer;
}

/* Container with calculated kcal limit and target date */

.daily-info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.daily-kcal-container {
  background-color: var(--primary-50);
  padding: 1.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-600);
}

.kcal-display {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-300);
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  margin: 1rem auto;
  font-size: 2rem;
  font-weight: 700;
  color: var(--white);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.kcal {
  font-size: 2.5rem;
  font-weight: 800;
}

.text-sm {
  font-size: 0.875rem;
}

.text-gray-500 {
  color: var(--grey-500);
}

.target-date-container {
  margin-top: 1rem;
}

.target-date {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-600);
  margin-top: 0.5rem;
}

.target-date-container p {
  color: var(--grey-700);
}
</style>