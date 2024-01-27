<template>
  <li class="resource-item">
    <h3>{{ resource.title }}</h3>
    <p>{{ resource.description }}</p>
    <button @click="emitDeleteResource" aria-label="Delete Resource">Delete</button>
  </li>
</template>

<script>
export default {
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  methods: {
    emitDeleteResource() {
      this.$emit('deleteResource', this.resource.id);
    }
  }
};
</script>

<style scoped>
.resource-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: var(--border-radius-base);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.resource-item h3 {
  margin: 0 0 10px 0;
}

.resource-item p {
  margin: 0;
}

.resource-item button {
  padding: 5px 10px;
  margin-top: 10px;
  background-color: var(--error-color);
  border: none;
  border-radius: var(--border-radius-base);
  color: white;
  cursor: pointer;
}

.resource-item button:hover {
  background-color: var(--warning-color);
}
</style>
