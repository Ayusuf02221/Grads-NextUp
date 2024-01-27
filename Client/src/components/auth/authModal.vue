<template>
    <div class="auth-modal">
      <!-- Toggle between Login, Register, Forgot Password based on the state -->
      <div v-if="currentForm === 'login'">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <input type="email" v-model="loginData.email" placeholder="Email" required />
          <input type="password" v-model="loginData.password" placeholder="Password" required />
          <button type="submit">Login</button>
          <p @click="switchForm('forgotPassword')">Forgot Password?</p>
          <p @click="switchForm('register')">Don't have an account? Register</p>
        </form>
      </div>
  
      <div v-if="currentForm === 'register'">
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
          <input type="email" v-model="registerData.email" placeholder="Email" required />
          <input type="password" v-model="registerData.password" placeholder="Password" required />
          <button type="submit">Register</button>
          <p @click="switchForm('login')">Already have an account? Login</p>
        </form>
      </div>
  
      <div v-if="currentForm === 'forgotPassword'">
        <h2>Forgot Password</h2>
        <form @submit.prevent="handleForgotPassword">
          <input type="email" v-model="forgotPasswordData.email" placeholder="Email" required />
          <button type="submit">Send Reset Link</button>
          <p @click="switchForm('login')">Back to Login</p>
        </form>
      </div>
  
      <div v-if="currentForm === 'confirmNewPassword'">
        <h2>Reset Password</h2>
        <form @submit.prevent="handleResetPassword">
          <input type="email" v-model="resetPasswordData.email" placeholder="Email" required />
          <input type="text" v-model="resetPasswordData.verificationCode" placeholder="Verification Code" required />
          <input type="password" v-model="resetPasswordData.newPassword" placeholder="New Password" required />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        currentForm: 'login',
        loginData: { email: '', password: '' },
        registerData: { email: '', password: '' },
        forgotPasswordData: { email: '' },
        resetPasswordData: { email: '', verificationCode: '', newPassword: '' }
      };
    },
    methods: {
      switchForm(form) {
        this.currentForm = form;
      },
      async handleLogin() {
        // Integrate with backend login endpoint
        try {
          const response = await axios.post('https://q6xyacf95e.execute-api.eu-west-2.amazonaws.com/default/login', this.loginData);
          // Handle successful login, e.g., storing auth token, redirecting, etc.
        } catch (error) {
          console.error('Login error:', error);
          // Handle login failure
        }
      },
      async handleRegister() {
        // Integrate with backend register endpoint
        try {
          const response = await axios.post(' https://q6xyacf95e.execute-api.eu-west-2.amazonaws.com/default/register', this.registerData);
          // Handle successful registration
          this.switchForm('login');
        } catch (error) {
          console.error('Registration error:', error);
          // Handle registration failure
        }
      },
      async handleForgotPassword() {
        // Integrate with backend forgot password endpoint
        try {
          const response = await axios.post('https://q6xyacf95e.execute-api.eu-west-2.amazonaws.com/default/forgotPassword', this.forgotPasswordData);
          // Handle successful request
          this.switchForm('confirmNewPassword');
        } catch (error) {
          console.error('Forgot password error:', error);
          // Handle forgot password failure
        }
      },
      async handleResetPassword() {
        // Integrate with backend confirm new password endpoint
        try {
          const response = await axios.post('https://q6xyacf95e.execute-api.eu-west-2.amazonaws.com/default/confirmNewPassword', this.resetPasswordData);
          // Handle successful password reset
          this.switchForm('login');
        } catch (error) {
          console.error('Reset password error:', error);
          // Handle reset password failure
        }
      }
    }
  };
  </script>
<style scoped lang="scss">
@import "@/assets/styles/main.scss";

.auth-modal {
  background-color: white;
  padding: 20px;
  width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000; /* Ensure it's above other content */
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    color: $primary-color;
    margin-bottom: 20px;
  }

  form {
    width: 100%;
  }

  input[type="email"],
  input[type="password"],
  input[type="text"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: $primary-color;
    color: white;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }

  p {
    margin-top: 15px;
    color: $info-color;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

  
