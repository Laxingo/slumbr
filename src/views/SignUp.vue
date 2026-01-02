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

<script setup>
import { ref } from "vue";
import { isAuthenticated,signUpUser } from "../auth.js";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const username = ref("");
const loggedIn = ref(isAuthenticated());

function goLogin() {
    router.push("/login");
}

async function handleSignup() {

    const user = await signUpUser(email.value, password.value, username.value);

    if (user) {
        loggedIn.value = true;
        alert(`Bem-vindo, ${user.userName}!`);
    } else {
        alert("Email ou senha inválidos!");
    }
}

</script>

<style lang="scss" scoped></style>