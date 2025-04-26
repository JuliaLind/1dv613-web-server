import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { MealService } from '@/services/meal.service'
import { nutrientsPerMeal } from '@/helpers/nutrients'
import { format } from 'date-fns'


const mealService = new MealService()

export const useMealStore = defineStore('meal', () => {
  function dummyMeal(type) {
    return {
      id: '',
      type,
      foodItems: []
    }
  }
  const meals = ref({
    breakfast: dummyMeal('breakfast'),
    snack1: dummyMeal('snack1'),
    lunch: dummyMeal('lunch'),
    snack2: dummyMeal('snack2'),
    dinner: dummyMeal('dinner'),
    snack3: dummyMeal('snack3')
  })

  const currentDate = ref(format(new Date(), 'yyyy-MM-dd'))
  const currentMeal = ref(null)

  /**
   * Fetches meals for the current date and sets them in the store.
   * If the meal is not found, it initializes it with empty values.
   *
   */
  async function setMeals() {
    const data = await mealService.index(currentDate.value)

    for (const type of Object.keys(meals.value)) {
      if (data[type]) {
        meals.value[type] = data[type]
        continue
      }
      // Initialize the meal with empty values
      meals.value[type] = dummyMeal(type)
    }
  }

  /**
   * Sets the date.
   *
   * @param {string} date - the new date
   */
  function setDate(date) {
    currentDate.value = date
  }

  /**
   * Selects a meal type and sets it as the current meal.
   *
   * @param {string} type - type of meal
   */
  function selectMeal(type) {
    currentMeal.value = meals.value[type]
  }

  /**
   * Creates a new meal using optimistic update.
   *
   * @param {object} item - the item to send to server
   * @param {object} prelItem - the item to be displayed in the UI
   */
  async function newMeal(item, prelItem) {
    const newMeal = {
      date: currentDate.value,
      type: currentMeal.value.type,
      foodItems: [item]
    }

    meals.value[currentMeal.value.type].foodItems.push(prelItem)

    try {
      const meal = await mealService.post(newMeal)
      currentMeal.value = meal
      meals.value[currentMeal.value.type] = meal
    } catch (error) {
      // reverse update if error
      meals.value[currentMeal.value.type].foodItems.pop()
      throw error
    }
  }

  /**
   * Add a food item to the current meal using optimistic update.
   *
   * @param {object} item - the item to send to server
   * @param {object} prelItem - the item to be displayed in the UI
   */
  async function addFoodItem(item, prelItem) {
    try {
      // optimistic update
      currentMeal.value.foodItems.push(prelItem)
      const newId = await mealService.addFoodItem(currentMeal.value.id, item)
      prelItem.id = newId
    } catch (error) {
      // reverse update if error
      currentMeal.value.foodItems.pop()
      throw error
    }
  }


  const data = computed(() => {
    let totals
    for (const meal of Object.values(meals.value)) {
      totals = nutrientsPerMeal(meal, totals)
    }

    return totals
  })

  /**
   * Adds a food item to the current meal.
   *
   * @param {object} food - a food item to be added to the meal
   */
  async function setItem(food) {
    const item = {
      ean: food.ean,
      weight: food.weight,
      unit: food.unit
    }

    const prelItem = {
      ...food,
      id: 'prel'
    }

    if (!currentMeal.value.id) {
      await newMeal(item, prelItem)
    } else {
      await addFoodItem(item, prelItem)
    }
  }

  /**
   * Deletes a meal using optimistic update.
   *
   * @param {string} type - the type of the meal to delete
   */
  async function delMeal(type) {
    const meal = meals.value[type]
    const temp = {
      ...meal
    }
    meals.value[type] = dummyMeal(type)

    try {
      await mealService.del(meal.id)
    } catch (error) {
      meals[type] = temp
      throw error
    }
  }

  /**
   * If the meal contains more than one item,
   * deletes the item from the meal using optimistic update. Otherwise emits delete event for the whole meal to be deleted.
   *
   * @param {string} id - id of the food item to delete 
   */
  async function delItem(itemId, type) {
    const meal = meals.value[type]
    if (meal.foodItems.length === 1) {
      await delMeal(type)
      return
    }

    const temp = [...meal.foodItems]
    meal.foodItems = meal.foodItems.filter((item) => item.id !== itemId)

    try {
      await mealService.delFoodItem(meal.id, itemId)
    } catch (error) {
      meal.foodItems = temp
      throw error
    }

  }



  return {
    meals,
    setMeals,
    currentDate,
    setDate,
    currentMeal,
    selectMeal,
    data,
    setItem,
    delMeal,
    delItem
  }
})
