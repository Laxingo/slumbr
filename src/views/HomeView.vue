<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isAuthed = computed(() => auth.isAuthenticated)

function goLogin() {
  router.push('/login')
}

function goDashboard() {
  router.push('/dashboard')
}

function doLogout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div>
    <header>
      <nav>
        <a href="/">slumbr</a>

        <div style="float:right;">
          <button
            v-if="!isAuthed"
            class="button button-logout"
            @click="goLogin"
          >
            Login
          </button>

          <button
            v-else
            class="button button-logout"
            @click="doLogout"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>

    <main v-if="isAuthed" class="container text-center">
      <h1>Welcome back</h1>
      <button class="button button-start" @click="goDashboard">
        Go to Dashboard
      </button>
    </main>

    <main v-else>
      <section class="container text-center">
        <h1>Welcome to Slumbr</h1>
        <p>Track your sleep effortlessly and improve your health.</p>
        <button class="button button-start" @click="goLogin">
          Get Started
        </button>
      </section>

      <section class="container">
        <div class="feature-card">
          <div class="icon-circle">🛌</div>
          <h2>Sleep Tracking</h2>
          <p>Monitor your sleep patterns and improve your rest!</p>
        </div>

        <div class="feature-card">
          <div class="icon-circle">📊</div>
          <h2>Progress Dashboard & Statistics</h2>
          <p>Analyze trends and optimize your sleep schedule.</p>
        </div>

        <div class="feature-card">
          <div class="icon-circle">✅</div>
          <h2>Rewards & Progress System</h2>
          <p>
            A motivational system that rewards users for maintaining healthy
            sleep habits.
          </p>
        </div>
      </section>

      <section class="container text-center">
        <h2>Get Started in 3 Steps</h2>

        <div class="step-card">
          <div class="step-number">1</div>
          <h3>Create an Account</h3>
          <p>Sign up and start tracking your sleep.</p>
        </div>

        <div class="step-card">
          <div class="step-number">2</div>
          <h3>Log Your Sleep</h3>
          <p>Track your sleep easily every night.</p>
        </div>

        <div class="step-card">
          <div class="step-number">3</div>
          <h3>Improve Your Health</h3>
          <p>Get insights and improve your sleep quality.</p>
        </div>
      </section>
    </main>

    <footer>
      <p>&copy; 2025 Slumbr. All rights reserved.</p>
      <div>
        <a href="#">Privacy Policy</a> |
        <a href="#">Terms of Service</a> |
        <a href="#">Contact</a>
      </div>
    </footer>
  </div>
</template>
