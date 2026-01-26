<template>
  <div class="home">
    <AppHeader />

    <main class="container dash">
      <!-- Top-->
      <div class="dash_top">
        <div class="dash_head">
          <div class="dash_kicker">Welcome, {{ userName }}.</div>
          <h1 class="dash_title">Sleep Dashboard</h1>
        </div>

        <button class="btn btn-primary dash_add" type="button" @click="openCreate">
          + Add
        </button>
      </div>

      <!-- Grid -->
      <div class="dash_grid">
        <!-- Panel-->
        <section class="dash_card dash_card_panel">
          <div class="dash_card_top">
            <h2 class="dash_card_title">Summary</h2>
            <div class="dash_card_meta">
              {{ selectedDay ? 'Selected day' : 'Weekly overview' }}
            </div>
          </div>

          <SleepPanel
            :metrics="panelMetrics"
            :selected="selectedDay"
            :sunrise="sunrise"
            :sunset="sunset"
            @edit="openEdit"
            @delete="deleteLog"
            @clear="clearSelected"
          />
        </section>

        <!-- Logs-->
        <section class="dash_card dash_card_logs">
          <div class="dash_card_top">
            <h2 class="dash_card_title">Logs</h2>

            <div class="pager">
              <button class="pager_btn" type="button" @click="prevPage" :disabled="page === 1">
                Prev
              </button>
              <span class="pager_txt">{{ page }} / {{ totalPages }}</span>
              <button
                class="pager_btn"
                type="button"
                @click="nextPage"
                :disabled="page === totalPages"
              >
                Next
              </button>
            </div>
          </div>

          <SleepLogsTable
            :rows="pagedSleepData"
            :selectedId="selectedDay?.id ?? null"
            @select="selectRow"
          />

          <!-- Location helper -->
          <div class="coord_box" v-if="!hasCoords">
            <div class="coord_text">
              Sunrise/sunset requires your location.
            </div>

            <button class="btnMini" type="button" @click="requestLocation" :disabled="locLoading">
              {{ locLoading ? 'Getting location...' : 'Set location' }}
            </button>

            <p v-if="locError" class="coord_error">{{ locError }}</p>
          </div>
        </section>

        <!-- Chart -->
        <section class="dash_card dash_card_chart">
          <div class="dash_card_top">
            <h2 class="dash_card_title">Trends</h2>
            <div class="dash_card_meta">
              {{ filteredSleepData.length ? `${filteredSleepData.length} logs` : 'No data' }}
            </div>
          </div>

          <div class="chart_frame chart_frame_full">
            <SleepChart :sleepData="filteredSleepData" />
          </div>
        </section>
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
              <textarea
                class="input textarea"
                v-model="notes"
                placeholder="Anything relevant..."
              ></textarea>
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
      </div>
    </main>
  </div>
</template>

<script>
import { useQuestsStore } from '@/stores/quests'
import { useAuthStore } from '@/stores/auth'

import AppHeader from '@/components/ui/Header.vue'
import SleepChart from '@/components/ui/SleepChart.vue'
import SleepPanel from '@/components/ui/SleepPanel.vue'
import SleepLogsTable from '@/components/ui/SleepLogsTable.vue'

const API_BASE = 'http://localhost:3000'

