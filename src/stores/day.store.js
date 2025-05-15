import { ref, computed, reactive, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { MealService } from '@/services/meal.service'
import { format } from 'date-fns'
import { Meal } from '@/models/Meal'
import { Food } from '@/models/Food'
import { addToTotal } from '@/helpers/nutrients'


const mealService = new MealService()

export const useDayStore = defineStore('day', () => {
  const meals = reactive(Meal.newSet())
  const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'))
  let selected = null

  /**
   * Updates the meals in the store with the data from the server.
   *
   * @param {object} data - the data from
   * the server response containing the registered meals.
   *
   */
  function update(data) {
    Meal.updFromData(meals, data)
  }

  /**
   * Fetches meals for the selected date and sets them in the store.
   * Placeholders are created for the meals that are not registered.
   *
   */
  async function fetchMeals() {
    const data = await mealService.index(selectedDate.value)

    update(data)
  }

  /**
   * Sets the date.
   *
   * @param {string} date - the new date
   */
  function setDate(date) {
    selectedDate.value = date
  }

  /**
   * Selects a meal fod adding food items.
   *
   * @param {string} type - type of meal
   */
  function selectMeal(type) {
    selected = meals[type]
  }

  /**
   * Creates a new meal using optimistic update.
   *
   * @param {object} item - the item to send to server
   * @param {object} prelItem - the item to be displayed in the UI
   */
  async function newMeal(item) {
    const newMeal = {
      date: selectedDate.value,
      type: selected.type,
      foodItems: [item]
    }

    try {
      const data = await mealService.post(newMeal)

      selected.init(data)
    } catch (error) {
      // reverse update if error
      selected.reset()
      throw error
    }
  }

  /**
   * Add a food item to the current meal using optimistic update.
   *
   * @param {object} item - the item to send to server
   * @param {object} prelItem - the item to be displayed in the UI
   * @returns {Promise<string>} - the id of the food item
   * @throws {Error} - if the request fails
   */
  async function addFoodItem(item) {
    try {
      return await mealService.addFoodItem(selected.id, item)
    } catch (error) {
      // reverse update if error
      selected.reset()
      throw error
    }
  }

  /**
   * Finds a meal by id.
   *
   * @param {string} id - if od the meal to find
   * @returns {Meal} - the meal with the given id
   */
  function findMealById(id) {
    return Object.values(meals).find(m => m.id === id)
  }

  /**
   * Returns the total kcal of all meals.
   */
  const kcal = computed(() => {
    let total = 0
    for (const meal of Object.values(meals)) {
      total += meal.kcal
    }
    return total
  })

  /**
   * Updates the weight and unit of a food item in the meal using optimistic update.
   *
   * @param {string} mealId - id of the meal
   * @param {object} data - associative array containing the id, weight and unit of the food item
   */
  async function updMealItem(mealId, data) {
    const meal = findMealById(mealId)
    const { id, weight, unit } = data
    const item = toRaw(meal.findItemById(id))

    const initialWeight = item.weight.value
    const initialUnit = item.unit.value

    item.weight.value = weight
    item.unit.value = unit

    try {
      await mealService.updFoodItem(mealId, { id, weight, unit })
    } catch (error) {
      item.weight.value = initialWeight
      item.unit.value = initialUnit
      throw error
    }
  }


  /**
   * Adds a food item to the current meal.
   *
   * @param {object} food - a food item to be added to the meal
   */
  async function addToSelected(food) {
    const item = {
      ean: food.ean,
      weight: food.weight,
      unit: food.unit
    }

    const newItem = new Food(food)

    selected.addFoodItem(newItem)

    if (!selected.isRegistered()) {
      await newMeal(item)
    } else {
      newItem.id = await addFoodItem(item)
    }
  }

  /**
   * Deletes a meal using optimistic update.
   *
   * @param {string} type - the type of the meal to delete
   */
  async function delMeal(type) {
    const meal = meals[type]
    meals[type] = new Meal(type)

    try {
      await mealService.del(meal.id)
    } catch (error) {
      meals[type] = meal
      throw error
    }
  }

  /**
   * If the meal contains more than one item,
   * deletes the item from the meal using optimistic update. Otherwise emits delete event for the whole meal to be deleted.
   *
   * @param {string} id - id of the food item to delete 
   * @param itemId
   * @param type
   */
  async function delItem(itemId, type) {
    const meal = meals[type]
    if (meal.hasOneItem()) {
      await delMeal(type)
      return
    }

    const temp = [...meal.foodItems]
    meal.delFoodItem(itemId)

    try {
      await mealService.delFoodItem(meal.id, itemId)
    } catch (error) {
      meal.foodItems = temp
      throw error
    }

  }

  /**
   * Returns the total macros of all meals of the day.
   *
   * @returns {object} - the total macros of all meals
   */
  function getMacros() {
    let total
    for (const meal of Object.values(meals)) {
      total = addToTotal(total, meal.getMacros())
    }

    return total
  }



  return {
    meals,
    fetchMeals,
    selectedDate,
    setDate,
    selectMeal,
    kcal,
    addToSelected,
    delItem,
    updMealItem,
    getMacros
  }
})
