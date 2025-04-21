<script setup>
import { defineProps, ref, defineEmits } from 'vue'
import FoodDetail from '@/components/FoodDetail.vue'
import { weightedValue } from '@/helpers/nutrients'

const { food } = defineProps({
  food: {
    type: Object,
    required: true
  }
})


const kcal = weightedValue(food.weight, food.kcal_100g)

const edit = ref(false)
const menu = ref()

function toggleMenu(event) {
  menu.value.toggle(event)
}

defineEmits(['delete', 'update'])

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

  <FoodDetail v-if="edit" :info="food" @done="$emit('update', food); edit = false" />
</template>

<style scoped></style>