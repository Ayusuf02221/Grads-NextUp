<template>
    <div class="user-profile-page">
      <site-header></site-header>
      <div class="container">
        <h1>User Profile</h1>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="userProfile.email" disabled>
          </div>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="userProfile.name" required>
          </div>
          <!-- Add more fields as needed -->
          <button type="submit" class="btn btn-primary">Update Profile</button>
        </form>
      </div>
      <site-footer></site-footer>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import SiteHeader from '@/components/common/AppHeader.vue';
  import SiteFooter from '@/components/common/AppFooter.vue';
  
  export default {
    components: {
      SiteHeader,
      SiteFooter
    },
    data() {
      return {
        userProfile: {
          email: '',
          name: '',
          // Other fields
        },
        userId: 'user-id', // Fetch this from auth state or route params
      };
    },
    created() {
      this.fetchUserProfile();
    },
    methods: {
      async fetchUserProfile() {
        try {
          const response = await axios.get(`/api/users/${this.userId}`);
          this.userProfile = response.data;
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Handle error
        }
      },
      async updateProfile() {
        try {
          await axios.put(`/api/users/${this.userId}`, this.userProfile);
          alert('Profile updated successfully');
          // Optionally, fetch updated profile here
        } catch (error) {
          console.error('Error updating profile:', error);
          // Handle error
        }
      }
    }
  };
  </script>
  
  <style scoped>
  @import "@/assets/styles/main.scss";
  
  .user-profile-page .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input[type="email"], input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: var(--border-radius-base);
  }
  
  button.btn {
    /* Your button styles */
  }
  </style>
  