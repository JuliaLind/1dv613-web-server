<script setup>
import MacroTable from './MacroTable.vue'
import MacroChart from './MacroChart.vue'
</script>


<template>
  <div class="flex-container">
    <MacroTable/>
    <MacroChart/>
  </div>
</template>

<style scoped>

.flex-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
}

</style>