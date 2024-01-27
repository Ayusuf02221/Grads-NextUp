// modules/user.js
import axios from 'axios';
import authService from '@/services/authService'; // Import your authentication service
import store from '@/store'; // Import the main store to access showLoginModal action

const state = {
  isAuthenticated: false,
  user: null,
};

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  currentUser: state => state.user,
};

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await authService.login(credentials.email, credentials.password);
      commit('SET_AUTH', { isAuthenticated: true, user: response.data.user });
    } catch (error) {
      console.error('Login failed:', error);
    }
  },

  async logout({ commit }) {
    try {
      await authService.logout();
      commit('SET_AUTH', { isAuthenticated: false, user: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  async register({ commit }, userData) {
    try {
      const response = await authService.register(userData);
      // Handle registration response. Example:
      commit('SET_AUTH', { isAuthenticated: true, user: response.data.user });
      // Show the login modal after registration (if needed)
      store.dispatch('showLoginModal');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  },

  async forgotPassword({ commit }, email) {
    try {
      await authService.forgotPassword(email);
      // Handle forgot password response. Example:
      commit('SET_FORGOT_PASSWORD_STATUS', true);
    } catch (error) {
      console.error('Forgot Password failed:', error);
    }
  },

  async resetPassword({ commit }, resetData) {
    try {
      await authService.resetPassword(resetData);
      // Handle reset password response. Example:
      commit('SET_RESET_PASSWORD_STATUS', true);
    } catch (error) {
      console.error('Reset Password failed:', error);
    }
  },

  // Other actions as needed...
};

const mutations = {
  SET_AUTH(state, { isAuthenticated, user }) {
    state.isAuthenticated = isAuthenticated;
    state.user = user;
  },
  SET_FORGOT_PASSWORD_STATUS(state, status) {
    // Optional: Update state related to forgot password status
  },
  SET_RESET_PASSWORD_STATUS(state, status) {
    // Optional: Update state related to reset password status
  },
  // Other mutations as needed...
};

export default {
  state,
  getters,
  actions,
  mutations,
};
