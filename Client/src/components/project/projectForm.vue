<template>
  <form @submit.prevent="submitForm">
    <h2>{{ formTitle }}</h2>
    <label for="title">Title</label>
    <input type="text" id="title" v-model="localFormData.title" required />

    <label for="description">Description</label>
    <textarea id="description" v-model="localFormData.description" required></textarea>

    <label for="difficulty">Difficulty</label>
    <select id="difficulty" v-model="localFormData.difficulty" required>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>

    <label for="status">Status</label>
    <select id="status" v-model="localFormData.status" required>
      <option value="Active">Active</option>
      <option value="Completed">Completed</option>
      <option value="Pending">Pending</option>
    </select>

    <label for="deadline">Deadline</label>
    <input type="date" id="deadline" v-model="localFormData.deadline" />

    <button type="submit">{{ formAction }}</button>
  </form>
</template>

<script>


export default {
  props: {
    formData: Object,
    formAction: String,
  },
  data() {
    return {
      localFormData: { ...this.formData }, // Create a local copy of formData
    };
  },
  computed: {
    formTitle() {
      return this.formAction === 'Create' ? 'Create New Project' : 'Edit Project';
    },
  },
  methods: {
    submitForm() {
      // Emit an event to send the localFormData back to the parent component
      this.$emit('submit', this.localFormData);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/main.scss";

/* Additional styling for ProjectForm.vue if needed */
form {
  background-color: $light-color;
  border: 1px solid $secondary-color;
  border-radius: $border-radius-base;
  padding: 20px;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-top: 10px;
}

input[type="text"],
textarea,
select,
input[type="date"] {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
}

button {
  margin-top: 10px;
  background-color: $primary-color;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: $border-radius-base;
  cursor: pointer;
}

button:hover {
  background-color: darken($primary-color, 10%);
}
</style>
