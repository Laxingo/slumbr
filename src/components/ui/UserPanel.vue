<template>
    <div class="panel">
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
</template>

<script>
export default{
    props:{
        metrics: {
            type: Object,
            required: true
        }
    }
}

</script>

<style scoped>
/* usa as mesmas classes do teu tema (home.css),
   mas aqui ficam como fallback caso uses scoped */
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
</style>
