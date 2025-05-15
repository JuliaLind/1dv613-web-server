<script setup>
import { Food } from '@/models/Food.js'

const props = defineProps({
  food: {
    type: Food,
    required: true,
  }
})

const food = props.food.clone()


</script>

<template>
  <div v-if="food" class="food-detail">
    <header>
      <form>
        <input type="number" :id="'weight'" :min="0" v-model="food.weight.value" class="weight" />
        <select v-model="food.unit.value" class="unit">
          <option v-for="unit in Food.UNITS" :key="unit.code" :value="unit.code">
            {{ unit.name }}
          </option>
        </select>
        <button type="button" @click="$emit('done', food.toData())" class="save-btn" aria-label="Add">
          <i class="pi pi-check"></i>
        </button>
      </form>
    </header>

    <table>
      <thead>
        <tr>
          <th>Nutrient</th>
          <th class="number">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in food.contents.value" :key="item.name">
          <td>{{ item.name }}</td>
          <td class="number">{{ item.value || 0 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.save-btn {
  background-color: var(--primary-500);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  box-shadow: 0 1px 2px var(--light-shadow);
  width: 100%;
  height: 100%;
}

.save-btn:hover {
  background-color: var(--primary-700);
}

.save-btn i {
  font-size: 1.25rem;
}

input[type="number"],
select {
  appearance: none;
  -moz-appearance: textfield;
  background-color: var(--white);
  border: 1px solid var(--grey-200);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: var(--text-base);
  color: var(--grey-800);
  box-shadow: 0 1px 2px var(--light-shadow);
  outline: none;
  width: 100%;
}

input[type="number"]:focus,
select:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 2px var(--primary-100);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
  appearance: auto;
}

input[type="number"] {
  text-align: right;
}

select {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2rem;
  cursor: pointer;
}

select,
option {
  text-align: center;
}

.food-detail {
  background-color: var(--white);
  border-radius: 0.5rem;
  box-shadow: var(--box-shadow);
  padding: var(--space-m);
  margin-bottom: var(--space-m);
}

header {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-xs);
}

form {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-xs);
}

table {
  margin-top: var(--space-m);
  min-width: 100%;
  font-size: var(--text-xs);
  text-align: left;
  border: 1px solid var(--grey-200);
  border-radius: var(--rounded-md);
  box-shadow: 0 1px 2px var(--light-shadow);
  overflow: hidden;
}

thead {
  background-color: var(--grey-50);
  color: var(--grey-700);
  font-weight: var(--bold);
  border-bottom: 1px solid var(--grey-200);
}

th,
td {
  padding: calc(var(--space-m)/2) var(--space-m);
}

td {
  color: var(--grey-800);
}

.number {
  text-align: right;
}

tbody {
  border-collapse: collapse;
}

tbody tr {
  border-bottom: 1px solid var(--grey-200);
}

tbody tr:last-child {
  border-bottom: none;
}

.weight {
  flex-basis: 5rem;
}

.unit,
.save-btn {
  flex-basis: 4rem;
}
</style>