import { computed, reactive } from "vue"
import { Food } from "@/models/Food"
import { unwrap } from "@/helpers/helpers"
import { addToTotal } from "@/helpers/nutrients"

export class Meal {
  static TYPES = {
    breakfast: 'breakfast',
    snack1: 'snack',
    lunch: 'lunch',
    snack2: 'snack',
    dinner: 'dinner',
    snack3: 'snack'
  }

  /**
   * Creates a new meal object.
   *
   * @param {string} type - the type of meal
   */
  constructor(type) {
    this.setType(type)
    this.foodItems = reactive([])
    this.id = ''
  }

  /**
   * Validates and sets the type of meal.
   *
   * @param {string} type - the type of meal
   * @throws {Error} if the type is not valid
   * @throws {Error} if the type is not provided 
   */
  setType(type) {
    if (!type) {
      throw new Error('Meal type is required')
    }
    if (!Object.keys(Meal.TYPES).includes(type)) {
      throw new Error(`Invalid meal type: ${type}`)
    }
    this.type = type
  }

  /**
   * Returns the macros of the meal in grams.
   *
   * @returns {object} - the macros of the meal in g
   */
  getMacros () {
    let total
    for (const foodItem of this.foodItems) {
      total = addToTotal(total, foodItem.getMacros())
    }
    return total
  }

  /**
   * Checks if the meal has an id, which
   * means it has been successfully registered
   * on the server.
   *
   * @returns {boolean} true if the meal has an id
   */
  isRegistered() {
    return this.id !== ''
  }

  /**
   * Checks if the meal has only one food item.
   * This method is used to determine of the meal
   * should be deleted when the last food item is removed.
   *
   * @returns {boolean} true if the meal has only one food item
   */
  hasOneItem() {
    return this.foodItems.length === 1
  }

  /**
   * Calories in a meal.
   *
   * @returns {number} - the total calories in the meal
   */
  kcal = computed(() => {
    let total = 0
    for (const foodItem of this.foodItems) {
      total += unwrap(foodItem.kcal)
    }
    return total
  })

  /**
   * Returns the name of the meal based on its type.
   *
   * @returns {string} - the name of the meal
   */
  getName() {
    return Meal.TYPES[this.type] || this.type
  }

  static fromData(data) {
    const meal = new Meal(data.type)
    meal.id = data.id
    meal.type = data.type

    meal.addFoodItems(data.foodItems)
    return meal
  }

  addFoodItem(item) {
    this.foodItems.push(item)
  }

  addFoodItems(items) {
    for (const item of items) {
      this.addFoodItem(new Food(item))
    }
  }

  delFoodItem(itemId) {
    // dont change to filter! will not trigger kcal computed reativity!
    const index = this.foodItems.findIndex(item => item.id === itemId)
    if (index !== -1) {
      this.foodItems.splice(index, 1)
    }
  }

  init(data) {
    this.id = data.id
    this.foodItems.length = 0
    this.addFoodItems(data.foodItems)
  }

  findItemById(id) {
    return this.foodItems.find((item) => item.id === id)
  }

  reset() {
    this.foodItems.pop()
  }

  static newSet() {
    const day = {}
    for (const type in Meal.TYPES) {
      day[type] = new Meal(type)
    }
    return day
  }

  static updFromData(day, data) {
    for (const type in this.TYPES) {
      day[type] = data?.[type] ? this.fromData(data[type]) : new Meal(type)
    }
  }
}