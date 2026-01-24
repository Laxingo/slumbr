<template>
  <div class="home">
    <AppHeader />

    <main class="container dash">
      <div class="dash_top">
        <div>
          <h1>Welcome, {{ userName }}!</h1>
          <h1 class="dash_title">My Sleep Dashboard</h1>
          <p class="dash_subtitle">Log your sleep and track trends over time.</p>
        </div>

        <button class="btn btn-primary" type="button" @click="isModalOpen = true">
          + Add
        </button>
      </div>

      <div class="dash_layout">
        <section class="dash_left">
          <div class="dash_card">
            <UserPanel :metrics="panelMetrics" />
          </div>

          <div class="dash_card">
            <div class="dash_card_top">
              <h2 class="dash_card_title">Trends</h2>
            </div>

            <div class="chart_wrap">
              <SleepChart :sleepData="filteredSleepData" />
            </div>
          </div>
        </section>

        <aside class="dash_right">
          <div class="dash_card">
            <div class="dash_card_top">
              <h2 class="dash_card_title">Logs</h2>

              <div class="dash_controls">
                <label class="dash_select">
                  <span>Show</span>
                  <select v-model.number="limit">
                    <option :value="7">Last 7</option>
                    <option :value="14">Last 14</option>
                    <option :value="30">Last 30</option>
                    <option :value="0">All</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="table_wrap">
              <SleepTable
                :sleepData="filteredSleepData"
                @edit="openEdit"
                @delete="deleteLog"
              />
            </div>
          </div>
        </aside>
      </div>

      <!-- Modal -->
      <div v-if="isModalOpen" class="overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal_top">
            <h2 class="modal_title">{{ editingId ? 'Edit Sleep Log' : 'Add Sleep Data' }}</h2>
            <button class="modal_close" type="button" @click="closeModal">×</button>
          </div>

          <form class="form" @submit.prevent="submit">
            <label class="field">
              <span class="field_label">Date</span>
              <input class="input" type="date" required v-model="date" />
            </label>

            <label class="field">
              <span class="field_label">Bed time</span>
              <input class="input" type="datetime-local" required v-model="bedTime" />
            </label>

            <label class="field">
              <span class="field_label">Wake up time</span>
              <input class="input" type="datetime-local" required v-model="wakeUpTime" />
            </label>

            <label class="field">
              <span class="field_label">Quality (1–5)</span>
              <select class="input" v-model="quality" required>
                <option value="" disabled>Select quality</option>
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>
            </label>

            <label class="field">
              <span class="field_label">Notes (optional)</span>
              <textarea class="input textarea" v-model="notes" placeholder="Anything relevant..."></textarea>
            </label>

            <p v-if="error" class="form_error">{{ error }}</p>

            <div class="form_actions">
              <button class="btn btn-secondary" type="button" @click="closeModal">
                Cancel
              </button>
              <button class="btn btn-primary" type="submit" :disabled="loading">
                {{ loading ? 'Saving...' : (editingId ? 'Save' : 'Add') }}
              </button>
            </div>
          </form>
        </div>
      </div >
      <br>
<aside class="dash_right">
  <div class="dash_card">
    <div class="dash_card_top">
      <h2 class="dash_card_title">Quests</h2>

      <div class="dash_controls">
      </div>
    </div>

    <div class="table_wrap">
      <QuestList />
    </div>
  </div>
</aside>

    </main>
  </div>
</template>

<script>
import AppHeader from '@/components/ui/Header.vue'
import SleepTable from '@/components/ui/SleepTable.vue'
import SleepChart from '@/components/ui/SleepChart.vue'
import { useAuthStore } from '@/stores/auth'
import UserPanel from '@/components/ui/UserPanel.vue'
import QuestList from '@/components/ui/QuestList.vue'


