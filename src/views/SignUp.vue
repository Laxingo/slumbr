<template>
    <div>
        <form @submit.prevent="handleSignup" class="signup-form">
            <h1>Sign Up</h1>
            <input type="email" placeholder="email" v-model="email" required/>
            <input type="text" placeholder="username" v-model="username" required/>
            <input type="password" placeholder="password" v-model="password" required/>
            <button class="button button-signup" type="submit">Sign Up</button>
            <button class="button button-login" @click="goLogin" type="button">Login</button>
        </form>
    </div>
</template>

<script>
import { isAuthenticated, signUpUser } from '../auth.js'
export default {
  data() {
    return {
      email: '',
      password: '',
      username: '',
      loggedIn: isAuthenticated()
    }
  },
  methods: {
    goLogin() {
      this.$router.push('/login')
    },
    async handleSignup() {
      const user = await signUpUser(
        this.email,
        this.password,
        this.username
      )
      if (user) {
        this.loggedIn = true
        alert(`Bem-vindo, ${user.userName}!`)
      } else {
        alert('Email ou senha inválidos!')
      }
    }
  }
}
</script>


<style lang="scss" scoped></style>