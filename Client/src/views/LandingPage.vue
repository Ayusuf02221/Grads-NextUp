<template>
    <div class="landing-page">
      <!-- Header Section -->
      <site-header></site-header>
      
      <!-- Introductory Banner -->
      <section class="intro-banner text-center">
        <h1>Welcome to Grads-NextUp</h1>
        <p>Your one-stop platform for educational resources, project management, and interview preparation.</p>
        <base-button btnType="primary" @click="navigateToRegister">Get Started</base-button>
      </section>
  
      <!-- Resource Highlights -->
      <section class="resource-highlights container">
        <div class="highlight">
          <h2>Curated Educational Content</h2>
          <p>Explore top-tier tutorials, coding exercises, and research papers from renowned platforms.</p>
        </div>
        <div class="highlight">
          <h2>Streamline Your Projects</h2>
          <p>Organize and track your programming assignments, hackathons, and personal projects.</p>
        </div>
        <div class="highlight">
          <h2>Interview Prep Made Easy</h2>
          <p>Access comprehensive resources for your technical and behavioral interview preparation.</p>
        </div>
      </section>
  
      <!-- Testimonials or User Reviews -->
      <section class="testimonials text-center">
        <h2>What Our Users Say</h2>
        <div class="testimonial">
          <p>"Grads-NextUp has been a game-changer for my studies and interview prep!" - Jane Doe</p>
        </div>
        <!-- Add more testimonials as needed -->
      </section>
  
      <!-- Call-to-Action -->
      <section class="cta text-center">
        <h2>Ready to Enhance Your Learning?</h2>
        <base-button btnType="success" @click="navigateToResources">Explore Resources</base-button>
      </section>
  
      <!-- Footer -->
      <site-footer></site-footer>
    </div>
  </template>
  
  <script>
  import SiteHeader from '@/components/common/AppHeader.vue';
  import SiteFooter from '@/components/common/AppFooter.vue';
  import BaseButton from '@/components/common/AppButton.vue';
  
  export default {
    components: {
      SiteHeader,
      SiteFooter,
      BaseButton
    },
    methods: {
      navigateToRegister() {
        this.$router.push('/register');
      },
      navigateToResources() {
        this.$router.push('/resources');
      }
    }
  };
  </script>
  
  <style scoped>
  @import "@/assets/styles/main.scss";
  
  .intro-banner {
    padding: 40px 0;
    background: $light-color;
    h1 {
      @include responsive-font(2rem, 4rem);
    }
    p {
      @include responsive-font(1rem, 1.5rem);
    }
  }
  
  .resource-highlights {
    .highlight {
      margin-bottom: 2rem;
      h2 {
        @include responsive-font(1.5rem, 2.5rem);
      }
      p {
        @include responsive-font(1rem, 1.2rem);
      }
    }
  }
  
  .testimonials {
    background: $secondary-color;
    color: $light-color;
    padding: 20px 0;
    .testimonial {
      margin-bottom: 1rem;
    }
  }
  
  .cta {
    padding: 20px 0;
    h2 {
      margin-bottom: 1rem;
    }
  }
  </style>
  