export default {
  components: { AppHeader, SleepTable, SleepChart, UserPanel,QuestList },

  data() {
    return {
      sleepData: [],
      editingId: null,
      userName:"",
      // UI
      limit: 14,
      isModalOpen: false,
      loading: false,
      error: '',

      // form
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
    },

    filteredSleepData() {
      const sorted = [...this.sleepData].sort((a, b) => (b.date || 0) - (a.date || 0))
      if (this.limit === 0) return sorted
      return sorted.slice(0, this.limit)
    },
    // WELCOME USER
    panelMetrics() {
      const data = [...this.sleepData]
        .filter(x => x?.userId === this.userId)
        .sort((a, b) => (b.date || 0) - (a.date || 0))

      const sample = data.slice(0, 7)
      const n = sample.length

      if (!n) {
        return {
          sampleSize: 0,
          avgDurationText: '-',
          avgQualityText: '-',
          regularityLabel: '-',
          durationScore: 0,
          qualityScore: 0,
          regularityScore: 0
        }
      }

      const durations = sample.map(x => Number(x.duration || 0)).filter(v => v > 0)
      const qualities = sample.map(x => Number(x.quality || 0)).filter(v => v > 0)

      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      const avgQuality = qualities.length ? qualities.reduce((a, b) => a + b, 0) / qualities.length : 0

      const bedTimes = sample.map(x => new Date(x.bedTime || 0)).filter(d => !isNaN(d))
      const bedMinutes = bedTimes.map(d => d.getHours() * 60 + d.getMinutes())

      const regularityStd = stdDev(bedMinutes)
      const regularityScore = clamp(100 - (regularityStd / 90) * 100, 0, 100)

      const durationScore = clamp((avgDuration / 8) * 100, 0, 100)
      const qualityScore = clamp((avgQuality / 5) * 100, 0, 100)

      return {
        sampleSize: n,
        avgDurationText: fmtDuration(avgDuration),
        avgQualityText: avgQuality ? `${avgQuality.toFixed(1)} / 5` : '-',
        regularityLabel: labelFromScore(regularityScore),
        durationScore: Math.round(durationScore),
        qualityScore: Math.round(qualityScore),
        regularityScore: Math.round(regularityScore)
      }

      function fmtDuration(ms) {
        const totalMin = Math.round(ms / 60000)
        const h = Math.floor(totalMin / 60)
        const m = totalMin % 60
        return `${h}h ${String(m).padStart(2, '0')}m`
      }

      function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v))
      }

      function mean(arr) {
        if (!arr.length) return 0
        return arr.reduce((a, b) => a + b, 0) / arr.length
      }

      function stdDev(arr) {
        if (!arr.length) return 0
        const m = mean(arr)
        const v = mean(arr.map(x => (x - m) ** 2))
        return Math.sqrt(v)
      }

      function labelFromScore(score) {
        if (score >= 80) return 'High'
        if (score >= 55) return 'Good'
        if (score >= 35) return 'Moderate'
        return 'Low'
      }
    }
  },

  mounted() {
    this.fetchSleepData()
    this.welcomeUser()
  },

  methods: {
    async welcomeUser() {
      const res= await fetch(`http://localhost:3000/users?id=${this.userId}`)
      this.data =await res.json()
      this.userName=this.data[0].userName

      
    },
    async fetchSleepData() {
      if (!this.userId) return
      const res = await fetch(`http://localhost:3000/sleepData?userId=${this.userId}`)
      this.sleepData = await res.json()
    },

    closeModal() {
      this.isModalOpen = false
      this.error = ''
      this.editingId = null
      this.loading = false
    },

    async submit() {
      this.error = ''
      if (!this.userId) return

      const bed = Date.parse(this.bedTime)
      const wake = Date.parse(this.wakeUpTime)

      if (!bed || !wake || wake <= bed) {
        this.error = 'Wake up time must be after bed time.'
        return
      }

      const payload = {
        userId: this.userId,
        date: Date.parse(this.date),
        bedTime: bed,
        wakeUpTime: wake,
        duration: wake - bed,
        quality: Number(this.quality),
        notes: this.notes
      }

      this.loading = true
      try {
        if (this.editingId) {
          const res = await fetch(`http://localhost:3000/sleepData/${this.editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })

          const updated = await res.json()
          this.sleepData = this.sleepData.map((x) => (x.id === updated.id ? updated : x))
          this.closeModal()
          return
        }

        const res = await fetch(`http://localhost:3000/sleepData`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const created = await res.json()
        this.sleepData.push(created)
        this.closeModal()
      } catch (e) {
        this.error = 'Failed to save. Try again.'
      } finally {
        this.loading = false
      }
    },

    openEdit(row) {
      this.editingId = row.id
      this.isModalOpen = true
      this.error = ''

      this.date = row.date ? new Date(row.date).toISOString().slice(0, 10) : ''
      this.bedTime = row.bedTime ? new Date(row.bedTime).toISOString().slice(0, 16) : ''
      this.wakeUpTime = row.wakeUpTime ? new Date(row.wakeUpTime).toISOString().slice(0, 16) : ''
      this.quality = row.quality ?? ''
      this.notes = row.notes ?? ''
    },

    async deleteLog(row) {
      if (!row?.id) return
      const ok = confirm('Delete this log?')
      if (!ok) return

      await fetch(`http://localhost:3000/sleepData/${row.id}`, { method: 'DELETE' })
      this.sleepData = this.sleepData.filter((x) => x.id !== row.id)
    }
  }
}
</script>

<style scoped>
.dash {
  padding: 26px 0 60px;
  color: var(--text);
}

.dash_top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.dash_left {
  display: grid;
  gap: 14px;
}

.dash_title {
  margin: 0;
  font-size: 26px;
  letter-spacing: -0.3px;
}

.dash_subtitle {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.dash_layout {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 14px;
  align-items: start;
}

.dash_card {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-lg);
  padding: 14px;
}

.dash_card_top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.dash_card_title {
  margin: 0;
  font-size: 14px;
  letter-spacing: -0.2px;
  color: var(--text);
}

.dash_controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dash_select {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 12px;
}

.dash_select select {
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.55);
  color: var(--text);
  border-radius: 10px;
  padding: 8px 10px;
  outline: none;
}

