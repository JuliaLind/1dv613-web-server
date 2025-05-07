<script setup>
import { ref, computed } from 'vue'
import FoodDetail from '@/components/FoodDetail.vue'
import { tryCatch } from '@/helpers/helpers'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { createToastService } from '@/services/toast.service'
import { Food } from '@/models/Food.js'
import { useDayStore } from '@/stores/day.store.js'

const store = useDayStore()


const router = useRouter()
const toast = useToast()
const toastService = createToastService(toast)

const props = defineProps({
  food: {
    type: Food,
    required: true
  },
  mealId: {
    type: String,
    required: true,
  }
})

const food = computed(() => {
  return props.food
})
const edit = ref(false)
const menu = ref()

/**
 * Handles errors by checking the status code.
 * If the status code is 401, it redirects to the login page.
 *
 * @param {Error} error - the error object 
 */
function handleError(error) {
  console.log(error)
  if (error.status === 401) {
    router.push('/login')
    toastService.alertError('Session expired', 'Please login again')
    return
  }
  toastService.alertError('Something went wrong', 'Please try again later')
}



/**
 * Updates the weight and unit of the food item.
 */
async function upd(data) {
  edit.value = false

  await store.updMealItem(props.mealId, data)
}


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
    <img v-if="food.imgUrl" :src="food.imgUrl" :alt="food.name" class="w-10 h-10 object-cover rounded-sm" />

    <div class="flex flex-col w-full">
      <span class="font-semibold text-sm capitalize">
        {{ food.name }}, {{ food.brand }}
      </span>
      <span class="text-sm">
        {{ food.weight }} {{ food.unit }} = {{ food.kcal }} kcal
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

  <FoodDetail v-if="edit" :food="food" @done="(data) => tryCatch(upd, handleError, data)" />
</template>

<style scoped></style>