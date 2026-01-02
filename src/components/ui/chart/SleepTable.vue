<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Bed time</th>
          <th>Wake up time</th>
          <th>Sleep Duration</th>
          <th>Quality</th>
          <th>Date</th>
          <th>Notes</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sleep in sleepData" :key="sleep.id">
          <td>{{ formatTime(sleep.bedTime) }}</td>
          <td>{{ formatTime(sleep.wakeUpTime) }}</td>
          <td>{{ formatDuration(sleep.duration) }}</td>
          <td>{{ sleep.quality }}/5</td>
          <td>{{ formatDate(sleep.date) }}</td>
          <td>{{ sleep.notes }}</td>
          <td><button @click="editSleep(sleep.id)">Edit</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  sleepData: {
    type: Array,
    default: () => []
  }
});

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}`;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

function formatDuration(ms) {
  const hours = Math.floor(ms / 1000 / 60 / 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  return `${hours}h ${minutes}m`;
}

function editSleep(id) {
  alert(`Edit sleep entry with id: ${id}`);
}
</script>
