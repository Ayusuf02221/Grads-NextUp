<template>
    <button :class="`btn ${btnType}`" @click="onClick">
      <slot></slot> <!-- Allows content to be inserted -->
    </button>
  </template>
  
  <script>
  export default {
    props: {
      btnType: {
        type: String,
        default: 'primary' // or other types like 'secondary', 'danger', etc.
      }
    },
    methods: {
      onClick() {
        this.$emit('click'); // Emit click event to parent
      }
    }
  };
  </script>
  
  <style scoped>
  @import "@/assets/styles/main.scss";
  
  .btn {
    padding: 10px 20px;
    border-radius: 4px;            /* Direct value replacing $border-radius-base */
    cursor: pointer;
    font-weight: bold;
    text-transform: uppercase;
    
    &.primary {
      background-color: #007bff;  /* Direct value replacing $primary-color */
      color: white;
    }
  
  }
  </style>
  