import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// If you're using global components or plugins, import them here
// For example, to use Axios globally you can do the following:
// import axios from 'axios';

const app = createApp(App);

// Use Axios globally (if needed)
// app.config.globalProperties.$axios = axios;

app.use(router);
app.use(store);

app.mount('#app');
