<script setup>
import { ref, computed } from 'vue'
import { addDays, subDays, format } from 'date-fns'


const { date } = defineProps({
  date: {
    type: String,
    required: true
  },
})

const emit = defineEmits(['update'])
const currentDate = ref(new Date(date))

const formattedDate = computed(() => {
  return format(currentDate.value, 'yyyy-MM-dd')
})

const weekday = computed(() => {
  return format(currentDate.value, 'EEEE')
})

/**
 * Changes to next date
 */
function next() {
  currentDate.value = addDays(currentDate.value, 1)
  update(formattedDate.value)
}

/**
 * Changes to previous date
 */
function prev() {
  currentDate.value = subDays(currentDate.value, 1)
  update(formattedDate.value)
}

/**
 * Emits the new date to the parent component
 *
 * @param {string} date - The new date
 */
function update(date) {
  emit('update', date)
}

</script>

<template>
  <div id="date-picker" class="flex items-center justify-center gap-4">
    <Button @click="prev" class="p-button-text primary-color" :aria-label="'Previous date'" icon="pi pi-chevron-left" />
    <span>{{ weekday }}</span>
    <span>{{ formattedDate }}</span>
    <Button @click="next" class="p-button-text primary-color" :aria-label="'Next date'" icon="pi pi-chevron-right" />
  </div>
</template>
