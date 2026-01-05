<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import Chart from "chart.js/auto";
import 'chartjs-adapter-date-fns'

const props = defineProps({
  sleepData: {
    type: Array,
    default: () => []
  }
});

const chartCanvas = ref(null);
let chart = null;

function msToHours(ms) {
  return +(ms / (1000 * 60 * 60)).toFixed(1); // return number, not string
}

function getMonthBounds(date) {
  const d = new Date(date);
  return {
    firstDay: new Date(d.getFullYear(), d.getMonth(), 1),
    lastDay: new Date(d.getFullYear(), d.getMonth() + 1, 0)
  }
}

function renderChart() {
  if (!chartCanvas.value || props.sleepData.length === 0) return;

  if (chart) chart.destroy();

  // Use data points {x: date, y: value}
  const dataPoints = props.sleepData.map(s => ({
    x: new Date(s.date),
    y: msToHours(s.duration)
  }));

  // Determine month bounds from first data point
  const { firstDay, lastDay } = getMonthBounds(props.sleepData[0].date);

  chart = new Chart(chartCanvas.value, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Duração de Sono por dia (horas)",
          data: dataPoints,
          borderWidth: 2,
          tension: 0.3
        }
      ]
    },
    options: {
      parsing: false, // required for x/y objects
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'MMM d', // date-fns format
          },
          min: firstDay,
          max: lastDay,
          title: {
            display: true,
            text: 'Dia'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Horas de Sono'
          }
        }
      }
    }
  });
}

onMounted(renderChart);
watch(() => props.sleepData, renderChart, { deep: true });
</script>

<style scoped>
canvas {
  margin: 20px;
  max-width: 100%;
}
</style>
