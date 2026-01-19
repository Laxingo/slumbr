<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    const user = await auth.loginUser(email.value, password.value)

    if (!user) {
      error.value = 'Invalid email or password.'
      return
    }

    router.push('/dashboard')
  } catch (e) {
    error.value = 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth">
    <header class="topbar">
      <div class="container topbar_inner">
        <RouterLink to="/" class="brand">
          <span class="brand_mark">Slumbr</span>
          <span class="brand_tag">sleep tracking</span>
        </RouterLink>

        <nav class="nav">
          <RouterLink class="nav_link" to="/">Home</RouterLink>
          <RouterLink class="nav_link" to="/signup">Sign up</RouterLink>
        </nav>
      </div>
    </header>


    <main class="auth_main">
      <div class="container auth_grid">
        <section class="auth_panel">
          <div class="auth_head">
            <h1 class="auth_title">Welcome back</h1>
            <p class="auth_subtitle">Log in to continue tracking your sleep.</p>
          </div>

          <form class="auth_form" @submit.prevent="handleLogin">
            <label class="field">
              <span class="field_label">Email</span>
              <input class="input" type="email" v-model="email" placeholder="you@example.com" autocomplete="email"
                required />
            </label>

            <label class="field">
              <span class="field_label">Password</span>
              <input class="input" type="password" v-model="password" placeholder="••••••••"
                autocomplete="current-password" required />
            </label>

            <p v-if="error" class="auth_error">{{ error }}</p>

            <button class="btn btn-primary btn-lg auth_submit" type="submit" :disabled="loading">
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>

            <p class="auth_alt">
              Don’t have an account?
              <RouterLink to="/signup" class="auth_link">Sign up</RouterLink>
            </p>
          </form>
        </section>
      </div>
    </main>

    <footer class="footer">
      <div class="container footer_inner">
        <div>
          <div class="footer_brand">Slumbr</div>
          <div class="footer_copy">© 2026 Slumbr. All rights reserved.</div>
        </div>

        <div class="footer_links">
          <a href="#" class="footer_link">Privacy</a>
          <a href="#" class="footer_link">Terms</a>
          <a href="#" class="footer_link">Contact</a>
        </div>
      </div>
    </footer>


  </div>
</template>
