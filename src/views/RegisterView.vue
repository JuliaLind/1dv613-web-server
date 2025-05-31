<script setup>
import RegisterForm from '@/components/register/RegisterForm.vue'
</script>

<template>
  <main>
    <h1>Create new account</h1>
    <RegisterForm />
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
  width: max-content;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
}

h1 {
  font-size: var(--text-2xl);
  font-weight: var(--bold);
  /* color: var(--grey-800); */
  margin-bottom: 1.5rem;
  text-align: center;
}
</style>
