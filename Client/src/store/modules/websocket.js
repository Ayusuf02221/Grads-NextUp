// websocket.js
const state = {
    websocket: null, // WebSocket instance
    messages: [],    // Stores incoming WebSocket messages
  };
  
  const getters = {
    allMessages: state => state.messages,
  };
  
  const actions = {
    connectWebSocket({ commit, dispatch }) {
      const websocketEndpoint = 'wss://n1r8c5f3xg.execute-api.eu-west-2.amazonaws.com/dev/'; // Replace with your WebSocket endpoint
      const websocket = new WebSocket(websocketEndpoint);
  
      websocket.onopen = () => {
        commit('SET_WEBSOCKET', websocket);
        // Handle connection opened
      };
  
      websocket.onmessage = event => {
        const message = JSON.parse(event.data);
        dispatch('handleIncomingMessage', message);
      };
  
      websocket.onerror = error => {
        console.error('WebSocket error:', error);
        // Handle WebSocket errors
      };
  
      websocket.onclose = () => {
        commit('SET_WEBSOCKET', null);
        // Handle connection closed
      };
    },
  
    handleIncomingMessage({ commit }, message) {
      commit('ADD_MESSAGE', message);
      // Further handling of the message
    },
  
    sendMessage({ state }, message) {
      if (state.websocket) {
        state.websocket.send(JSON.stringify(message));
      }
    },
  
    disconnectWebSocket({ commit }) {
      if (state.websocket) {
        state.websocket.close();
        commit('SET_WEBSOCKET', null);
      }
    },
  };
  
  const mutations = {
    SET_WEBSOCKET(state, websocket) {
      state.websocket = websocket;
    },
    ADD_MESSAGE(state, message) {
      state.messages.push(message);
    },
  };
  
  export default {
    state,
    getters,
    actions,
    mutations,
  };
  