<script setup>
import { computed } from 'vue'
import { useDayStore } from '@/stores/day.store.js'
import { useUserStore } from '@/stores/user.store.js'
import { getNutrientName } from '@/helpers/nutrients'

const dayStore = useDayStore()
const userStore = useUserStore()


/**
 * Returns true if the actual value is within allowed range of the recommended value.
 * The default delta is 0.2, which means that the actual value can be 20% higher or lower than the recommended value.
 *
 * @param {number} actual - the actual value of the nutrient
 * @param {number} recommended - the recommended value of the nutrient
 * @param {number} delta - the allowed range of deviation from the recommended value
 * @returns {boolean} - true if the actual value is within the allowed range of the recommended value
 */
function isWithinRecRange(actual, recommended, delta = 0.2) {
  return actual >= recommended * (1 - delta) && actual <= recommended * (1 + delta)
}

/**
 * Returns true if the nutrient is one of the nutrients that is better to
 * consume more than recommended amount of.
 *
 * @param {string} nutrient - the nutrient to check
 * @returns {boolean} - true if the nutrient is one of the nutrients that is better to consume more than recommended amount of
 */
function moreIsBetter(nutrient) {
  return ['fiber'].includes(nutrient)
}

/**
 * Returns true if the nutrient is one of the nutrients that is better to consume
 * less than the recommended amount.
 *
 * @param {string} nutrient - the nutrient to check
 * @returns {boolean} - true if the nutrient is one of the nutrients that is better to consume less than the recommended amount
 */
function lessIsBetter(nutrient) {
  return ['fat', 'saturatedFat', 'sugars', 'salt'].includes(nutrient)
}

/**
 * Returns true if the nutrient is one of the nutrients that is better to consume
 * close to the recommended amount.
 *
 * @param {string} nutrient - the nutrient to check 
 * @returns {boolean} - true if the nutrient is one of the nutrients that is better to consume close to the recommended amount
 */
function equalIsBetter(nutrient) {
  return ['protein', 'carbohydrates'].includes(nutrient)
}

/**
 * Returns the class name for the actual value of the nutrient based on the
 * actual and recommended values. Used to visually indicate to the user how well
 * they are doing with their nutrient intake.
 *
 * @param {string} nutrient - the nutrient to check
 * @param {number} actual - the actual value of the nutrient
 * @param {number} recommended - the recommended value of the nutrient
 *
 * @returns {string} - the css class to use for the actual value of the nutrient
 */
function classActual(nutrient, actual, recommended) {
  if (!userStore.isSet) {
    return ''
  }

  if (moreIsBetter(nutrient) && actual < recommended) {
    return 'not-ok'
  }

  if (lessIsBetter(nutrient) && actual > recommended) {
    return 'not-ok'
  }

  if (equalIsBetter(nutrient) && !isWithinRecRange(actual, recommended)) {
    return 'not-ok'
  }

  return 'ok'
}

const tableRows = computed(() => {
  const actual = dayStore.getMacros()
  const rec = userStore.getRecMacros()

  const data = []

  for (const key in actual) {
    const recValue = rec?.[key] ?? 0

    const row = {
      name: getNutrientName(key),
      actual: actual[key],
      rec: recValue,
      class: classActual(key, actual[key], recValue)
    }
    data.push(row)
  }

  return data
})

</script>


<template>
    <table>
      <thead>
        <tr>
          <th>Nutrient</th>
          <th class="value">Value (g)</th>
          <th v-if="userStore.isSet" class="number">Recommended (g)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableRows" :key="item.name">
          <td>{{ item.name }}</td>
          <td :class="item.class + ' number actual'">{{ item.actual }}</td>
          <td v-if="userStore.isSet" class="number">{{ item.rec }}</td>
        </tr>
      </tbody>
    </table>
</template>

<style scoped>
table {
  width: min-content;
  font-size: var(--text-xs);
  border: 1px solid var(--grey-200);
  border-radius: var(--rounded-md);
  box-shadow: 0 1px 2px var(--light-shadow);
  overflow: hidden;
}

th {
  white-space: nowrap;
}

.actual {
  font-weight: var(--bold);
}



thead {
  background-color: var(--grey-50);
  color: var(--grey-700);
  font-weight: var(--bold);
  border-bottom: 1px solid var(--grey-200);
}

th,
td {
  padding: calc(var(--space-m)/2) var(--space-m);
  width: fit-content;
}

td {
  color: var(--grey-800);
}

.number {
  text-align: right;
}

tbody {
  border-collapse: collapse;
}

tbody tr {
  border-bottom: 1px solid var(--grey-200);
}

tbody tr:last-child {
  border-bottom: none;
}


</style>