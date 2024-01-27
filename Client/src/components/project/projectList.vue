<template>
  <div>
    <div class="project-filter">
      <select v-model="selectedDifficulty" @change="filterProjects">
        <option value="">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>

    <ul>
      <li v-for="project in filteredProjects" :key="project.projectId">
        <project-item :project="project" @refresh="fetchProjects" />
      </li>
    </ul>
  </div>
</template>

<script>
import ProjectItem from './projectItem.vue';
import axios from 'axios';

export default {
  components: { ProjectItem },
  data() {
    return {
      projects: [],
      filteredProjects: [],
      selectedDifficulty: ''
    };
  },
  async created() {
    await this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await axios.get('/project');
        this.projects = response.data;
        this.filterProjects();
      } catch (error) {
        console.error(error);
      }
    },
    filterProjects() {
      if (this.selectedDifficulty) {
        this.filteredProjects = this.projects.filter(
          (project) => project.difficulty === this.selectedDifficulty
        );
      } else {
        this.filteredProjects = this.projects;
      }
    }
  }
};
</script>

<style scoped>
/* Import the main.scss styles */
@import "@/assets/styles/main.scss";

/* Add any specific styles for this component if needed */
.project-filter {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.project-filter select {
  flex-grow: 1;
  margin-right: 10px;
}
</style>
