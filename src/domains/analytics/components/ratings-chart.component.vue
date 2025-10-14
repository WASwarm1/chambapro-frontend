<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(...registerables, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const chartRef = ref(null);
const chartInstance = ref(null);

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

  const labels = props.data.map(item => '★'.repeat(item.rating));
  const data = props.data.map(item => item.count);
  const backgroundColors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];

  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Cantidad de Reseñas',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
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