// authService.js
import axios from 'axios';

const COGNITO_ENDPOINT = 'https://q6xyacf95e.execute-api.eu-west-2.amazonaws.com/default';

export default {
  async login(email, password) {
    try {
      const response = await axios.post(`${COGNITO_ENDPOINT}/login`, { email, password });
      return response.data;
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  },

  async logout() {
    try {
      // Assuming there's a backend endpoint to handle logout
      await axios.post(`${COGNITO_ENDPOINT}/logout`);
    } catch (error) {
      throw new Error('Logout failed: ' + error.message);
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(`${COGNITO_ENDPOINT}/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error('Registration failed: ' + error.message);
    }
  },

  async resetPassword(email) {
    try {
      const response = await axios.post(`${COGNITO_ENDPOINT}/resetPassword`, { email });
      return response.data;
    } catch (error) {
      throw new Error('Password reset failed: ' + error.message);
    }
  },

  async confirmResetPassword(email, code, newPassword) {
    try {
      const response = await axios.post(`${COGNITO_ENDPOINT}/confirmResetPassword`, {
        email,
        code,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error('Confirming password reset failed: ' + error.message);
    }
  },

  async verifyEmail(email, code) {
    try {
      const response = await axios.post(`${COGNITO_ENDPOINT}/verifyEmail`, { email, code });
      return response.data;
    } catch (error) {
      throw new Error('Email verification failed: ' + error.message);
    }
  },
};
