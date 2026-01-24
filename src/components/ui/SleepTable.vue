<template>
  <div class="logs">
    <table class="logs_table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Bed</th>
          <th>Wake</th>
          <th>Duration</th>
          <th>Quality</th>
          <th class="col_actions">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ fmtDate(row.date) }}</td>
          <td>{{ fmtTime(row.bedTime) }}</td>
          <td>{{ fmtTime(row.wakeUpTime) }}</td>
          <td>{{ fmtDuration(row.duration) }}</td>
          <td>{{ row.quality ?? '-' }}</td>

          <td class="col_actions">
            <button class="btnMini" type="button" @click="$emit('edit', row)">
              Edit
            </button>
            <button class="btnMini btnMini_danger" type="button" @click="$emit('delete', row)">
              Delete
            </button>
          </td>
        </tr>

        <tr v-if="!rows.length">
          <td class="empty" colspan="6">No logs yet.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'SleepTable',
  props: {
    sleepData: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    rows() {
      return [...this.sleepData].sort((a, b) => (b.date || 0) - (a.date || 0))
    }
  },

  methods: {
    fmtDate(ms) {
      if (!ms) return '-'
      const d = new Date(ms)
      return d.toLocaleDateString('en-GB')
    },

    fmtTime(ms) {
      if (!ms) return '-'
      const d = new Date(ms)
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    },

    fmtDuration(ms) {
      if (!ms || ms <= 0) return '-'
      const totalMin = Math.round(ms / 60000)
      const h = Math.floor(totalMin / 60)
      const m = totalMin % 60
      return `${h}h ${String(m).padStart(2, '0')}m`
    }
  }
}

</script>

<style scoped>
.logs {
  width: 100%;
}

.logs_table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border-radius: 14px;
}

thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  padding: 10px 10px;
  text-align: left;
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}

tbody td {
  padding: 10px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
  color: var(--text);
}

tbody tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.col_actions {
  text-align: right;
  white-space: nowrap;
}

.btnMini {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  border-radius: 10px;
  padding: 7px 10px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;
}

.btnMini:hover {
  border-color: rgba(212, 177, 106, 0.35);
  background: rgba(212, 177, 106, 0.08);
}

.btnMini_danger:hover {
  border-color: rgba(248, 113, 113, 0.35);
  background: rgba(248, 113, 113, 0.08);
}

.empty {
  color: var(--muted);
  text-align: center;
  padding: 16px 10px;
}
</style>
