<script setup>
import LoginForm from '@/components/login/LoginForm.vue'
</script>

<template>
  <main>
    <h1>Log in</h1>
    <LoginForm />
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
}

h1 {
  font-size: var(--text-2xl);
  font-weight: var(--bold);
  color: var(--grey-800);
  margin-bottom: 1.5rem;
  text-align: center;
}
</style>