.chart_wrap {
  height: 340px;
  max-height: 340px;
  overflow: hidden;
}

.table_wrap {
  max-height: 520px;
  overflow-y: auto;
  padding-right: 6px;
}

.table_wrap::-webkit-scrollbar {
  width: 8px;
}

.table_wrap::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.10);
  border-radius: 999px;
}

.table_wrap::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 177, 106, 0.22);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.7);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 18px;
}

.modal {
  width: 100%;
  max-width: 460px;
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 16px;
}

.modal_top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.modal_title {
  margin: 0;
  font-size: 16px;
}

.modal_close {
  background: transparent;
  border: 1px solid transparent;
  color: var(--muted);
  font-size: 18px;
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 10px;
}

.modal_close:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
}

.form {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.field_label {
  font-size: 12px;
  color: var(--muted);
}

.input {
  width: 100%;
  border: 1px solid var(--border);
  background: rgba(2, 6, 23, 0.35);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;
}

.input:focus {
  border-color: rgba(212, 177, 106, 0.35);
  box-shadow: 0 0 0 4px rgba(212, 177, 106, 0.12);
}

.textarea {
  min-height: 90px;
  resize: vertical;
}

.form_error {
  margin: 0;
  font-size: 13px;
  color: rgba(248, 113, 113, 0.95);
  border: 1px solid rgba(248, 113, 113, 0.25);
  background: rgba(248, 113, 113, 0.08);
  border-radius: 12px;
  padding: 10px 12px;
}

.form_actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
}

@media (max-width: 980px) {
  .dash_layout {
    grid-template-columns: 1fr;
  }

  .chart_wrap {
    height: 300px;
    max-height: 300px;
  }

  .table_wrap {
    max-height: 420px;
  }
}
</style>
