<template>
  <div class="resource-filter">
    <input type="text" v-model="filterText" placeholder="Filter resources...">
    <input type="checkbox" v-model="interviewPrepOnly" id="interview-prep">
    <label for="interview-prep">Interview Prep Only</label>
    <button @click="applyFilter">Filter</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterText: '',
      interviewPrepOnly: false
    };
  },
  methods: {
    applyFilter() {
      this.$emit('filter', {
        query: this.filterText,
        interviewPrep: this.interviewPrepOnly
      });
    }
  }
};
</script>

<style scoped>
.resource-filter {
  margin-bottom: 20px;
}

.resource-filter input,
.resource-filter label {
  padding: 8px;
  margin: 0 5px;
}

.resource-filter button {
  padding: 8px 15px;
  background-color: var(--success-color);
  border: none;
  border-radius: var(--border-radius-base);
  color: white;
  cursor: pointer;
}

.resource-filter button:hover {
  background-color: var(--primary-color);
}
</style>
