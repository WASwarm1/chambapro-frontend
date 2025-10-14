<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../iam/stores/auth.store.js';
import { ReserveApi } from '../../work/infrastructure/reserve.api.js';
import { ReviewsApi } from '../../user/infrastructure/reviews.api.js';

import MonthlyIncomeChart from '../components/monthly-income-chart.component.vue';
import RatingsChart from '../components/ratings-chart.component.vue';
import ServicesChart from '../components/services-chart.component.vue';

import WorkerNavbar from '../../../public/components/worker-navbar.component.vue';

const { t } = useI18n();
const authStore = useAuthStore();

const loading = ref(true);
const statsData = ref({
  monthlyIncome: [],
  ratings: [],
  services: [],
  metrics: {
    totalIncome: 0,
    averageRating: 0,
    completedServices: 0
  }
});

const reservationsApi = new ReserveApi();
const reviewsApi = new ReviewsApi();

const formattedTotalIncome = computed(() => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(statsData.value.metrics.totalIncome);
});

const formattedAverageRating = computed(() => {
  return statsData.value.metrics.averageRating.toFixed(1);
});

onMounted(async () => {
  await loadStatistics();
});

async function loadStatistics() {
  loading.value = true;
  try {
    const reservations = await reservationsApi.getByTechnicianId(authStore.user.id);

    const reviews = await reviewsApi.getByTechnicianId(authStore.user.id);

    processStatistics(reservations, reviews);

  } catch (error) {
    console.error('Error loading statistics:', error);
  } finally {
    loading.value = false;
  }
}

function processStatistics(reservations, reviews) {
  const completedReservations = reservations.filter(r => r.status === 'completed' || r.status === 'confirmed');

  const monthlyIncome = calculateMonthlyIncome(completedReservations);

  const ratings = calculateRatingsDistribution(reviews);

  const services = calculateServicesByType(completedReservations);

  const metrics = calculateMetrics(completedReservations, reviews);

  statsData.value = {
    monthlyIncome,
    ratings,
    services,
    metrics
  };
}

