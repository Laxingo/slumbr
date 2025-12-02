<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  number: [Number, String],
  title: String,
  description: String,
  borderColor: { type: String, default: 'border-purple-500 text-purple-500' }
})
</script>

<template>
  <div>
    <div :class="`mb-4 inline-block p-4 border-2 rounded-full text-2xl font-bold ${borderColor}`">
      {{ number }}
    </div>
    <h3 class="text-2xl font-bold mb-2">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>
