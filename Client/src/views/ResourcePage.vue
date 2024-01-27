<template>
  <div class="resource-page">
    <site-header></site-header>

    <div class="container">
      <resource-filter @filter="fetchResources"></resource-filter>

      <ul class="resource-list">
        <resource-item
          v-for="resource in filteredResources"
          :key="resource.id"
          :resource="resource"
          @deleteResource="deleteResource"
        ></resource-item>
      </ul>

      <base-button v-if="isLoggedIn" @click="navigateToAddResource" btnType="success">Add Resource</base-button>
    </div>

    <site-footer></site-footer>
  </div>
</template>

<script>
import SiteHeader from '@/components/common/AppHeader.vue';
import SiteFooter from '@/components/common/AppFooter.vue';
import BaseButton from '@/components/common/AppButton.vue';
import ResourceItem from '@/components/resource/ResourceItem.vue';
import ResourceFilter from '@/components/resource/ResourceFilter.vue';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  components: {
    SiteHeader,
    SiteFooter,
    BaseButton,
    ResourceItem,
    ResourceFilter
  },
  data() {
    return {
      resources: []
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn']) // Assuming 'isLoggedIn' is a getter in Vuex store
  },
  mounted() {
    this.fetchResources();
  },
  methods: {
    async fetchResources(filterParams = {}) {
      try {
        const response = await axios.get('/api/resources', { params: filterParams }); // Adjusted to relative path
        this.resources = response.data;
      } catch (error) {
        this.handleError(error, 'Error fetching resources');
      }
    },
    async deleteResource(resourceId) {
      try {
        await axios.delete(`/api/resources/${resourceId}`);
        this.fetchResources();
      } catch (error) {
        this.handleError(error, 'Error deleting resource');
      }
    },
    navigateToAddResource() {
      this.$router.push({ name: 'addResource' }); // Adjust the route name as per your routing setup
    },
    handleError(error, defaultMessage) {
      console.error(error);
      alert(defaultMessage); // Replace with a more sophisticated error handling approach
    }
  }
};
</script>

<style scoped>
@import "@/assets/styles/main.scss";

.resource-page .container {
  padding: 20px;
}

.resource-list {
  list-style-type: none;
  padding: 0;
}

/* Additional styles can be added here */
</style>
