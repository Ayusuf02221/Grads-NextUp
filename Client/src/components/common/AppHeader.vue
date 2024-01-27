<template>
  <header class="site-header">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <!-- Add other navigation links as needed -->
      </ul>
    </nav>
    <div class="auth-status">
      <!-- Authentication status logic -->
      <button v-if="!isLoggedIn" @click="openLoginModal">Login</button>
      <div v-else>
        <span>Welcome, {{ userName }}</span>
        <button @click="logout">Logout</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    userName() {
      const user = this.$store.getters.currentUser;
      return user ? user.name : '';
    },
  },
  methods: {
    openLoginModal() {
      // Dispatch an action to open the login modal
      this.$store.dispatch('showLoginModal');
      // Assuming you have an action in your store module to set loginModalVisible to true
    },
    logout() {
      this.$store.dispatch('logout');
      // You can add additional logout logic here if necessary
    },
  },
};
</script>




<style scoped>
@import "@/assets/styles/main.scss";

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #007bff; /* Direct value replacing $primary-color */
  color: white;

  ul {
    list-style-type: none;
    display: flex;

    li {
      margin-right: 20px;
    }
  }

  .auth-status {
    display: flex;
    align-items: center;

    span {
      margin-right: 10px;
      font-weight: bold;
    }

    button {
      padding: 5px 10px;
      background-color: #f8f9fa; /* Direct value replacing $light-color */
      border: 1px solid white;
      border-radius: 4px; /* Direct value replacing $border-radius-base */
      color: #007bff; /* Direct value replacing $primary-color */
      cursor: pointer;
      transition: background-color 0.3s, color 0.3s;

      &:hover {
        background-color: #e1e2e3; /* Manually darkened shade of #f8f9fa */
        color: white;
      }
    }
  }
}
</style>
