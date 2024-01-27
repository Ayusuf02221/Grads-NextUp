import { createStore } from 'vuex';
import axios from 'axios';

const apiEndpoint = 'https://q6xyacf95e.execute-api.eu-west-2.amazonaws.com/default'; // Replace with your API endpoint

const store = createStore({
  state() {
    return {
      user: null,
      loading: false,
      loginModalVisible: false,
    };
  },
  getters: {
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user,
    isLoading: state => state.loading,
    isLoginModalVisible: state => state.loginModalVisible,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_LOGIN_MODAL_VISIBLE(state, visible) {
      state.loginModalVisible = visible;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post(`${apiEndpoint}/login`, credentials);
        commit('SET_USER', response.data.user);
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    async register(_, userData) {
      try {
        await axios.post(`${apiEndpoint}/register`, userData);
        // Logic after successful registration
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    async forgotPassword(_, email) {
      try {
        await axios.post(`${apiEndpoint}/forgot-password`, { email });
        // Logic after successful password reset request
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    async resetPassword(_, { email, token, newPassword }) {
      try {
        await axios.post(`${apiEndpoint}/reset-password`, { email, token, newPassword });
        // Logic after successful password reset
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    logout({ commit }) {
      commit('SET_USER', null);
      // Additional logout logic
    },
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading);
    },
    showLoginModal({ commit }) {
      commit('SET_LOGIN_MODAL_VISIBLE', true);
    },
  },
});

export default store;
