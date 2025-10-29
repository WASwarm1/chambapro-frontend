<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ReserveCardComponent from './reserve-card.component.vue';
import { ReserveApi } from '../infrastructure/reserve.api.js';
import { ReserveAssembler } from '../infrastructure/reserve.assembler.js';

const { t } = useI18n();
const reservations = ref([]);
const loading = ref(false);
const error = ref(null);
const api = new ReserveApi();

const sortedReserves = computed(() => {
  return [...reservations.value].sort((a, b) => {
    const dateComparison = new Date(a.date) - new Date(b.date);
    if (dateComparison !== 0) return dateComparison;

    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }

    return 0;
  });
});

onMounted(async () => {
  loading.value = true;
  try {
    const dtos = await api.getAll();
    reservations.value = ReserveAssembler.toEntities(dtos);
  } catch (err) {
    console.error('Error loading reservations:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section aria-labelledby="my-reservations-title" class="reserve-list-section">
    <pv-card>
      <template #title>
        <div class="section-header">
          <h2 id="my-reservations-title" class="section-title">
            {{ t('reserve.myReservationAgenda') }}
          </h2>
          <div v-if="reservations.length > 0" class="reservation-count">
            <pv-tag :value="`${reservations.length} ${t('reserve.reservations')}`" severity="info" />
          </div>
        </div>
      </template>
      <template #content>
        <div v-if="loading" class="loading-state">
          <i class="pi pi-spinner pi-spin" style="font-size: 2rem"></i>
          <p>{{ t('reserve.loading') }}</p>
        </div>

        <div v-else-if="error" class="error-state">
          <i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
          <p>{{ t('reserve.error') }}: {{ error }}</p>
          <pv-button
              @click="$router.go(0)"
              :label="t('reserve.retry')"
              severity="secondary"
              class="mt-2"
          />
        </div>

        <div v-else-if="sortedReserves.length > 0" class="reservations-container">
          <div class="reservations-grid">
            <reserve-card-component
                v-for="reserve in sortedReserves"
                :key="reserve.id"
                :reserve="reserve"
            />
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-calendar" style="font-size: 2rem"></i>
          <p>{{ t('reserve.noReservations') }}</p>
        </div>
      </template>
    </pv-card>
  </section>
</template>

<style scoped>
.reserve-list-section {
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.reservation-count {
  display: flex;
  align-items: center;
}

.reservations-container {
  padding: 1rem 0;
}

.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-state {
  color: #dc3545;
}

@media (max-width: 768px) {
  .reserve-list-section {
    padding: 1rem;
  }

  .reservations-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>