import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import DashboardView from './views/DashboardView.vue'
import LoginView from './views/LoginView.vue'
import SignUp from './views/SignUp.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/dashboard', component: DashboardView },
  { path: '/login', component: LoginView },
  {path: '/signup', component: SignUp }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
