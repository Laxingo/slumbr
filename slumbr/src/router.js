import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import DashboardView from './views/DashboardView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
