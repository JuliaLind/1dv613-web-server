import { ref } from "vue"
import { Food } from "@/models/Food"

/**
 * Represents a list of food items.
 */
export class FoodList {
  /**
   * Creates a new food list.
   */
  constructor() {
    this.items = ref([])
  }

  /**
   * Creates new food items from the data.
   * Replaces the current list of food items with the new food items.
   *
   * @param {array} data - the food item data from the server 
   */
  setItems(data) {
    this.items.value = Food.itemsFromData(data)
  }

  /**
   * Creates new food items from the data and adds them to the end of the current list.
   *
   * @param {array} data - the food item data from the server 
   */
  addItems(data) {
    this.items.value = [...this.items.value, ...Food.itemsFromData(data)]
  }
}