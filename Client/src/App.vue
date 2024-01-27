<template>
  <div id="app">
    <Header />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Header from './components/common/AppHeader.vue';
import Footer from './components/common/AppFooter.vue';

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Footer
  }
});
</script>

<style>
@import "@/assets/styles/main.scss";

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Additional global styles if necessary */
</style>
