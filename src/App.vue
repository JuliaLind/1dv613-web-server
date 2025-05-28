<script setup>
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import OrangeToast from './components/OrangeToast.vue'

</script>

<template>
  <div id="app-container">
    <RouterView />
    <!-- Default toast -->
    <Toast position="top-center" class="max-w-[90%] mx-auto" />

    <!-- Custom orange toast -->
    <Toast
      position="top-center"
      group="orange"
      class="max-w-[90%] mx-auto"
    >
      <template #message="slotProps">
        <OrangeToast :message="slotProps.message" />
      </template>
    </Toast>
  </div>
  
</template>

<style scoped>
#app-container {
  width: 100%;
  max-width: 768px;
  min-height: 100vh;
  background-color: var(--white);
}
</style>
