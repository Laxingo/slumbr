<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();
const showHeader = computed(() => route.path !== '/');
</script>


<template>
  <router-view />
</template>

<style scoped>
</style>
