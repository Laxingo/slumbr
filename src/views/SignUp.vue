<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const username = ref('')
const password = ref('')

const error = ref('')
const loading = ref(false)

async function handleSignup() {
  error.value = ''
  loading.value = true

  try {
    const user = await auth.signUpUser(email.value, password.value, username.value)

    if (!user) {
      error.value = 'That email is already in use.'
      return
    }

    router.push('/dashboard')
  } catch (e) {
    error.value = 'Sign up failed. Please try again.'
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
          <RouterLink class="nav_link" to="/login">Login</RouterLink>
        </nav>
      </div>
    </header>

    <main class="auth_main">
      <div class="container auth_grid">
        <section class="auth_panel">
          <div class="auth_head">
            <h1 class="auth_title">Create your account</h1>
            <p class="auth_subtitle">Start logging your sleep in under a minute.</p>
          </div>

          <form class="auth_form" @submit.prevent="handleSignup">
            <label class="field">
              <span class="field_label">Email</span>
              <input class="input" type="email" v-model="email" placeholder="you@example.com" autocomplete="email"
                required />
            </label>

            <label class="field">
              <span class="field_label">Username</span>
              <input class="input" type="text" v-model="username" placeholder="your name" autocomplete="username"
                required />
            </label>

            <label class="field">
              <span class="field_label">Password</span>
              <input class="input" type="password" v-model="password" placeholder="••••••••" autocomplete="new-password"
                minlength="3" required />
            </label>

            <p v-if="error" class="auth_error">{{ error }}</p>

            <button class="btn btn-primary btn-lg auth_submit" type="submit" :disabled="loading">
              {{ loading ? 'Creating account...' : 'Sign up' }}
            </button>

            <p class="auth_alt">
              Already have an account?
              <RouterLink to="/login" class="auth_link">Login</RouterLink>
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
