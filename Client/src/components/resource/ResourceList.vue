<template>
  <div>
    <resource-filter @filter="fetchResources"></resource-filter>
    <ul>
      <resource-item v-for="resource in resources" :key="resource.id" :resource="resource" @deleteResource="deleteResource"></resource-item>
    </ul>
  </div>
</template>

<script>
import ResourceItem from './ResourceItem.vue';
import ResourceFilter from './ResourceFilter.vue';
import axios from 'axios';

export default {
  components: {
    ResourceItem,
    ResourceFilter
  },
  data() {
    return {
      resources: []
    };
  },
  mounted() {
    this.fetchResources();
  },
  methods: {
    async fetchResources(filterParams = {}) {
      try {
        const response = await axios.get('https://rzrg8bxxpl.execute-api.eu-west-2.amazonaws.com/default/listResources', { params: filterParams });
        this.resources = response.data;
      } catch (error) {
        console.error('Error fetching resources:', error);
        // Implement user-friendly error handling
      }
    },
    async deleteResource(resourceId) {
      try {
        await axios.delete(`https://rzrg8bxxpl.execute-api.eu-west-2.amazonaws.com/default/deleteResource/${resourceId}`);
        this.fetchResources(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting resource:', error);
        // Implement user-friendly error handling
      }
    }
  }
};
</script>

<style>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
