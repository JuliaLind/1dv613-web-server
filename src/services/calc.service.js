import { format, addDays } from 'date-fns'
import { isFilled } from '@/helpers/validate'

/**
 * Contains methods for calculating the daily kcal intake and other related values.
 * The calculations are based on the Mifflin-St Jeor (1990) formula.
 */
export class CalcService {
  static changeOptions = [
    {
      value: 0.25,
      descr: '0.25 kg/week'
    },
    {
      value: 0.5,
      descr: '0.5 kg/week'
    },
    {
      value: 0.75,
      descr: '0.75 kg/week'
    },
    {
      value: 1,
      descr: '1 kg/week'
    }
  ]

  static genderOptions = [
    {
      value: 'f',
      descr: 'female'
    },
    {
      value: 'm',
      descr: 'male'
    }
  ]

  static activityLevelOptions = {
    sedentary: {
      name: 'Sedentary',
      description: 'Little or no exercise',
      value: 1.2
    },
    light: {
      name: 'Light Exercise',
      description: 'Light exercise/sports 1 - 3 days/week',
      value: 1.375
    },
    moderate: {
      name: 'Moderate Exercise',
      description: 'Moderate exercise 3 - 5 days/week',
      value: 1.55
    },
    heavy: {
      name: 'Heavy Exercise',
      description: 'Hard exercise 6 - 7 days/week',
      value: 1.725
    },
    athlete: {
      name: 'Athlete',
      description: 'Very hard exercise, physical job or 2x training',
      value: 1.9
    }
  }

  static macros = {
    protein: {
      rec_perc: 0.3,
      kcalPerGram: 4,
    },
    fat: {
      rec_perc: 0.25,
      kcalPerGram: 9,
    },
    carbohydrates: {
      rec_perc: 0.45,
      kcalPerGram: 4,
    }
  }

  /**
   * Caluclates the daily kcal neccessary to maintain the current weight, based on the Mifflin-St Jeor (1990) formula.
   *
   * @param {string} gender - 'm' or 'f'
   * @param {number} age - the age of the user
   * @param {number} height - the height of the user in cm
   * @param {number} weight - the weight of the user in kg
   * @param {string} activityLevel - the activity level of the user
   * @returns {number} - the maintenance kcal
   */
  static maintenanceKcal(gender, age, height, weight, activityLevel = 'sedentary') {
    const activityMultiplier = this.activityLevelOptions[activityLevel].value
    if (!isFilled({ gender, age, height, weight })) {
      return 0
    }

    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'm' ? 5 : -161)

    // Total Daily Energy Expenditure
    const tdee = bmr * activityMultiplier

    return Math.round(tdee)
  }

  /**
   * Calculates the number of kcal to be consumed daily to reach the target weight.
   *
   * @param {number} weeklyChange - the weekly change in kg
   * @param {number} targetWeight - the target weight in kg
   * @param {number} currentWeight - the current weight in kg
   * @param {number} maintenanceKcal - the maintenance kcal
   * the user should eat to maintain current weight
   * @returns {number} - the daily kcal limit
   */
  static dailyLimit(weeklyChange, targetWeight, currentWeight, maintenanceKcal) {
    const kcalPerKg = 7700
    const kcalChangePerWeek = weeklyChange * kcalPerKg
    const dailyChange = kcalChangePerWeek / 7

    const kcalTarget = targetWeight < currentWeight
      ? maintenanceKcal - dailyChange
      : maintenanceKcal + dailyChange

    return Math.round(kcalTarget)
  }

  /**
   * Calculated the target date when the user will reach their target weight.
   *
   * @param {number} weeklyChange - the absolute value of the weekly change in kg, can be a float
   * @param {number} targetWeight - the target weight in kg, can be a float
   * @param {number} currentWeight - the current weight in kg, can be a float
   * @param  {Date} currentDate - the current date, defaults to today
   * @returns {string} - the target date in 'yyyy-MM-dd' format
   */
  static targetDate(weeklyChange, targetWeight, currentWeight, currentDate = new Date()) {
    if (targetWeight > currentWeight) {
      return format(new Date(), 'yyyy-MM-dd')
    }
    const dailyChange = weeklyChange / 7
    const deltaWeight = targetWeight - currentWeight
    const days = Math.abs(deltaWeight / dailyChange)


    return format(addDays(currentDate, Math.round(days)), 'yyyy-MM-dd')
  }

  /**
   * Calculates target fiber intake based on gender and age.
   *
   * @param {string} gender - 'm' or 'f'
   * @param {number} age - the age of the user
   * @returns {number} - the target fiber intake in grams
   */
  static targetFiber(gender, age) {
    let fiber

    switch (gender.toLowerCase()) {
      case 'm':
        fiber = 38
        if (age > 50) {
          fiber = 30
        }
        break
      case 'f':
        fiber = 25
        if (age > 50) {
          fiber = 21
        }
        break
      default:
        fiber = 0
        break
    }

    return fiber
  }

  /**
   * Calculates the recommended daily macros based on the daily kcal limit.
   *
   * @param {number} dailyLimit - the daily kcal limit
   * @returns {object} - the recommended daily macros
   */
  static targetMacros(dailyLimit) {
    const { protein, fat, carbohydrates } = CalcService.macros

    const proteinGrams = Math.round(dailyLimit * protein.rec_perc / protein.kcalPerGram)

    const fatGrams = Math.round(dailyLimit * fat.rec_perc / fat.kcalPerGram)

    const carbsGrams = Math.round(dailyLimit * carbohydrates.rec_perc / carbohydrates.kcalPerGram)

    return {
      protein: proteinGrams,
      fat: fatGrams,
      saturatedFat: 0,
      carbohydrates: carbsGrams,
      sugars: 0,
      salt: 0
    }
  }
}