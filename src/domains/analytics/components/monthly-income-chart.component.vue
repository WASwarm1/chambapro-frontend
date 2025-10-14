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

const formatMonth = (monthString) => {
  const [year, month] = monthString.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
};

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

  const labels = props.data.map(item => formatMonth(item.month));
  const data = props.data.map(item => item.income);

  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Ingresos (S/)',
        data: data,
        backgroundColor: '#16a085',
        borderColor: '#117a65',
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
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Ingresos: S/ ${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'S/ ' + value;
            }
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