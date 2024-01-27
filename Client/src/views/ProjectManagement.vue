<template>
    <div class="project-tracker">
      <h1>Project Tracker</h1>
  
      <!-- Filter and Search Section -->
      <div class="filter-section">
        <input type="text" v-model="searchTerm" placeholder="Search projects..." @input="filterProjects" />
        <select v-model="selectedDifficulty" @change="filterProjects">
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
  
      <!-- Project Listing -->
      <ul class="project-list">
        <li v-for="project in filteredProjects" :key="project.projectId">
          <project-item :project="project" @edit="openEditModal" @delete="deleteProject" />
        </li>
      </ul>
  
      <!-- Add Project Button -->
      <button class="btn btn-primary" @click="openCreateModal">Add Project</button>
  
      <!-- Project Form Modal -->
      <project-form-modal
        v-if="showProjectModal"
        :is-edit="isEdit"
        :project-data="currentProject"
        @close="closeProjectModal"
        @submit="submitProjectForm"
      />
    </div>
  </template>
  
  <script>
  import ProjectItem from '@/components/project/projectItem.vue';
  import ProjectFormModal from '@/components/project/projectForm.vue';
  import axios from 'axios';
  import websocketService from '@/services/websocketService.js';
  
  export default {
    components: { ProjectItem, ProjectFormModal },
    data() {
      return {
        projects: [],
        filteredProjects: [],
        searchTerm: '',
        selectedDifficulty: '',
        showProjectModal: false,
        isEdit: false,
        currentProject: {}
      };
    },
    created() {
      this.fetchProjects();
      websocketService.connect();
      websocketService.onMessage(this.handleProjectUpdates);
    },
    methods: {
      async fetchProjects() {
        try {
          const response = await axios.get('/api/projects');
          this.projects = response.data;
          this.filterProjects();
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      },
      filterProjects() {
        let tempProjects = this.projects.filter(
          project => project.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        if (this.selectedDifficulty) {
          tempProjects = tempProjects.filter(
            project => project.difficulty === this.selectedDifficulty
          );
        }
        this.filteredProjects = tempProjects;
      },
      openCreateModal() {
        this.isEdit = false;
        this.currentProject = {};
        this.showProjectModal = true;
      },
      openEditModal(project) {
        this.isEdit = true;
        this.currentProject = { ...project };
        this.showProjectModal = true;
      },
      closeProjectModal() {
        this.showProjectModal = false;
      },
      async submitProjectForm(projectData) {
        try {
          let response;
          if (this.isEdit) {
            response = await axios.put(`/api/projects/${projectData.projectId}`, projectData);
          } else {
            response = await axios.post('/api/projects', projectData);
          }
          this.fetchProjects();
          this.closeProjectModal();
          console.log(response.data.message);
        } catch (error) {
          console.error('Error submitting project:', error);
        }
      },
      async deleteProject(projectId) {
        try {
          const response = await axios.delete(`/api/projects/${projectId}`);
          this.fetchProjects();
          console.log(response.data.message);
        } catch (error) {
          console.error('Error deleting project:', error);
        }
      },
      handleProjectUpdates(message) {
        // Logic for handling real-time updates from WebSocket
        // This depends on the format of your WebSocket messages
        if (message.type === 'projectUpdate') {
          this.fetchProjects();
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .project-tracker {
    /* Styling for the project tracker page */
    padding: 20px;
  }
  
  .filter-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .project-list {
    list-style-type: none;
    padding: 0;
  }
  
  .btn {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  
    &:hover {
      background-color: darken(#007bff, 10%);
    }
  }
  </style>
  