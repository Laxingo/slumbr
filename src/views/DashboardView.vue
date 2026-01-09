<template>
  <div>
    <h1>My Sleep Dashboard</h1>
    <button @click="openOverlay()">+</button>
    <div id="overlay" class="overlay">
      <div class="modal">
        <h2>Add Sleep Data</h2>
        <!-- Formulário para adicionar dados de sono -->
        <form @submit.prevent="addSleepData({userId,date: Date.parse(date), bedTime: Date.parse(bedTime), wakeUpTime: Date.parse(wakeUpTime), 
          duration: Date.parse(wakeUpTime) - Date.parse(bedTime), quality, notes })">
          <label for="date">Date:</label>
          <input type="date" id="date" name="date" required v-model="date" />
          <br>
          <label for="bedTime">Bed Time:</label>
          <input type="datetime-local" id="bedTime" name="bedTime" required v-model="bedTime" />
          <br>
          <label for="wakeUpTime">Wake Up Time:</label>
          <input type="datetime-local" id="wakeUpTime" name="wakeUpTime" required v-model="wakeUpTime" />
          <br>
          <select v-model="quality">
            <option value="">Select Quality</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
          <br>
          <label for="notes">Notes:</label>
          <textarea id="notes" name="notes" v-model="notes"></textarea>
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

<script>
import SleepTable from '@/components/ui/chart/SleepTable.vue'
import chart from '@/components/ui/chart/SleepChart.vue'
import { getUserId } from '@/auth'

export default {
  components: {
    SleepTable,
    chart
  },

  data() {
    return {
      sleepData: [],
      userId: getUserId(),
      date: '',
      bedTime: '',
      wakeUpTime: '',
      quality: null,
      notes: ''
    }
  },

  mounted() {
    console.log(this.userId)
    this.fetchSleepData()
  },

  methods: {
    async fetchSleepData() {
      if (!this.userId) return

      const res = await fetch(
        `http://localhost:3000/sleepData?userId=${this.userId}`
      )
      this.sleepData = await res.json()
      console.log(this.sleepData)
    },

    openOverlay() {
      document.getElementById('overlay').style.display = 'block'
    },

    closeOverlay() {
      document.getElementById('overlay').style.display = 'none'
    },

    async addSleepData(params) {
      const res = await fetch(
        `http://localhost:3000/sleepData?userId=${this.userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        }
      )
      const data = await res.json()
      this.sleepData.push(data)
      this.closeOverlay()
    }
  }
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