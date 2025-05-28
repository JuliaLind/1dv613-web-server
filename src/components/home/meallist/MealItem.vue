<script setup>
import { ref, computed } from 'vue'
import { handleError } from '@/helpers/helpers'
import { useToast } from 'primevue/usetoast'
import { Food } from '@/models/Food.js'
import { useDayStore } from '@/stores/day.store.js'
import ProductHeader from '../shared/ProductHeader.vue'
import ProductBody from '../shared/ProductBody.vue'

const store = useDayStore()
const toast = useToast()

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
 * Updates the weight and unit of the food item.
 *
 * @param {object} data - associative array with the new weight and unit
 */
async function upd(data) {
  try {
    await store.updMealItem(props.mealId, data)
  } catch (error) {
    handleError(error, toast)
  }
  edit.value = false


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
  <div class="meal-item">
    <ProductHeader :img="food.imgUrl" :name="food.name" :brand="food.brand" :kcal="food.kcal" :weight="food.weight" />

    <Button icon="pi pi-ellipsis-v" aria-label="Show actions" @click="toggleMenu($event)" text rounded
      class="self-start action-btn" />

    <OverlayPanel ref="menu" :dismissable="true">
      <div class="btn-container">
        <Button label="Edit" text @click="edit = true; $refs.menu.hide()" class="edit-fooditem-btn" />
        <Button label="Delete" text severity=" danger" @click="$emit('delete'); $refs.menu.hide()"
          class="delete-fooditem-btn" />
      </div>
    </OverlayPanel>
  </div>

  <ProductBody v-if="edit" :food="food" @done="upd" />
</template>

<style scoped>
.btn-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meal-item {
  display: flex;
}
</style>