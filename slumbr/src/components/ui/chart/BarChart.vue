<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { defineProps } from 'vue'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  chartData: { type: Object, required: true },
  chartOptions: { type: Object, required: true }
})
</script>

<template>
  <Bar :data="props.chartData" :options="props.chartOptions" style="height: 40vh; width: 80vw;" />
</template>
