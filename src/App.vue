<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Toast from 'primevue/toast'

</script>

<template>
  <div class="w-full max-w-[768px] min-h-screen bg-white min-h-screen p-4">
     <RouterView />
     <Toast position="top-center" class="max-w-[90%] mx-auto" />
  </div>
</template>

<style scoped>

</style>
