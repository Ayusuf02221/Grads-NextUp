<template>
    <div class="dashboard">
      <site-header></site-header>
      <div class="container">
        <h1>Welcome, {{ userName }}</h1>
        <div class="real-time-updates">
          <websocket-handler></websocket-handler>
        </div>
        <div class="user-details">
          <h2>Your Profile</h2>
          <p>Email: {{ userProfile.email }}</p>
          <p>Last Login: {{ userProfile.lastLogin }}</p>
          <!-- More user details here -->
        </div>
      </div>
      <site-footer></site-footer>
    </div>
  </template>
  
  <script>
  import SiteHeader from '@/components/common/AppHeader.vue';
  import SiteFooter from '@/components/common/AppFooter.vue';
  import WebsocketHandler from '@/components/realtime/WebsocketHandler.vue';
  import { mapActions, mapState } from 'vuex';
  
  export default {
    components: {
      SiteHeader,
      SiteFooter,
      WebsocketHandler
    },
    data() {
      return {
        userProfile: {}
      };
    },
    computed: {
      ...mapState('user', ['user']),
      userName() {
        return this.user ? this.user.name : '';
      }
    },
    methods: {
      ...mapActions('user', ['fetchUserProfile']),
      async getUserProfile() {
        try {
          const userId = this.user ? this.user.id : '';
          const response = await this.fetchUserProfile(userId);
          this.userProfile = response.data;
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    },
    created() {
      this.getUserProfile();
    }
  };
  </script>
  
  <style scoped>
  @import "@/assets/styles/main.scss";
  
  .dashboard {
    .container {
      max-width: 1200px;
      margin: auto;
      padding: 20px;
    }
  
    .real-time-updates {
      margin-top: 20px;
    }
  
    .user-details {
      margin-top: 20px;
    }
  }
  </style>
  