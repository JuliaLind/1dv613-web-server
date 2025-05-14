<script setup>
import { Food } from '@/models/Food.js'

const props = defineProps({
  food: {
    type: Food,
    required: true,
  }
})

const food = props.food.clone()

// TODO replace InputNumber and Select with native HTML elements
// see if solves problem with foodlist randomly opening

</script>

<template>
  <div v-if="food" class="food-detail">
    <header>
      <form>
        <InputNumber v-model="food.weight.value" inputId="integeronly" id="weight" :min="0" :max="5000"
          @input="e => food.weight.value = e.value" fluid class="weight" />
        <Select v-model="food.unit.value" :options="Food.UNITS" optionValue="code" optionLabel="name"
          @change="e => food.unit.value = e.value" class="unit" />
        <Button @click="$emit('done', food.toData())" class="save-btn" :aria-label="'Add'" icon="pi pi-check" fluid />
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
          <td class="number">{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
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