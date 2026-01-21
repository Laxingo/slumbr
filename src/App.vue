<script lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const showHeader = computed(() => route.path !== '/');
    return {
      showHeader,
    };
  },
};
</script>


<template>
  <router-view />
</template>

<style scoped></style>
