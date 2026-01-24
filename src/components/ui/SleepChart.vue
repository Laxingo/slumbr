<template>
  <div class="chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'

const props = defineProps({
  sleepData: {
    type: Array,
    default: () => []
  }
})

const chartCanvas = ref(null)
let chart = null

function msToHours(ms) {
  return +(ms / (1000 * 60 * 60)).toFixed(1)
}

function getMonthBounds(dateMs) {
  const d = new Date(dateMs)
  return {
    firstDay: new Date(d.getFullYear(), d.getMonth(), 1),
    lastDay: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
  }
}

function renderChart() {
  if (!chartCanvas.value) return

  if (chart) {
    chart.destroy()
    chart = null
  }

  if (!props.sleepData || props.sleepData.length === 0) return


  const sorted = [...props.sleepData].sort((a, b) => (a.date || 0) - (b.date || 0))

  const dataPoints = sorted
    .filter(s => s?.date && s?.duration)
    .map(s => ({
      x: new Date(s.date),
      y: msToHours(s.duration)
    }))

  if (!dataPoints.length) return

  const { firstDay, lastDay } = getMonthBounds(sorted[0].date)

  chart = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Sleep duration (hours)',
          data: dataPoints,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      parsing: false,

      plugins: {
        legend: {
          display: true
        }
      },

      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'MMM d'
          },
          min: firstDay,
          max: lastDay,
          grid: {
            color: 'rgba(255,255,255,0.06)'
          },
          ticks: {
            color: 'rgba(255,255,255,0.68)'
          },
          title: {
            display: true,
            text: 'Day',
            color: 'rgba(255,255,255,0.68)'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255,255,255,0.06)'
          },
          ticks: {
            color: 'rgba(255,255,255,0.68)'
          },
          title: {
            display: true,
            text: 'Hours',
            color: 'rgba(255,255,255,0.68)'
          }
        }
      }
    }
  })
}

onMounted(renderChart)
watch(() => props.sleepData, renderChart, { deep: true })
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%; 
}

canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
