<script setup>
import { defineProps, ref, defineEmits, computed } from 'vue'
import FoodDetail from '@/components/FoodDetail.vue'
import { weightedValue } from '@/helpers/nutrients'
import { fnWrapper } from '@/helpers/helpers'
import { MealService } from '@/services/meal.service.js'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { createToastService } from '@/services/toast.service'

const router = useRouter()
const toast = useToast()
const toastService = createToastService(toast)
const mealService = new MealService()

const props = defineProps({
  food: {
    type: Object,
    required: true
  },
  mealId: {
    type: String,
    required: true,
  }
})

/**
 * Handles errors by checking the status code.
 * If the status code is 401, it redirects to the login page.
 *
 * @param {Error} error - the error object 
 */
function handleError(error) {
  if (error.status === 401) {
    router.push('/login')
    toastService.alertError('Session expired', 'Please login again')
    return
  }
  toastService.alertError('Something went wrong', 'Please try again later')
}

/**
 * Updates the wright and unit of the food item.
 */
async function updFoodItem() {
  const { id, weight, unit } = props.food
  await mealService.updFoodItem(props.mealId, { id, weight, unit })
}



const kcal = computed(() => {
  return weightedValue(props.food.weight, props.food.kcal_100g)
})
const edit = ref(false)
const menu = ref()

/**
 * Toggles the menu with edit and delete options.
 *
 * @param {PointerEvent} event - click event 
 */
function toggleMenu(event) {
  menu.value.toggle(event)
}

defineEmits(['delete'])

</script>

<template>
  <div class="w-full text-left flex flex-row gap-4 relative">
    <img v-if="food.img?.sm" :src="food.img.sm" :alt="food.name" class="w-10 h-10 object-cover rounded-sm" />

    <div class="flex flex-col w-full">
      <span class="font-semibold text-sm capitalize">
        {{ food.name }}, {{ food.brand ?? '' }}
      </span>
      <span class="text-sm">
        {{ food.weight }} {{ food.unit }} = {{ kcal }} kcal
      </span>
    </div>

    <Button icon="pi pi-ellipsis-v" @click="toggleMenu($event)" text rounded class="self-start" />

    <OverlayPanel ref="menu" :dismissable="true">
      <div class="flex flex-col gap-2">
        <Button label="Edit" text @click="edit = true; $refs.menu.hide()" />
        <Button label="Delete" text severity="danger" @click="$emit('delete'); $refs.menu.hide()" />
      </div>
    </OverlayPanel>
  </div>

  <FoodDetail v-if="edit" :info="food" @done="fnWrapper(updFoodItem, handleError); edit = false" />
</template>

<style scoped></style>