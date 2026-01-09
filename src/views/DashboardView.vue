<template>
  <div>
    <h1>My Sleep Dashboard</h1>
    <button @click="openOverlay()">+</button>
    <div id="overlay" class="overlay">
      <div class="modal">
        <h2>Add Sleep Data</h2>
        <!-- Formulário para adicionar dados de sono -->
        <form @submit.prevent="closeOverlay()">
          <label for="bedTime">Bed Time:</label>
          <input type="datetime-local" id="bedTime" name="bedTime" required />
          <br>
          <label for="wakeUpTime">Wake Up Time:</label>
          <input type="datetime-local" id="wakeUpTime" name="wakeUpTime" required />
          <br>
          <select>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
          <br>
          <label for="notes">Notes:</label>
          <textarea id="notes" name="notes"></textarea>
          <br>
          <button type="submit">Add</button>
          <button type="button" @click="closeOverlay()">Cancel</button>
          <br>

        </form>
      </div>
    </div>
    <SleepTable :sleepData="sleepData" />
    <chart :sleepData="sleepData"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SleepTable from '@/components/ui/chart/SleepTable.vue';
import chart from '@/components/ui/chart/SleepChart.vue';
import { getUserId } from '@/auth';

const sleepData = ref([]);
const userId = getUserId();
console.log(userId)

async function fetchSleepData() {
  if (!userId) return;
  const res = await fetch(`http://localhost:3000/sleepData?userId=${userId}`);
  sleepData.value = await res.json();
  console.log(sleepData.value);
}
async function openOverlay() {
  document.getElementById("overlay").style.display = "block";
}

async function closeOverlay() {
  document.getElementById("overlay").style.display = "none";}
onMounted(() => {
  fetchSleepData();
});

async function addSleepData(params) {
  const res = await fetch(`http://localhost:3000/sleepData?userId=${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
  const data = await res.json();
  sleepData.value.push(data);
}
</script>
<style scoped>
/* Full-screen overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: none; /* hidden by default */
  z-index: 1000;
}

/* Centered form */
.modal {
  background: white;
  padding: 20px;
  width: 300px;
  margin: 10% auto;
  border-radius: 8px;
}
</style>