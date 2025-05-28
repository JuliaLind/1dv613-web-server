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

  if (severity === 'info' && key === 'daily') {
    return `${base}img/orange-daily.png`
  }

  const iconMap = {
    success: `${base}img/orange-success.png`,
    error: `${base}img/orange-error.png`,
    warn: `${base}img/orange-warning.png`,
    info: `${base}img/orange-info.png`
  }

  return iconMap[severity] || iconMap.info
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
  --toast-border-success: var(--green-600);
  --toast-border-error: var(--red-600);
  --toast-border-warn: var(--primary-400);
  --toast-border-info: var(--primary-600);
  --toast-border-default: var(--grey-300);

  --toast-text: var(--grey-800);
  --toast-detail-text: var(--grey-600);
  --toast-shadow: var(--light-shadow);
  --toast-bg: var(--white);
}

.orange-toast {
  display: flex;
  align-items: center;
  position: relative;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: var(--toast-bg);
  border: 2px solid var(--toast-border-default);
  box-shadow: 0 2px 8px var(--toast-shadow);
  color: var(--toast-text);
  width: 100%;
  box-sizing: border-box;
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

.orange-toast-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 16px;
  color: var(--toast-detail-text);
  cursor: pointer;
}

.p-toast-message-success {
  border-color: var(--toast-border-success);
}

.p-toast-message-error {
  border-color: var(--toast-border-error);
  background-color: #fef2f2;
}

.p-toast-message-warn {
  border-color: var(--toast-border-warn);
  background-color: var(--primary-50);
}

.p-toast-message-info {
  border-color: var(--toast-border-info);
  background-color: var(--primary-50);
}

.p-toast-message-default {
  border-color: var(--toast-border-default);
}
</style>
