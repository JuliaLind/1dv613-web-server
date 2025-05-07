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

// /**
//  * 
//  * @param {number} weight the weight of the food in grams
//  * @param {object} nutrients the nutrients of the food per 100 grams
//  * @param {*} nutrients 
//  * @returns 
//  */
// export function weightedNutrients(weight = 0, nutrients = {}) {
//   const weightedNutrients = {}
//   for (const [key, value] of Object.entries(nutrients)) {
//     weightedNutrients[key] = weightedValue(weight, value)
//   }
//   return weightedNutrients
// }

// /**
//  * 
//  * @param {object} meal the meal object containing food items
//  * @param {object} totals - associative array
//  * of nutrient names and their values
//  * @returns {object} the totals object with the summed values of the nutrients
//  */
// export function nutrientsPerMeal(meal, totals = {
//   kcal: 0,
//   protein: 0,
//   fat: 0,
//   saturatedFat: 0,
//   carbohydrates: 0,
//   sugars: 0,
//   fiber: 0,
//   salt: 0
// }) {
//   for (const foodItem of meal.foodItems) {
//     const foodNutrients = weightedNutrients(foodItem.weight, {
//       ...foodItem.macros_100g,
//       kcal: foodItem.kcal_100g
//     })
//     Object.keys(totals).forEach(key => {
//       totals[key] += foodNutrients[key] || 0
//     })
//   }
//   return totals
// }

