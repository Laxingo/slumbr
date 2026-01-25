<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isAuthed = computed(() => auth.isAuthenticated)

const level = computed(() => auth.level)
const xpIntoLevel = computed(() => auth.xpIntoLevel)
const xpPerLevel = computed(() => auth.xpPerLevel)
const xpProgressPct = computed(() => auth.xpProgressPct)

onMounted(async () => {
  if (auth.isAuthenticated) {
    await auth.fetchMe()
  }
})

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

      <!-- USER XP / LEVEL (aparece em qualquer página quando logado) -->
      <div v-if="isAuthed" class="user_xp">
        <div class="user_xp_top">
          <span class="lvl">Lvl {{ level }}</span>
          <span class="xp">{{ xpIntoLevel }} / {{ xpPerLevel }} XP</span>
        </div>

        <div class="xp_bar" role="progressbar" :aria-valuenow="Math.round(xpProgressPct)" aria-valuemin="0"
          aria-valuemax="100">
          <div class="xp_fill" :style="{ width: xpProgressPct + '%' }"></div>
        </div>
      </div>

      <nav class="nav" v-if="$route.path !== '/dashboard'">
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

        <button v-if="!isAuthed" class="btn btn-ghost" type="button" @click="$router.push('/login')">
          Login
        </button>
      </nav>

      <nav class="nav" v-if="$route.path == '/dashboard'">
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

<style scoped>
.user_xp {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 220px;
  margin-left: 16px;
}

.user_xp_top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  font-size: 12px;
  opacity: 0.9;
}

.xp_bar {
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.12);
}

.xp_fill {
  height: 100%;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.65);
}
</style>
