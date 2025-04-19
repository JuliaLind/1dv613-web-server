<script setup>
import { defineProps, ref, defineEmits } from 'vue'


const props = defineProps({
  id: {
    type: String,
    required: true
  },
  ean: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: false
  },
  weight: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true
  },
  kcal_100g: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    required: false
  }
})

const kcal = Math.round(props.kcal_100g / 100 * props.weight)


// const emit = defineEmits(['delete', 'update'])


function handleClick() {
  // open the change weight moda
}

</script>

<template>
  <div class="w-full text-left flex flex-row gap-4">
    <img
    v-if="img"
    :src="img"
    :alt="name"
    class="w10 h-10 object-cover rounded-sm mb-2"
  >
    <div class="flex flex-col w-full">
      <span class="text-left w-full font-semibold text-sm capitalize">
        {{ name }}, {{ brand ?? '' }}
      </span>
      <span class="text-sm">{{ weight }} {{ unit }} = 
        {{ kcal }} kcal 
      </span>
    </div>
    <Button icon="pi pi-times" @click="$emit('delete')" text severity="warn" rounded class="absolute top-1 right-1 z-20 text-red-500" />

</div>
</template>

<style scoped>

</style>