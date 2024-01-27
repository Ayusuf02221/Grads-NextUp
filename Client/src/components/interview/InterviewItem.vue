<template>
    <div class="interview-item">
      <h3>{{ interview.company }} - {{ interview.role }}</h3>
      <p>Date: {{ interview.date }}</p>
      <p>Type: {{ interview.interviewType }}</p>
      <p>{{ interview.experience }}</p>
      <!-- Add more fields as necessary -->
    </div>
  </template>
  
  <script>
  export default {
    props: {
      interview: {
        type: Object,
        required: true
      }
    }
  };
  </script>
