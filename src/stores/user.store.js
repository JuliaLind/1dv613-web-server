import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { CalcService } from '@/services/calc.service'
import { parseISO, isToday, format, endOfDay, isBefore, isEqual } from 'date-fns'

import { UserService } from '@/services/user.service'
import { isFilled } from '@/helpers/validate'


export const useUserStore = defineStore('user', () => {
  // These are stored in the database
  const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'))

  const defaultUser = {
    height: null,
    currentWeight: null,
    targetWeight: null,
    gender: null,
    activityLevel: CalcService.activityLevelOptions.sedentary.value,
    weeklyChange: null,
    updatedAt: null,
  }

  const user = reactive({
    ...defaultUser,
  })

  const userService = new UserService()

  const isSet = computed(() => {
    return isFilled(user) && age.value
  })

  /**
   * Sets the date.
   *
   * @param {string} date - the new date
   */
  function setDate(date) {
    selectedDate.value = date
  }

  const isUpdated = computed(() => {
    if (!this.updatedAt) {
      return true // because the user has not registered their data yet
    }
    return isToday(parseISO(user.updatedAt))
  })

  const age = computed(() => {
    const age = userService.getAge()

    return age
  })

  // these are constants for frontend

  const maintenanceKcal = computed(() => {
    return CalcService.maintenanceKcal(user.gender,
      age.value,
      user.height,
      weightOnSelectedDate(),
      user.activityLevel,
    )
  })

  const targetDate = computed(() => {
    return CalcService.targetDate(
      user.weeklyChange,
      user.targetWeight,
      weightOnSelectedDate(),
    )
  })

  const dailyLimit = computed(() => {
    return CalcService.dailyLimit(user.weeklyChange, user.targetWeight, weightOnSelectedDate(), maintenanceKcal.value)
  })

  const dailyMacros = computed(() => {
    return CalcService.targetMacros(
      dailyLimit.value
    )
  })

  /**
   * Selects the most recent entry from
   * the weight history that is before or equal to the chosen date, and returns the weight from the entry.
   */
  function weightOnSelectedDate() {
    const date = endOfDay(parseISO(selectedDate.value))

    const entry = user.history.find(entry =>
      isBefore(parseISO(entry.effectiveDate), date) ||
      isEqual(parseISO(entry.effectiveDate), date)
    )

    return entry?.currentWeight || null
  }

  async function fetchUserData() {
    const data = await userService.get()

    Object.assign(user, data)
  }

  async function updUserData(newData) {
    if (!isSet.value) {
      userService.post(newData)
    } else {
      userService.put(newData)
    }
    Object.assign(user, newData)
    // set today even if no change has been made
    // because this is more to track if the user has reviewed their data
    user.updatedAt = format(new Date(), 'yyyy-MM-dd')
  }

  /**
   * Deletes the user data from the database and resets the user object.
   */
  async function deleteProfile() {
    await userService.delete()
    clearUserData()
  }

  /**
   * Clears the user data by resetting it to the default values.
   * This is used when the user logs out or when the app is reset.
   */
  async function clearUserData() {
    Object.keys(user).forEach(key => {
      user[key] = defaultUser[key]
    })
  }


  return {
    user,
    targetDate,
    fetchUserData,
    updUserData,
    maintenanceKcal,
    dailyLimit,
    dailyMacros,
    isSet,
    isUpdated,
    clearUserData,
    deleteProfile,
    age,
    setDate
  }
})
