<template>
  <div>
    <h1>My Sleep Dashboard</h1>

    <button @click="openOverlay()">+</button>

    <div id="overlay" class="overlay">
      <div class="modal">
        <h2>Add Sleep Data</h2>

        <form
          @submit.prevent="addSleepData({
            userId,
            date: Date.parse(date),
            bedTime: Date.parse(bedTime),
            wakeUpTime: Date.parse(wakeUpTime),
            duration: Date.parse(wakeUpTime) - Date.parse(bedTime),
            quality,
            notes
          })"
        >
          <label for="date">Date:</label>
          <input type="date" id="date" required v-model="date" />
          <br />

          <label for="bedTime">Bed Time:</label>
          <input type="datetime-local" id="bedTime" required v-model="bedTime" />
          <br />

          <label for="wakeUpTime">Wake Up Time:</label>
          <input type="datetime-local" id="wakeUpTime" required v-model="wakeUpTime" />
          <br />

          <select v-model="quality" required>
            <option value="">Select Quality</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
          <br />

          <label for="notes">Notes:</label>
          <textarea id="notes" v-model="notes"></textarea>
          <br />

          <button type="submit">Add</button>
          <button type="button" @click="closeOverlay()">Cancel</button>
        </form>
      </div>
    </div>

    <SleepTable :sleepData="sleepData" />
    <SleepChart :sleepData="sleepData" />
  </div>
</template>

<script>
import SleepTable from '@/components/ui/chart/SleepTable.vue'
import SleepChart from '@/components/ui/chart/SleepChart.vue'
import { useAuthStore } from '@/stores/auth'

export default {
  components: {
    SleepTable,
    SleepChart
  },

  data() {
    return {
      sleepData: [],
      date: '',
      bedTime: '',
      wakeUpTime: '',
      quality: '',
      notes: ''
    }
  },

  computed: {
    userId() {
      const auth = useAuthStore()
      return auth.userId
    }
  },

  mounted() {
    this.fetchSleepData()
  },

  methods: {
    async fetchSleepData() {
      if (!this.userId) return
      const res = await fetch(`http://localhost:3000/sleepData?userId=${this.userId}`)
      this.sleepData = await res.json()
    },

    openOverlay() {
      document.getElementById('overlay').style.display = 'block'
    },

    closeOverlay() {
      document.getElementById('overlay').style.display = 'none'
    },

    async addSleepData(payload) {
      if (!this.userId) return

      if (payload.duration <= 0) {
        alert('Wake up time must be after bed time.')
        return
      }

      const res = await fetch(`http://localhost:3000/sleepData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const created = await res.json()
      this.sleepData.push(created)
      this.closeOverlay()

    }
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 20px;
  width: 300px;
  margin: 10% auto;
  border-radius: 8px;
}
</style>