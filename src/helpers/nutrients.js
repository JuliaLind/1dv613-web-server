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
 * 
 * @param {number} weight the weight of the food in grams
 * @param {object} nutrients the nutrients of the food per 100 grams
 * @param {*} nutrients 
 * @returns 
 */
export function weightedNutrients(weight = 0, nutrients = {}) {
  const weightedNutrients = {}
  for (const [key, value] of Object.entries(nutrients)) {
    weightedNutrients[key] = weightedValue(weight, value)
  }
  return weightedNutrients
}

