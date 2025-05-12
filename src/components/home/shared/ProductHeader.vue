<script setup>
defineProps({
  img: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: false
  },
  kcal: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  }
})

</script>

<template>
  <div class="food-container">
    <img v-if="img" :src="img" :alt="name" />
    <div class="food-info">
      <span class="descr">
        {{ name }}, {{ brand ?? '' }}
      </span>
      <span class="food-kcal">
        {{ kcal }} kcal / {{ weight }} g
      </span>
    </div>
  </div>
</template>

<style scoped>
.descr {
  text-align: left;
  width: 100%;
  font-weight: var(--bold);
  color: var(--grey-700);
  text-transform: capitalize;
  font-size: var(--text-sm);
}

.food-kcal {
  text-align: left;
  width: 100%;
  color: var(--grey-500);
  font-size: var(--text-sm);
}

.food-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  width: 100%;
}

img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: calc(var(--space-m)/2);
}

.food-container {
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: row;
  gap: var(--space-m);
}
</style>
