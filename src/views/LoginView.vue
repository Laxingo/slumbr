<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h1>Login</h1>

      <input 
        type="text" 
        placeholder="Email" 
        v-model="email"
      />

      <input 
        type="password" 
        placeholder="Password" 
        v-model="password"
      />

      <button class="button button-login" type="submit">Login</button>
      <button class="button button-signup" type="button" @click="handleSignup">Sign Up</button>
      <button class="button button-signup" type="button" @click="logout">Logout</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { loginUser, isAuthenticated, logout } from "../auth.js"; // caminho para o seu auth.js

const email = ref("");
const password = ref("");
const loggedIn = ref(isAuthenticated());

async function handleLogin() {
  // Tenta logar com JSON Server
  const user = await loginUser(email.value, password.value);

  if (user) {
    loggedIn.value = true;
    alert(`Bem-vindo, ${user.Username}!`);
    // Redirecionamento opcional:
    // router.push("/dashboard");
  } else {
    alert("Email ou senha inválidos!");
  }
}

function handleSignup() {
  alert("Funcionalidade de cadastro ainda não implementada!");
}
</script>
