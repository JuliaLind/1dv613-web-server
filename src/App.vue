<script setup>
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'

</script>

<template>
  <div id="app-container">
    <RouterView />
    <Toast position="top-center" class="max-w-[90%] mx-auto" />
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
