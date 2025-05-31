<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: Object
})

const colorClass = computed(() => {
  switch (props.message.severity) {
    case 'success':
      return 'p-toast-message-success'
    case 'error':
      return 'p-toast-message-error'
    case 'warn':
      return 'p-toast-message-warn'
    case 'info':
      return 'p-toast-message-info'
    default:
      return ''
  }
})

const getOrangeIcon = (severity, key) => {
  const base = import.meta.env.BASE_URL || '/'

  return `${base}img/orange-${ key ?? severity }.png`

}
</script>

<template>
  <div class="orange-toast p-toast-message" :class="colorClass">
    <img
      class="orange-toast-icon"
      :src="getOrangeIcon(message.severity, message.key)"
      alt="orange icon"
    />
    <div class="orange-toast-text">
      <p class="orange-toast-summary p-toast-summary">{{ message.summary }}</p>
      <p class="orange-toast-detail p-toast-detail">{{ message.detail }}</p>
    </div>
  </div>
</template>

<style scoped>
:root {
  --toast-text: var(--grey-800);
  --toast-detail-text: var(--grey-600);
}

.orange-toast {
  display: flex;
  align-items: center;
  position: relative;
  gap: 12px;
  border-radius: 8px;
  box-shadow: none;
  color: var(--toast-text);
  width: 100%;
  box-sizing: border-box;
  border: 0;
}

.orange-toast-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  object-fit: contain;
}

.orange-toast-text {
  flex: 1;
  min-width: 0;
}

.orange-toast-summary {
  font-weight: bold;
  margin: 0;
  font-size: 14px;
  color: var(--toast-text);
}

.orange-toast-detail {
  font-size: 13px;
  margin: 0;
  color: var(--toast-detail-text);
}
</style>
