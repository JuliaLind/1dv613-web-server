import { computed, ref } from 'vue'
import { weightedValue } from '@/helpers/nutrients'
import { unwrap } from '@/helpers/helpers'

export class Food {
  /**
   * Unit options for the food item.
   * Currently only grams are supported.
   */
  static UNITS = [{ name: 'g', code: 'g' }]

  /**
   * Created a new food item.
   *
   * @param {object} data - the food info from the server 
   */
  constructor(data) {
    for (const key of ['name', 'brand', 'ean', 'kcal_100g', 'macros_100g', 'unit']) {
      this[key] = data[key]
    }

    this.imgUrl = data.img?.sm
    this.id = data.id || ''
    this.weight = ref(data.weight || 100)
    this.unit = ref(data.unit || Food.UNITS[0].code)
  }

  /**
   * Computed property that returns kalories in the
   * food item based on the current weight.
   * 
   * @returns {number} the kcal value of the food item
   */
  kcal = computed(() => {
    return weightedValue(this.weight.value, this.kcal_100g)
  })

  /**
   * Computed property that returns an array of objects
   * containing the name and value of each nutrient
   * in the food item, including kcal and macros.
   *
   * @returns {Array} an array of objects containing
   * the name and value of each nutrient based on the current weight.
   */
  contents = computed(() => {
    const rows = []
    rows.push({
      name: 'kcal',
      value: this.kcal
    })
    for (const [nutrient, value] of Object.entries(this.macros_100g)) {
      rows.push({
        // regex: find capital letter and replace it
        // with space + the found letter, globally.
        // then convert to lowercase
        // example saturatedFat -> saturated fat
        name: nutrient.replace(/([A-Z])/g, ' $1').toLowerCase(),
        value: weightedValue(this.weight.value, value)
      })
    }
    return rows
  }
  )

  toData() {
    return {
      id: this.id,
      ean: this.ean,
      name: this.name,
      img: {
        sm: this.imgUrl
      },
      brand: this.brand,
      kcal_100g: this.kcal_100g,
      macros_100g: { ...this.macros_100g },
      unit: unwrap(this.unit),
      weight: unwrap(this.weight)
    }
  }

  /**
   * Clones the current food item.
   *
   * @returns {Food} a new food item with the same properties
   */
  clone() {
    const food = new Food(this.toData())

    return food
  }

  static itemsFromData(data) {
    return data.map(item => new Food(item))
  }
}