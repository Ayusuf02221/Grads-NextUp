<template>
    <div class="websocket-handler">
      <h2>Real-time Updates</h2>
      <!-- Display messages or real-time data here -->
      <ul>
        <li v-for="message in messages" :key="message.messageId">
          {{ message.content }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        websocket: null,
        messages: [],  // Stores incoming messages
      };
    },
    created() {
      this.initializeWebSocket();
    },
    methods: {
      initializeWebSocket() {
        const websocketEndpoint = 'wss://n1r8c5f3xg.execute-api.eu-west-2.amazonaws.com/dev/'; // Replace with your WebSocket endpoint
        this.websocket = new WebSocket(websocketEndpoint);
  
        this.websocket.onopen = () => {
          console.log('WebSocket connection established');
          // Handle successful connection
        };
  
        this.websocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleIncomingMessage(data);
        };
  
        this.websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          // Handle WebSocket errors
        };
  
        this.websocket.onclose = () => {
          console.log('WebSocket connection closed');
          // Handle connection closure
        };
      },
      handleIncomingMessage(message) {
        this.messages.push(message);
        // Process the message as required
      },
    },
    beforeUnmount() {
      if (this.websocket) {
        this.websocket.close();
      }
    },
  };
  </script>
<style scoped>
@import "@/assets/styles/main.scss";

.websocket-handler {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* Direct value replacing $font-family-base */
  background-color: #f8f9fa; /* Direct value replacing $light-color */
  border-radius: 4px; /* Direct value replacing $border-radius-base */
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Direct value for box-shadow */
  max-width: 600px;
  margin: 30px auto;
  text-align: center;

  h2 {
    color: #007bff; /* Direct value replacing $primary-color */
    margin-bottom: 20px;
    font-size: 1.5rem; /* Adjusted for responsive font, may need media queries for dynamic resizing */
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 20px;
    text-align: left;
  }

  li {
    background-color: #6c757d; /* Direct value replacing $secondary-color */
    color: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px; /* Direct value replacing $border-radius-base */
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1); /* Direct value for box-shadow */
    transition: transform 0.2s, background-color 0.3s;

    &:hover {
      transform: translateY(-3px);
      background-color: #848e96; /* Manually lightened shade of #6c757d */
    }
  }
}
</style>

  