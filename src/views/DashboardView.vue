<template>
  <div>
    <h1>My Sleep Dashboard</h1>
    <SleepTable :sleepData="sleepData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SleepTable from '@/components/ui/chart/SleepTable.vue';
import { getUserId } from '@/auth';

const sleepData = ref([]);
const userId = getUserId();
console.log(userId)

async function fetchSleepData() {
  if (!userId) return;
  const res = await fetch(`http://localhost:3000/sleepData?userId=${userId}`);
  sleepData.value = await res.json();
}

onMounted(() => {
  fetchSleepData();
});
</script>
