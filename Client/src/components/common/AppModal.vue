<template>
    <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <slot></slot> <!-- For dynamic content -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: Boolean
    },
    methods: {
      closeModal() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  @import "@/assets/styles/main.scss";
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
  
    .modal-content {
      background-color: #f8f9fa;  /* Direct value replacing $light-color */
      padding: 20px;
      border-radius: 4px;          /* Direct value replacing $border-radius-base */
      @include box-shadow;
    }
  }
  </style>