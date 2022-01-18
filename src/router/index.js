import { createRouter, createWebHistory } from 'vue-router'

import AppHome from '../views/AppHome.vue'
import ContactMe from '../views/ContactMe.vue'

const routes = [
  {
    path: '/',
    alias: ['/home'],
    name: 'Home',
    component: AppHome,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactMe,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
