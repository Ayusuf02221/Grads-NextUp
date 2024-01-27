<template>
    <div>
      <div class="project-ideas">
        <h2>Easy Project Ideas</h2>
        <ul>
          <li v-for="idea in easyProjectIdeas" :key="idea.id">{{ idea.title }}</li>
        </ul>
      </div>
  
      <div class="project-ideas">
        <h2>Medium Project Ideas</h2>
        <ul>
          <li v-for="idea in mediumProjectIdeas" :key="idea.id">{{ idea.title }}</li>
        </ul>
      </div>
  
      <div class="project-ideas">
        <h2>Hard Project Ideas</h2>
        <ul>
          <li v-for="idea in hardProjectIdeas" :key="idea.id">{{ idea.title }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        easyProjectIdeas: [],
        mediumProjectIdeas: [],
        hardProjectIdeas: [],
      };
    },
    mounted() {
      this.fetchProjectIdeas('easy');
      this.fetchProjectIdeas('medium');
      this.fetchProjectIdeas('hard');
    },
    methods: {
      async fetchProjectIdeas(difficulty) {
        try {
          const response = await axios.get(`/project-${difficulty}`);
          if (difficulty === 'easy') {
            this.easyProjectIdeas = response.data;
          } else if (difficulty === 'medium') {
            this.mediumProjectIdeas = response.data;
          } else if (difficulty === 'hard') {
            this.hardProjectIdeas = response.data;
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  /* Import main.scss styles */
  @import "@/assets/styles/main.scss";
  
  /* Add any additional styling here if needed */
  .project-ideas {
    margin-bottom: 20px;
  }
  
  .project-ideas ul {
    list-style: none;
    padding: 0;
  }
  
  .project-ideas li {
    margin-bottom: 5px;
  }
  </style>
  