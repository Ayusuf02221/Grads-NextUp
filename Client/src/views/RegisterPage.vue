<template>
    <div class="auth-container">
      <site-header></site-header>
  
      <div class="form-container">
        <h1>Register</h1>
        <form @submit.prevent="handleRegister">
          <input type="email" v-model="email" placeholder="Email" required />
          <input type="password" v-model="password" placeholder="Password" required />
          <base-button type="submit" btnType="primary">Register</base-button>
          <p class="auth-switch" @click="navigateTo('login')">Already have an account? Login</p>
        </form>
      </div>
  
      <site-footer></site-footer>
    </div>
  </template>
  
  <script>
  import SiteHeader from '@/components/common/AppHeader.vue';
  import SiteFooter from '@/components/common/AppFooter.vue';
  import BaseButton from '@/components/common/AppButton.vue';
  import authService from '@/services/authService';
  
  export default {
    components: {
      SiteHeader,
      SiteFooter,
      BaseButton
    },
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async handleRegister() {
        try {
          await authService.register({ email: this.email, password: this.password });
          alert('Registration successful'); // Replace with more user-friendly success message
          this.$router.push({ name: 'login' });
        } catch (error) {
          alert('Registration failed: ' + error.message); // Replace with more user-friendly error handling
        }
      },
      navigateTo(route) {
        this.$router.push({ name: route });
      }
    }
  };
  </script>
  
  <style scoped>
  @import "@/assets/styles/main.scss";
  
  .auth-container {
    .form-container {
      margin: auto;
      width: 300px;
      padding: 20px;
      background-color: $light-color;
      border-radius: $border-radius-base;
      box-shadow: @include box-shadow;
  
      h1 {
        @include responsive-font(1.5rem, 2rem);
        text-align: center;
        color: $primary-color;
      }
  
      input {
        width: 100%;
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid $secondary-color;
        border-radius: $border-radius-base;
      }
  
      .auth-switch {
        display: block;
        margin-top: 10px;
        color: $info-color;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  </style>
  