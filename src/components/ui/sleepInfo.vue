<template>

    <div class="panel">
        <!-- General view -->
        <div class="panel_top">
            <div class="panel_dot"></div>
            <div class="panel_dot"></div>
            <div class="panel_dot"></div>
            <div class="panel_title">This week</div>
        </div>

        <div class="panel_stats">
            <div class="stat">
                <div class="stat_label">Avg. duration</div>
                <div class="stat_value">{{ metrics.avgDurationText }}</div>
            </div>

            <div class="stat">
                <div class="stat_label">Avg. regularity</div>
                <div class="stat_value">{{ metrics.regularityLabel }}</div>
            </div>

            <div class="stat">
                <div class="stat_label">Avg. quality</div>
                <div class="stat_value">{{ metrics.avgQualityText }}</div>
            </div>

        </div>

        <div class="panel_progress">
            <div class="progress">
                <div class="progress_label">Duration</div>
                <div class="progress_bar"><span :style="{ width: metrics.durationScore + '%' }"></span></div>
            </div>

            <div class="progress">
                <div class="progress_label">Regularity</div>
                <div class="progress_bar"><span :style="{ width: metrics.regularityScore + '%' }"></span></div>
            </div>

            <div class="progress">
                <div class="progress_label">Quality</div>
                <div class="progress_bar"><span :style="{ width: metrics.qualityScore + '%' }"></span></div>
            </div>

        </div>

        <div class="panel_hint">
            Based on your last {{ metrics.sampleSize }} logs.
        </div>
    </div>
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
        },
        metrics: {
            type: Object,
            required: true
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
/* Panel */
.panel {
    border: 1px solid var(--border);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03));
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
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

/* Table */
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
