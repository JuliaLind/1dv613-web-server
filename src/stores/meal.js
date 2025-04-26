import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { MealService } from '@/services/meal.service'
import { weightedNutrients } from '@/helpers/nutrients'
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

  function setDate(date) {
    currentDate.value = date
  }
  function selectMeal(type) {
    currentMeal.value = meals.value[type]
  }

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
    let totals = {
      kcal: 0,
      protein: 0,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 0,
      sugars: 0,
      fiber: 0,
      salt: 0
    }

    for (const meal of Object.values(meals.value)) {
      for (const foodItem of meal.foodItems) {
        const foodNutrients = weightedNutrients(foodItem.weight, {
          ...foodItem.macros_100g,
          kcal: foodItem.kcal_100g
        })
        Object.keys(totals).forEach(key => {
          totals[key] += foodNutrients[key] || 0
        })
      }
    }

    return totals
  })

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
      delMeal(type)
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
