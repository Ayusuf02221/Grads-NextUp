<template>
    <div class="project-item">
      <h3>{{ project.title }}</h3>
      <p>{{ project.description }}</p>
      <p>Difficulty: {{ project.difficulty }}</p>
      <p>Status: {{ project.status }}</p>
      <p>Deadline: {{ project.deadline }}</p>
      <button @click="editProject">Edit</button>
      <button @click="deleteProject">Delete</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      project: Object,
    },
    methods: {
      editProject() {
        // Implement logic to edit the project (e.g., navigate to a form with project data)
      },
      deleteProject() {
        if (confirm('Are you sure you want to delete this project?')) {
          axios
            .delete(`/deleteProject/${this.project.projectId}`)
            .then(() => {
              // Implement logic to update the project list after deletion
            })
            .catch((error) => {
              console.error('Error deleting project:', error);
            });
        }
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  @import "@/assets/styles/main.scss";
  
  /* Additional styling for ProjectItem.vue if needed */
  .project-item {
    background-color: $light-color;
    border: 1px solid $secondary-color;
    border-radius: $border-radius-base;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .project-item h3 {
    font-size: 1.25rem;
    margin-bottom: 5px;
  }
  
  .project-item button {
    margin-top: 10px;
  }
  </style>
  