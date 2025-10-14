<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { DoughnutController, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(...registerables, DoughnutController, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const chartRef = ref(null);
const chartInstance = ref(null);

const backgroundColors = [
  '#16a085', '#3498db', '#9b59b6', '#e74c3c', '#f39c12',
  '#1abc9c', '#34495e', '#d35400', '#c0392b', '#8e44ad'
];

onMounted(() => {
  createChart();
});

watch(() => props.data, () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  createChart();
});

function createChart() {
  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext('2d');

  const labels = props.data.map(item => item.type);
  const data = props.data.map(item => item.count);

  chartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors.slice(0, data.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 15
          }
        }
      },
      cutout: '60%'
    }
  });
}
</script>

<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}
</style>