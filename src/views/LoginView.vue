<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h1>Login</h1>
      <input type="email" placeholder="Email" v-model="email" required/>
      <br>
      <input type="password" placeholder="Password"  v-model="password" required/>
      <br>
      <br>
      <button class="button button-login" type="submit">Login</button>
      <button class="button button-signup" type="button" @click="goSignUp">Sign Up</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { loginUser, isAuthenticated} from "../auth.js";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const loggedIn = ref(isAuthenticated());

async function handleLogin() {
  // Tenta logar com JSON Server
  const user = await loginUser(email.value, password.value);
  if (user) {
    loggedIn.value = true;
    alert(`Bem-vindo, ${user.userName}!`);
    router.push("/");
  } else {
    alert("Email ou senha inválidos!");
  }
}

function goSignUp() {
  router.push("/signup");
}
</script>
