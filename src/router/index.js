import { createRouter, createWebHistory } from 'vue-router'
import HomeSweetHome from '../views/HomeSweetHome.vue'
import ContactMe from '../views/ContactMe.vue'

const routes = [
  {
    path: '/',
    alias: ['/home'],
    name: 'Home',
    component: HomeSweetHome,
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
