<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import ProductForm from '@/components/home/productlist/ProductForm.vue'
const visible = ref(false)
</script>
<template>
  <div class="missing-item">
    <p class="text-center">Didn't find what you were looking for?</p>
    <Button @click="visible = true" class=" btn-primary">Create new product</Button>
    <Dialog v-model:visible="visible" modal header="Register Product">
      <ProductForm @close="visible = false" @new-product="(product) => $emit('new-product', product)" />
    </Dialog>

  </div>
</template>
<style scoped>
.missing-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 8px;
  font-size: var(--text-xl);
}

.text-center {
  text-align: center;
  color: var(--primary-700);
  /* font-size: var(--text-base); */
  margin-bottom: 1rem;
}

/* button {
  text-transform: uppercase;
} */
</style>