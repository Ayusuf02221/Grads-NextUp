// websocketService.js
let websocket = null;

export default {
  connect(endpoint) {
    if (websocket) {
      this.disconnect(); // Disconnect if an existing connection is open
    }

    websocket = new WebSocket(endpoint);

    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onmessage = (event) => {
      console.log('Message received:', event.data);
      // Implement message handling
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
      websocket = null;
    };
  },

  sendMessage(message) {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  },

  disconnect() {
    if (websocket) {
      websocket.close();
    }
  },
};
