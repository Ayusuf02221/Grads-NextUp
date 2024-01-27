<template>
    <div class="about-page">
      <site-header></site-header>
  
      <div class="container">
        <h1>About Grads-NextUp</h1>
        
        <section class="mission-statement">
          <h2>Mission Statement</h2>
          <p>Grads-NextUp aims to bridge the gap between recent graduates and their first career opportunities by providing a comprehensive platform for skill development, project management, and resource sharing.</p>
        </section>
  
        <section class="vision-statement">
          <h2>Vision</h2>
          <p>Our vision is to be the leading platform for recent graduates, helping them to seamlessly transition into their professional careers with confidence and competence.</p>
        </section>
  
        <section class="values">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Empowerment:</strong> Empowering graduates with tools and resources for career success.</li>
            <li><strong>Innovation:</strong> Fostering an environment of creativity and innovation.</li>
            <li><strong>Community:</strong> Building a supportive community for knowledge sharing and networking.</li>
          </ul>
        </section>
      </div>
  
      <site-footer></site-footer>
    </div>
  </template>
  
  <script>
  import SiteHeader from '@/components/common/AppHeader.vue';
  import SiteFooter from '@/components/common/AppFooter.vue';
  
  export default {
    components: {
      SiteHeader,
      SiteFooter
    }
  };
  </script>
  
  <style scoped>
  @import "@/assets/styles/main.scss";
  
  .about-page .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1, h2 {
    color: $primary-color;
  }
  
  .mission-statement, .vision-statement, .values {
    margin-bottom: 20px;
  }
  
  .values ul {
    list-style-type: disc;
    margin-left: 20px;
  }
  </style>
  