export default {
  components: { AppHeader, SleepChart, SleepPanel, SleepLogsTable },

  data() {
    return {
      sleepData: [],
      editingId: null,
      userName: '',

      limit: 14,

      // modal
      isModalOpen: false,
      loading: false,
      error: '',

      // form
      date: '',
      bedTime: '',
      wakeUpTime: '',
      quality: '',
      notes: '',

      // paginaçao
      page: 1,
      pageSize: 6,

      // selection + sun data
      selectedDay: null,
      sunrise: null,
      sunset: null,

      // user location
      location: { latitude: null, longitude: null },
      locLoading: false,
      locError: ''
    }
  },

  computed: {
    userId() {
      return useAuthStore().userId
    },

    hasCoords() {
      return this.location.latitude != null && this.location.longitude != null
    },

    filteredSleepData() {
      const sorted = [...this.sleepData].sort((a, b) => (b.date || 0) - (a.date || 0))
      if (this.limit === 0) return sorted
      return sorted.slice(0, this.limit)
    },

    totalPages() {
      const total = this.filteredSleepData.length
      return Math.max(1, Math.ceil(total / this.pageSize))
    },

    pagedSleepData() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredSleepData.slice(start, start + this.pageSize)
    },

    panelMetrics() {
      const data = [...this.sleepData]
        .filter((x) => x?.userId === this.userId)
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

      const durations = sample.map((x) => Number(x.duration || 0)).filter((v) => v > 0)
      const qualities = sample.map((x) => Number(x.quality || 0)).filter((v) => v > 0)

      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      const avgQuality = qualities.length ? qualities.reduce((a, b) => a + b, 0) / qualities.length : 0

      const bedTimes = sample.map((x) => new Date(x.bedTime || 0)).filter((d) => !isNaN(d))
      const bedMinutes = bedTimes.map((d) => d.getHours() * 60 + d.getMinutes())

      const regularityStd = stdDev(bedMinutes)
      const regularityScore = clamp(100 - (regularityStd / 90) * 100, 0, 100)

      const durationScore = clamp((avgDuration / (8 * 60 * 60 * 1000)) * 100, 0, 100)
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
        const v = mean(arr.map((x) => (x - m) ** 2))
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
    this.fetchUserLocation()
  },

  methods: {
    clearSelected() {
      this.selectedDay = null
      this.sunrise = null
      this.sunset = null
    },

    async welcomeUser() {
      if (!this.userId) return
      const res = await fetch(`${API_BASE}/users?id=${encodeURIComponent(this.userId)}`)
      const rows = await res.json()
      this.userName = rows?.[0]?.userName || ''
    },

    async fetchUserLocation() {
      if (!this.userId) return
      const res = await fetch(`${API_BASE}/users?id=${encodeURIComponent(this.userId)}`)
      const rows = await res.json()
      const u = rows?.[0]
      if (!u?.location) return
      if (u.location.latitude == null || u.location.longitude == null) return
      this.location = u.location
    },

    async requestLocation() {
      this.locError = ''

      if (!navigator.geolocation) {
        this.locError = 'Geolocation is not supported by this browser.'
        return
      }

      this.locLoading = true
      try {
        const coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject(err),
            { enableHighAccuracy: true, timeout: 10000 }
          )
        })

        const newLoc = { latitude: coords.latitude, longitude: coords.longitude }

        // Guarda na BD (JSON Server / API)
        await fetch(`${API_BASE}/users/${encodeURIComponent(this.userId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location: newLoc })
        })

        this.location = newLoc

        // atualiza sunrise/sunset
        if (this.selectedDay?.date) {
          await this.refreshSunForSelected()
        }
      } catch (e) {
        this.locError = 'Failed to get location. Check browser permissions and try again.'
        console.error(e)
      } finally {
        this.locLoading = false
      }
    },

    async refreshSunForSelected() {
      if (!this.selectedDay?.date) return
      if (!this.hasCoords) return

      try {
        const formattedDate = new Date(this.selectedDay.date).toISOString().split('T')[0]
        const url =
          `https://api.sunrise-sunset.org/json` +
          `?lat=${Number(this.location.latitude)}` +
          `&lng=${Number(this.location.longitude)}` +
          `&date=${formattedDate}` +
          `&formatted=0`

        const response = await fetch(url)
        const data = await response.json()
        if (data?.status !== 'OK') return

        // Hora local
        this.sunrise = new Date(data.results.sunrise).toLocaleTimeString('pt-PT', {
          hour: '2-digit',
          minute: '2-digit'
        })
        this.sunset = new Date(data.results.sunset).toLocaleTimeString('pt-PT', {
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (e) {
        console.error('Failed to refresh sunrise/sunset:', e)
      }
    },

    async selectRow(row) {
      if (!row?.id) return
      this.selectedDay = row
      this.sunrise = null
      this.sunset = null

      // coords 
      if (!this.hasCoords) {
        await this.fetchUserLocation()
      }
      if (!this.hasCoords) return

      await this.refreshSunForSelected()

      try {
        const res2 = await fetch(`${API_BASE}/sleepData/${encodeURIComponent(row.id)}`)
        this.selectedDay = await res2.json()
      } catch (e) {
        console.error(e)
      }
    },

    async fetchSleepData() {
      if (!this.userId) return
      const res = await fetch(`${API_BASE}/sleepData?userId=${encodeURIComponent(this.userId)}`)
      this.sleepData = await res.json()

      this.page = 1
      this.clearSelected()

      await useQuestsStore().syncAllFromSleepData(this.userId, this.sleepData)
    },

    openCreate() {
      this.editingId = null
      this.error = ''
      this.loading = false

      this.date = ''
      this.bedTime = ''
      this.wakeUpTime = ''
      this.quality = ''
      this.notes = ''

      this.isModalOpen = true
    },

    prevPage() {
      this.page = Math.max(1, this.page - 1)
    },

    nextPage() {
      this.page = Math.min(this.totalPages, this.page + 1)
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
          const res = await fetch(`${API_BASE}/sleepData/${encodeURIComponent(this.editingId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })

          const updated = await res.json()
          this.sleepData = this.sleepData.map((x) => (x.id === updated.id ? updated : x))

          this.page = 1
          await useQuestsStore().syncAllFromSleepData(this.userId, this.sleepData)

          if (this.selectedDay?.id === updated.id) {
            this.selectedDay = updated
            await this.refreshSunForSelected()
          }

          this.closeModal()
          return
        }

        const res = await fetch(`${API_BASE}/sleepData`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const created = await res.json()
        this.sleepData.push(created)

        this.page = 1
        await useQuestsStore().syncAllFromSleepData(this.userId, this.sleepData)
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

      await fetch(`${API_BASE}/sleepData/${encodeURIComponent(row.id)}`, { method: 'DELETE' })
      this.sleepData = this.sleepData.filter((x) => x.id !== row.id)

      if (this.selectedDay?.id === row.id) this.clearSelected()

      this.page = Math.min(this.page, this.totalPages)

      await useQuestsStore().syncAllFromSleepData(this.userId, this.sleepData)
    }
  }
}
</script>

<style scoped>
.dash {
  padding: 10px 0 14px;
  color: var(--text);
}

.dash_top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.dash_head {
  display: grid;
  gap: 2px;
}

.dash_kicker {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.2;
}

.dash_title {
  margin: 0;
  font-size: 18px;
  letter-spacing: -0.2px;
  line-height: 1.1;
}

.dash_add {
  padding: 10px 12px;
}

/* GRID */
.dash_grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 14px;
  align-items: stretch;
}

.dash_card_panel {
  grid-column: 1;
  grid-row: 1;
}

.dash_card_logs {
  grid-column: 2;
  grid-row: 1;
}

.dash_card_chart {
  grid-column: 1 / -1;
  grid-row: 2;
}

/* top row inside cards */
.dash_card_top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.dash_card_title {
  margin: 0;
  font-size: 13px;
  letter-spacing: -0.2px;
  color: var(--text);
}

.dash_card_meta {
  font-size: 12px;
  color: var(--muted);
}

/* pager */
.pager {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pager_btn {
  border: 1px solid var(--border);
  background: rgba(2, 6, 23, 0.25);
  color: var(--text);
  border-radius: 10px;
  padding: 6px 10px;
  cursor: pointer;
}

.pager_btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pager_txt {
  font-size: 12px;
  color: var(--muted);
}

/* chart */
.chart_frame {
  width: 100%;
  overflow: hidden;
}

.chart_frame_full {
  aspect-ratio: 16 / 6;
  max-height: 360px;
  min-height: 260px;
}

/* location helper */
.coord_box {
  margin-top: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(2, 6, 23, 0.25);
  display: grid;
  gap: 8px;
}

.coord_text {
  font-size: 12px;
  color: var(--muted);
}

.coord_error {
  margin: 0;
  font-size: 12px;
  color: rgba(248, 113, 113, 0.95);
}

/* Mini button */
.btnMini {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  border-radius: 10px;
  padding: 7px 10px;
  font-size: 12px;
  cursor: pointer;
  width: fit-content;
}

.btnMini:hover {
  border-color: rgba(212, 177, 106, 0.35);
  background: rgba(212, 177, 106, 0.08);
}

/* Modal */
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

/* Mobile */
@media (max-width: 980px) {
  .dash {
    padding: 18px 0 50px;
  }

  .dash_grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .dash_card_panel,
  .dash_card_logs,
  .dash_card_chart {
    grid-column: 1;
  }

  .dash_card_panel { grid-row: 1; }
  .dash_card_logs { grid-row: 2; }
  .dash_card_chart { grid-row: 3; }

  .chart_frame_full {
    aspect-ratio: 16 / 9;
    max-height: 320px;
    min-height: 240px;
  }
}
</style>
