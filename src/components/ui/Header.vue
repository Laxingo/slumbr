<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useQuestsStore } from '@/stores/quests'

const router = useRouter()
const auth = useAuthStore()
const quests = useQuestsStore()

const isAuthed = computed(() => auth.isAuthenticated)

const level = computed(() => auth.level)
const xpIntoLevel = computed(() => auth.xpIntoLevel)
const xpPerLevel = computed(() => auth.xpPerLevel)
const xpProgressPct = computed(() => auth.xpProgressPct)
const userTitle = computed(() => auth.userTitle)

const claimableCount = computed(() => quests.claimableCount || 0)

onMounted(async () => {
  if (auth.isAuthenticated) await auth.fetchMe()
})

watch(
  () => auth.userId,
  async (id) => {
    if (!id) return
    await quests.init(id)
  },
  { immediate: true }
)

function goQuests() {
  router.push('/quests')
}
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

      <!-- XP / LEVEL (quando ta logado) -->
      <div v-if="isAuthed" class="xp_card" aria-label="User level and XP">
        <div class="xp_top">
          <div class="xp_left">
            <span class="lvl_badge">LVL {{ level }}</span>
            <span class="user_title">{{ userTitle }}</span>
          </div>

          <span class="xp_text">{{ xpIntoLevel }} / {{ xpPerLevel }} XP</span>
        </div>

        <div
          class="xp_bar"
          role="progressbar"
          :aria-valuenow="Math.round(xpProgressPct)"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="xp_fill" :style="{ width: xpProgressPct + '%' }"></div>
          <div class="xp_glow" :style="{ width: xpProgressPct + '%' }"></div>
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

          <button class="btn btn-ghost quests_btn" type="button" @click="goQuests">
            Quests
            <span v-if="claimableCount > 0" class="quests_badge">{{ claimableCount }}</span>
          </button>

          <button class="btn btn-ghost" type="button" @click="logout">
            Logout
          </button>
        </div>

        <button
          v-if="!isAuthed"
          class="btn btn-ghost"
          type="button"
          @click="$router.push('/login')"
        >
          Login
        </button>
      </nav>

      <nav class="nav" v-else>
        <div class="nav_actions">
          <button class="btn btn-ghost" type="button" @click="goHome">
            Home
          </button>
        </div>

        <div class="nav_actions" v-if="isAuthed">
          <button class="btn btn-secondary" type="button" @click="goDashboard">
            Dashboard
          </button>

          <button class="btn btn-ghost quests_btn" type="button" @click="goQuests">
            Quests
            <span v-if="claimableCount > 0" class="quests_badge">{{ claimableCount }}</span>
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
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: linear-gradient(
    180deg,
    rgba(12, 14, 20, 0.82) 0%,
    rgba(12, 14, 20, 0.62) 100%
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.topbar_inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 12px 0;
}

.brand {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  text-decoration: none;
}

.brand_mark {
  font-weight: 800;
  letter-spacing: 0.3px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.92);
}

.brand_tag {
  font-size: 12px;
  letter-spacing: 0.4px;
  text-transform: lowercase;
  color: rgba(255, 255, 255, 0.55);
}

/* XP card */
.xp_card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 240px;
  padding: 10px 12px;
}

.xp_top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.xp_left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.lvl_badge {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.9px;
  padding: 6px 9px;
  border-radius: 999px;
  color: rgba(212, 177, 106, 0.9);
}

.user_title {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.1;
  white-space: nowrap;
}

.xp_text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

.xp_bar {
  position: relative;
  height: 9px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.xp_fill {
  height: 100%;
  border-radius: 999px;
  width: 0%;
  background: linear-gradient(90deg, rgb(212, 177, 106), rgba(212, 177, 106, 0.2));
  transition: width 220ms ease;
}

.xp_glow {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  width: 0%;
  pointer-events: none;
  transition: width 220ms ease;
  background: radial-gradient(closest-side, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0));
  filter: blur(6px);
  opacity: 0.85;
}

/* Quests badge */
.quests_btn {
  position: relative;
}

.quests_badge {
  margin-left: 8px;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  color: rgba(12, 14, 20, 0.95);
  background: rgba(212, 177, 106, 0.95);
}

/* Responsivo: em ecrãs pequenos, reduz/oculta o card */
@media (max-width: 980px) {
  .xp_card {
    min-width: 200px;
    padding: 9px 10px;
  }
}

@media (max-width: 720px) {
  .xp_card {
    display: none;
  }
}
</style>
