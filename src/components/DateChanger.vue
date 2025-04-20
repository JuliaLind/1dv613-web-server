<script setup>
import { ref, onMounted, computed, defineProps } from 'vue'
import { addDays, subDays, format } from 'date-fns'


const { date } = defineProps({
  date: {
    type: String,
    required: true
  },
})

const emit = defineEmits(['update'])

const currentDate = ref(new Date(date))

function next() {
  currentDate.value = addDays(currentDate.value, 1)
  update()
}

function prev() {
  currentDate.value = subDays(currentDate.value, 1)
  update()
}

const formattedDate = computed(() => {
  return format(currentDate.value, 'yyyy-MM-dd')
})

const weekday = computed(() => {
  return format(currentDate.value, 'EEEE')
})

function update() {
  emit('update', formattedDate.value)
}



</script>

<template>
    <div id="date-picker" class="flex items-center justify-center gap-4">
      <Button @click="prev" class="p-button-text text-xl text-slate-800 primary-color primary-color-text"
        :aria-label="'Previous date'" icon="pi pi-chevron-left" />
      <span>{{ weekday }}</span>
      <span>{{ formattedDate }}</span>
      <Button @click="next" class="p-button-text text-xl text-slate-800 primary-color" :aria-label="'Next date'"
        icon="pi pi-chevron-right" />
    </div>
</template>
