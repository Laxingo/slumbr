<template>
  <div>
    <form @submit.prevent="handleSignup" class="signup-form">
      <h1>Sign Up</h1>

      <input type="email" placeholder="email" v-model="email" required />
      <input type="text" placeholder="username" v-model="username" required />
      <input type="password" placeholder="password" v-model="password" required />

      <button class="button button-signup" type="submit">Sign Up</button>
      <button class="button button-login" @click="goLogin" type="button">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const username = ref('')
const password = ref('')

function goLogin() {
  router.push('/login')
}

async function handleSignup() {
  const user = await auth.signUpUser(email.value, password.value, username.value)

  if (user) {
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } else {
    alert('Email já existe ou dados inválidos!')
  }
}
</script>

<style scoped>
/* mantém o teu styling, se quiseres */
</style>