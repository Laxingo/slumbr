<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isAuthed = computed(() => auth.isAuthenticated)

function goDashboard() {
  router.push('/dashboard')
}
function goHome() {
  router.push('/')
}

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="topbar">
    <div class="container topbar_inner">
      <RouterLink to="/" class="brand">
        <span class="brand_mark">Slumbr</span>
        <span class="brand_tag">sleep tracking</span>
      </RouterLink>

      <nav class="nav" v-if="$route.path=='/dashboard'"> 
        <div class="nav_actions">
          <button class="btn btn-secondary" type="button" @click="goHome">
            Home
          </button>
        </div>

        <div class="nav_actions" v-if="isAuthed">
          <button class="btn btn-ghost" type="button" @click="goDashboard">
            Dashboard
          </button>

          <button class="btn btn-ghost" type="button" @click="logout">
            Logout
          </button>
        </div>
      </nav>

      <nav class="nav" v-if="$route.path!='/dashboard'">
        <div class="nav_actions">
          <button class="btn btn-ghost" type="button" @click="goHome">
            Home
          </button>
        </div>
        <div class="nav_actions" v-if="isAuthed">
          <button class="btn btn-secondary" type="button" @click="goDashboard">
            Dashboard
          </button>

          <button class="btn btn-ghost" type="button" @click="logout">
            Logout
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>
