<template>
  <div>
    <div class="filter-options">
      <!-- Add any filter UI here if required -->
    </div>

    <div class="interview-list">
      <InterviewItem
        v-for="interview in interviews"
        :key="interview.interviewId"
        :interview="interview"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import InterviewItem from './InterviewItem.vue';

export default {
  components: {
    InterviewItem
  },
  data() {
    return {
      interviews: []
    };
  },
  async created() {
    try {
      const response = await axios.get('/api/interviews'); // Adjust the endpoint as necessary
      this.interviews = response.data;
    } catch (error) {
      console.error('Error fetching interviews:', error);
      // Handle errors appropriately
    }
  }
};
</script>

<style scoped>
@import "@/assets/styles/main.scss";

/* .filter-options {
  // Add filter styles here when ready
}

.interview-list {
  // Styles for interview list container here when ready
} */
</style>
