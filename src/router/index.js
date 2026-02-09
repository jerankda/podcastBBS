import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Upload from '../views/Upload.vue'
import Podcast from '../views/Podcast.vue'
import Account from '../views/Account.vue'
import Browse from '../views/Browse.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload,
    meta: { requiresAuth: true }
  },
  {
    path: '/podcast/:id',
    name: 'Podcast',
    component: Podcast
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: { requiresAuth: true }
  },
  {
    path: '/browse',
    name: 'Browse',
    component: Browse
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for auth
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
