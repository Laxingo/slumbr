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
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="row in rows"
          :key="row.id"
          @click="$emit('select', row)"
          :class="{ selected: selectedId === row.id }"
        >
          <td>{{ fmtDate(row.date) }}</td>
          <td>{{ fmtTime(row.bedTime) }}</td>
          <td>{{ fmtTime(row.wakeUpTime) }}</td>
          <td>{{ fmtDuration(row.duration) }}</td>
          <td>{{ row.quality ?? '-' }}</td>
        </tr>

        <tr v-if="!rows.length">
          <td class="empty" colspan="5">No logs yet.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'SleepLogsTable',
  props: {
    rows: { type: Array, default: () => [] },
    selectedId: { type: [String, Number, null], default: null }
  },
  emits: ['select'],
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

tbody tr {
  cursor: pointer;
}

tbody tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}

tbody tr.selected td {
  background: rgba(212, 177, 106, 0.08);
  border-bottom-color: rgba(212, 177, 106, 0.18);
}

.empty {
  color: var(--muted);
  text-align: center;
  padding: 16px 10px;
}
</style>
