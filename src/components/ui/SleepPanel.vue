<template>
  <div class="panel">
    <div class="panel_top">
      <div class="panel_dot"></div>
      <div class="panel_dot"></div>
      <div class="panel_dot"></div>
      <div class="panel_title">
        {{ selected ? fmtDate(selected.date) : 'This week' }}
      </div>

      <button v-if="selected" class="btnMini" type="button" @click="$emit('clear')">
        Back
      </button>
    </div>

    <!-- Selected day view -->
    <template v-if="selected">
      <div class="panel_stats">
        <div class="stat">
          <div class="stat_label">Sleep Duration</div>
          <div class="stat_value">{{ fmtDuration(selected.duration) }}</div>
        </div>

        <div class="stat">
          <div class="stat_label">Quality</div>
          <div class="stat_value">{{ selected.quality ?? '-' }}</div>
        </div>

        <div class="stat">
          <div class="stat_label">Sunrise</div>
          <div class="stat_value">{{ sunrise ?? '-' }}</div>
        </div>

        <div class="stat">
          <div class="stat_label">Sunset</div>
          <div class="stat_value">
            {{ sunset ?? '-' }}
            <img
              src="https://www.svgrepo.com/show/532066/sunset.svg"
              alt="Sunset Icon"
              width="16"
              height="16"
              style="margin-left: 6px; vertical-align: -2px"
            />
          </div>
        </div>
      </div>

      <div class="panel_progress">
        <div class="progress">
          <div class="progress_label">Notes</div>
          <div><p>{{ selected.notes || '-' }}</p></div>
        </div>

        <div class="progress">
          <div class="progress_label"></div>
          <div class="actions">
            <button class="btnMini" type="button" @click.stop="$emit('edit', selected)">Edit</button>
            <button
              class="btnMini btnMini_danger"
              type="button"
              @click="$emit('delete', selected)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Weekly  view -->
    <template v-else>
      <div class="panel_stats">
        <div class="stat">
          <div class="stat_label">Avg. duration</div>
          <div class="stat_value">{{ metrics?.avgDurationText ?? '-' }}</div>
        </div>

        <div class="stat">
          <div class="stat_label">Avg. regularity</div>
          <div class="stat_value">{{ metrics?.regularityLabel ?? '-' }}</div>
        </div>

        <div class="stat">
          <div class="stat_label">Avg. quality</div>
          <div class="stat_value">{{ metrics?.avgQualityText ?? '-' }}</div>
        </div>
      </div>

      <div class="panel_progress">
        <div class="progress">
          <div class="progress_label">Duration</div>
          <div class="progress_bar"><span :style="{ width: (metrics?.durationScore ?? 0) + '%' }"></span></div>
        </div>

        <div class="progress">
          <div class="progress_label">Regularity</div>
          <div class="progress_bar"><span :style="{ width: (metrics?.regularityScore ?? 0) + '%' }"></span></div>
        </div>

        <div class="progress">
          <div class="progress_label">Quality</div>
          <div class="progress_bar"><span :style="{ width: (metrics?.qualityScore ?? 0) + '%' }"></span></div>
        </div>
      </div>

      <div class="panel_hint">
        Based on your last {{ metrics?.sampleSize ?? 0 }} logs.
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SleepPanel',
  props: {
    metrics: { type: Object, required: true },
    selected: { type: Object, default: null }, // sleep log selecionado (ou null)
    sunrise: { type: String, default: null },
    sunset: { type: String, default: null }
  },
  emits: ['edit', 'delete', 'clear'],
  methods: {
    fmtDate(ms) {
      if (!ms) return '-'
      const d = new Date(ms)
      return d.toLocaleDateString('en-GB')
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
.panel {
  border: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 280px;
}

.panel_top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel_dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.panel_title {
  margin-left: 6px;
  color: var(--muted);
  font-size: 12px;
}

.panel_stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat {
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.55);
  border-radius: 14px;
  padding: 10px 12px;
}

.stat_label {
  color: var(--muted);
  font-size: 12px;
}

.stat_value {
  margin-top: 6px;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.panel_progress {
  display: grid;
  gap: 12px;
}

.progress {
  display: grid;
  gap: 6px;
}

.progress_label {
  font-size: 12px;
  color: var(--muted);
}

.progress_bar {
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  border: 1px solid var(--border);
}

.progress_bar span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(212, 177, 106, 0.9), rgba(212, 177, 106, 0.35));
}

.panel_hint {
  color: var(--muted);
  font-size: 13px;
  margin-top: auto;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btnMini {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  border-radius: 10px;
  padding: 7px 10px;
  font-size: 12px;
  cursor: pointer;
}

.btnMini:hover {
  border-color: rgba(212, 177, 106, 0.35);
  background: rgba(212, 177, 106, 0.08);
}

.btnMini_danger:hover {
  border-color: rgba(248, 113, 113, 0.35);
  background: rgba(248, 113, 113, 0.08);
}
</style>
