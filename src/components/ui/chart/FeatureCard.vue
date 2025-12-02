<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  icon: Object,
  title: String,
  description: String,
  color: { type: String, default: 'bg-purple-500' }
})
</script>

<template>
  <div class="feature-item">
    <div :class="`${color} mb-4 inline-block p-4 text-white rounded-full`">
      <component :is="icon" class="w-8 h-8" />
    </div>
    <h2 class="text-2xl font-bold mb-2">{{ title }}</h2>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>
