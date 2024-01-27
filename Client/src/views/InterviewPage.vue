<template>
  <div class="interview-prep-page">
    <site-header></site-header>

    <div class="container">
      <h1>Interview Preparation</h1>

      <div class="filter-options">
        <!-- Implement filter UI -->
      </div>

      <div class="interview-list">
        <interview-item
          v-for="interview in interviews"
          :key="interview.interviewId"
          :interview="interview"
        />
      </div>

      <div v-if="isLoggedIn">
        <h2>Share Your Experience</h2>
        <form @submit.prevent="addInterviewExperience">
          <input type="text" v-model="newExperience.company" placeholder="Company" required>
          <input type="text" v-model="newExperience.role" placeholder="Role" required>
          <textarea v-model="newExperience.experience" placeholder="Share your experience" required></textarea>
          <button type="submit">Submit Experience</button>
        </form>
      </div>
    </div>

    <site-footer></site-footer>
  </div>
</template>

<script>
import axios from 'axios';
import SiteHeader from '@/components/common/AppHeader.vue';
import SiteFooter from '@/components/common/AppFooter.vue';
import InterviewItem from '@/components/interview/InterviewItem.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    SiteHeader,
    SiteFooter,
    InterviewItem
  },
  data() {
    return {
      interviews: [],
      newExperience: {
        company: '',
        role: '',
        experience: ''
      }
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  async created() {
    await this.fetchInterviews();
  },
  methods: {
    async fetchInterviews() {
      try {
        const response = await axios.get('/api/interviews');
        this.interviews = response.data;
      } catch (error) {
        alert('Error fetching interviews');
      }
    },
    async addInterviewExperience() {
      try {
        await axios.post('/api/interviews', this.newExperience);
        this.fetchInterviews();
        alert('Interview experience added successfully.');
      } catch (error) {
        alert('Error adding interview experience');
      }
    }
  }
};
</script>

<style scoped>
@import "@/assets/styles/main.scss";

.interview-prep-page .container {
  padding: 20px;
}

/* Additional styles for filter options, interview list, and form */
.filter-options {
  /* Styles for filter UI */
}

.interview-list {
  /* Styles for interview list */
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input, textarea {
  padding: 8px;
  border-radius: var(--border-radius-base);
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-base);
  cursor: pointer;
}
</style>