function calculateMonthlyIncome(reservations) {
  const monthlyData = {};

  reservations.forEach(reservation => {
    const date = new Date(reservation.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = 0;
    }

    monthlyData[monthYear] += reservation.estimatedCost || reservation.cost || 0;
  });

  return Object.entries(monthlyData)
      .map(([month, income]) => ({
        month,
        income
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
}

function calculateRatingsDistribution(reviews) {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach(review => {
    const rating = Math.round(review.rating);
    if (distribution[rating] !== undefined) {
      distribution[rating]++;
    }
  });

  return Object.entries(distribution).map(([rating, count]) => ({
    rating: parseInt(rating),
    count
  }));
}

function calculateServicesByType(reservations) {
  const servicesByType = {};

  reservations.forEach(reservation => {
    const type = reservation.category || reservation.serviceType || 'General';

    if (!servicesByType[type]) {
      servicesByType[type] = 0;
    }

    servicesByType[type]++;
  });

  return Object.entries(servicesByType).map(([type, count]) => ({
    type,
    count
  }));
}

function calculateMetrics(reservations, reviews) {
  const totalIncome = reservations.reduce((sum, reservation) =>
      sum + (reservation.estimatedCost || reservation.cost || 0), 0
  );

  const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const completedServices = reservations.length;

  return {
    totalIncome,
    averageRating,
    completedServices
  };
}

function refreshStatistics() {
  loadStatistics();
}
</script>

<template>
  <worker-navbar/>
  <div class="statistics-page">
    <div class="page-header">
      <h1>{{ t('statistics.title') }}</h1>
      <pv-button
          icon="pi pi-refresh"
          :label="t('statistics.refresh')"
          @click="refreshStatistics"
          :disabled="loading"
          severity="secondary"
      />
    </div>

    <div v-if="loading" class="loading-state">
      <i class="pi pi-spinner pi-spin"></i>
      <p>{{ t('statistics.loading') }}</p>
    </div>

    <div v-else class="statistics-content">
      <div class="metrics-row">
        <div class="metric-card income-card">
          <div class="metric-icon">
            <i class="pi pi-money-bill"></i>
          </div>
          <div class="metric-content">
            <h3 class="metric-title">{{ t('statistics.totalIncome') }}</h3>
            <p class="metric-value">{{ formattedTotalIncome }}</p>
            <span class="metric-subtitle">{{ t('statistics.lifetime') }}</span>
          </div>
        </div>

        <div class="metric-card rating-card">
          <div class="metric-icon">
            <i class="pi pi-star"></i>
          </div>
          <div class="metric-content">
            <h3 class="metric-title">{{ t('statistics.averageRating') }}</h3>
            <p class="metric-value">{{ formattedAverageRating }}<span class="metric-unit">/5</span></p>
            <span class="metric-subtitle">{{ t('statistics.fromReviews', { count: statsData.ratings.reduce((sum, r) => sum + r.count, 0) }) }}</span>
          </div>
        </div>

        <div class="metric-card services-card">
          <div class="metric-icon">
            <i class="pi pi-briefcase"></i>
          </div>
          <div class="metric-content">
            <h3 class="metric-title">{{ t('statistics.completedServices') }}</h3>
            <p class="metric-value">{{ statsData.metrics.completedServices }}</p>
            <span class="metric-subtitle">{{ t('statistics.servicesCompleted') }}</span>
          </div>
        </div>
      </div>

      <div class="charts-row">
        <div class="chart-container">
          <pv-card class="chart-card">
            <template #title>
              <h3>{{ t('statistics.monthlyIncome') }}</h3>
            </template>
            <template #content>
              <MonthlyIncomeChart :data="statsData.monthlyIncome" />
            </template>
          </pv-card>
        </div>

        <div class="chart-container">
          <pv-card class="chart-card">
            <template #title>
              <h3>{{ t('statistics.ratingsDistribution') }}</h3>
            </template>
            <template #content>
              <RatingsChart :data="statsData.ratings" />
            </template>
          </pv-card>
        </div>
      </div>

      <div class="services-row">
        <div class="chart-container full-width">
          <pv-card class="chart-card">
            <template #title>
              <h3>{{ t('statistics.servicesByType') }}</h3>
            </template>
            <template #content>
              <ServicesChart :data="statsData.services" />
            </template>
          </pv-card>
        </div>
      </div>

      <div v-if="statsData.metrics.completedServices === 0" class="no-data-state">
        <i class="pi pi-chart-line"></i>
        <h3>{{ t('statistics.noDataTitle') }}</h3>
        <p>{{ t('statistics.noDataMessage') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statistics-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  color: #6c757d;
}

.loading-state .pi-spinner {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  display: flex;
  align-items: center;
  padding: 2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.income-card {
  border-left-color: #27ae60;
}

.rating-card {
  border-left-color: #f39c12;
}

.services-card {
  border-left-color: #3498db;
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 1.5rem;
  font-size: 1.5rem;
  color: white;
}

.income-card .metric-icon {
  background-color: #27ae60;
}

.rating-card .metric-icon {
  background-color: #f39c12;
}

.services-card .metric-icon {
  background-color: #3498db;
}

.metric-content {
  flex: 1;
}

.metric-title {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  margin: 0 0 0.25rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
}

.metric-unit {
  font-size: 1rem;
  color: #6c757d;
  font-weight: 400;
}

.metric-subtitle {
  font-size: 0.875rem;
  color: #6c757d;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-container {
  width: 100%;
}

.full-width {
  grid-column: 1 / -1;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
}





.services-row {
  width: 100%;
}

.services-row .chart-container {
  max-width: 100%;
}

.services-row .chart-card {
  height: auto;
}



.no-data-state {
  text-align: center;
  padding: 4rem;
  color: #6c757d;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.no-data-state .pi-chart-line {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #bdc3c7;
}

.no-data-state h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.no-data-state p {
  margin: 0;
  font-size: 1.1rem;
}

@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .statistics-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .metrics-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .metric-card {
    padding: 1.5rem;
  }

  .metric-value {
    font-size: 2rem;
  }

  .metric-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
    margin-right: 1rem;
  }

  .charts-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }


}

@media (max-width: 480px) {
  .metric-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1rem;
  }

  .metric-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .metric-value {
    font-size: 1.75rem;
  }
}
</style>