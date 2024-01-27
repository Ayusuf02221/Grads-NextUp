import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/LandingPage.vue';
import ResourceDirectory from '@/views/ResourcePage.vue';
import ProjectManagement from '@/views/ProjectManagement.vue';
import InterviewPrep from '@/views/InterviewPage.vue';
import UserProfile from '@/views/ProfilePage.vue';
import Login from '@/views/LoginPage.vue';
import Register from '@/views/RegisterPage.vue';
// Import other necessary components

// Import the store to access the authentication state
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/resources',
    name: 'resourceDirectory',
    component: ResourceDirectory,
    meta: { requiresAuth: true } // Requires authentication
  },
  {
    path: '/project-management',
    name: 'projectManagement',
    component: ProjectManagement,
    meta: { requiresAuth: true } // Requires authentication
  },
  {
    path: '/interview-prep',
    name: 'interviewPrep',
    component: InterviewPrep,
    meta: { requiresAuth: true } // Requires authentication
  },
  {
    path: '/profile',
    name: 'userProfile',
    component: UserProfile,
    meta: { requiresAuth: true } // Requires authentication
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  // ... other routes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guards for Authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = store.getters.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
