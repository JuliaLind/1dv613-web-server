/**
 * Calculates the weighted value based on the weight and value per 100g. Value 100g can for example be kcal, fiber, protein, etc.
 *
 * @param {number} weight the weight of the food in grams
 * @param {number} value_100g the value of the food per 100 grams
 * @returns {number} the value of the food per the given weight
 */
export function weightedValue(weight = 0, value_100g = 0) {
  return Math.round(value_100g / 100 * weight)
}

/**
 * Adds the values in the macros associative array to the
 * values in the total associative array.
 *
 * @param {object} total - associative array mapping nutrient names to their values
 * @param {object} macros - associative array mapping nutrient names to their values
 * @returns {object} the total object with the summed values of the nutrients from the total and macros objects
 */
export function addToTotal(total = {
  protein: 0,
  fat: 0,
  saturatedFat: 0,
  carbohydrates: 0,
  sugars: 0,
  fiber: 0,
  salt: 0
}, macros = {}) {
  for (const key of Object.keys(total)) {
    total[key] += (macros[key] || 0)
  }
  return total
}

/**
 * Transforms the nutrient name from camel case to lowercase with spaces.
 *
 * @param {string} nutrient - nutrient name in camel case
 * @returns {string} the nutrient name in lowercase with spaces
 */
export function getNutrientName(nutrient) {
  // regex: find capital letter and replace it
  // with space + the found letter, globally.
  // then convert to lowercase
  // example saturatedFat -> saturated fat
  return nutrient.replace(/([A-Z])/g, ' $1').toLowerCase()
}
