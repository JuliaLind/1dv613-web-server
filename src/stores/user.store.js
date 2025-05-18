import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { CalcService } from '@/services/calc.service'
import { isToday, format, endOfDay, isBefore, isEqual } from 'date-fns'

import { UserService } from '@/services/user.service'
import { isFilled } from '@/helpers/validate'

/**
 * Stores user data and provides methods to manipulate it.
 */
export const useUserStore = defineStore('user', () => {
  const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'))

  const defaultUser = {
    height: null,
    currentWeight: null,
    targetWeight: null,
    gender: null,
    activityLevel: CalcService.activityLevelOptions.sedentary.value,
    weeklyChange: null,
    // updatedAt: null,
    history: [],
  }


  const user = reactive({
    ...defaultUser,
  })

  /**
   * Current age, is retrieved from the access token that
   * is regularly exchanged.
   */
  const age = computed(() => {
    const age = userService.getAge()

    return age
  })

  const userService = new UserService()

  /**
   * Checks if the user has set their data.
   *
   * @returns {boolean} - true if all the mandatory fields are filled
   */
  const isSet = computed(() => {
    return isFilled(user) && age.value
  })

  /**
   * Sets the selected date.
   *
   * @param {string} date - the new date
   */
  function setDate(date) {
    selectedDate.value = date
  }

  /**
   * Checks if the user has updated their data today.
   *
   * @returns {boolean} - true if the user has updated their data today
   */
  const isUpdated = computed(() => {
    if (!this.updatedAt) {
      return true // because the user has not registered their data yet
    }
    return isToday(new Date(user.history[0].effectiveDate))
  })

  /**
   * The kcal needed to maintain the current weight.
   *
   * @returns {number} - the maintenance kcal
   */
  const maintenanceKcal = computed(() => {
    return CalcService.maintenanceKcal(
      user.gender,
      historyEntry.value.age,
      historyEntry.value.height,
      historyEntry.value.currentWeight,
      user.activityLevel,
    )
  })

  /**
   * The estimated date when the user will reach their target weight based on the current weight and weekly change.
   *
   * @returns {string} - the target date in 'yyyy-MM-dd' format
   */
  const targetDate = computed(() => {
    return CalcService.targetDate(
      user.weeklyChange,
      user.targetWeight,
      user.currentWeight,
      new Date()
    )
  })


  /**
   * The daily kcal limit to reach the target weight based on
   * selected daily change.
   *
   * @returns {number} - the daily kcal limit.
   */
  const dailyLimit = computed(() => {
    return CalcService.dailyLimit(user.weeklyChange, user.targetWeight, historyEntry.value.currentWeight, maintenanceKcal.value)
  })

  /**
   * The daily macros in g recommended based on the daily limit.
   *
   * @returns {object} - the daily macros
   * @property {number} protein - the recommended daily protein intake in grams
   * @property {number} fat - the recommended daily fat intake in grams
   * @property {number} carbohydrates - the recommended daily carbohydrate intake in grams
   */
  function getRecMacros() {
    if (!isSet.value) {
      return undefined
    }

    const recommended = CalcService.targetMacros(dailyLimit.value)
    recommended.fiber = CalcService.targetFiber(user.gender, historyEntry.value.age)
    return recommended
  }


  /**
   * Selects the most recent entry from
   * the weight history that is before or equal to the chosen date, and returns the weight from the entry. If no entry is found, it returns the last entry in the history.
   *
   * @returns {number} - the weight on the selected date
   */
  const historyEntry = computed(() => {
    const date = endOfDay(new Date(selectedDate.value))

    let entry = user.history.find(entry =>
      isBefore(new Date(entry.effectiveDate), date) ||
      isEqual(new Date(entry.effectiveDate), date)
    )

    const lastIndex = user.history.length - 1

    if (!entry && lastIndex >= 0) {
      entry = user.history[lastIndex]
    }

    return entry ?? {...user, age: age.value}
  })

  /**
   * Fetches the user data from the database and assigns it to the user object.
   * This is used when the user logs in or when the app is initialized.
   */
  async function fetchUserData() {
    const data = await userService.get()

    Object.assign(user, data)
  }

  /**
   * Updates the user data in the database and assigns it to the user object.
   *
   * @param {object} newData - associative array of the new data 
   */
  async function updUserData(newData) {
    const effectiveDate = new Date()

    newData.effectiveDate = effectiveDate
    newData.age = age.value

    if (!isSet.value) {
      userService.post(newData)
    } else {
      userService.put(newData)
    }

    Object.assign(user, newData)

    // add the new data at the beginning of history array
    user.history.unshift({
      effectiveDate,
      currentWeight: newData.currentWeight,
      age: age.value,
      height: newData.height
    })
    // // set today even if no change has been made
    // // because this is more to track if the user has reviewed their data
    // user.updatedAt = format(new Date(), 'yyyy-MM-dd')
  }

  /**
   * Deletes the user data from the database and resets the user object.
   *
   * @param {object} credentials - associative array with email and password
   */
  async function deleteProfile(credentials) {
    await userService.delete(credentials)
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
    getRecMacros,
    isSet,
    isUpdated,
    clearUserData,
    deleteProfile,
    age,
    setDate,
    selectedDate,
    historyEntry,
  }
})
