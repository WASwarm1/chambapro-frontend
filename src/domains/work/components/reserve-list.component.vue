<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ReserveCardComponent from './reserve-card.component.vue';
import { ReserveApi } from '../infrastructure/reserve.api.js';
import { ReserveAssembler } from '../infrastructure/reserve.assembler.js';

const { t } = useI18n();
const reservas = ref([]);
const loading = ref(false);
const error = ref(null);
const api = new ReserveApi();

const reservasOrdenadas = computed(() => {
  return [...reservas.value].sort((a, b) => {
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
    reservas.value = ReserveAssembler.toEntities(dtos);
  } catch (err) {
    console.error('Error loading reservations:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section aria-labelledby="my-reservations-title" class="reserva-list-section">
    <pv-card>
      <template #title>
        <div class="section-header">
          <h2 id="my-reservations-title" class="section-title">
            {{ t('reserva.myReservationAgenda') }}
          </h2>
          <div v-if="reservas.length > 0" class="reservation-count">
            <pv-tag :value="`${reservas.length} ${t('reserva.reservations')}`" severity="info" />
          </div>
        </div>
      </template>
      <template #content>
        <div v-if="loading" class="loading-state">
          <i class="pi pi-spinner pi-spin" style="font-size: 2rem"></i>
          <p>{{ t('reserva.loading') }}</p>
        </div>

        <div v-else-if="error" class="error-state">
          <i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
          <p>{{ t('reserva.error') }}: {{ error }}</p>
          <pv-button
              @click="$router.go(0)"
              :label="t('reserva.retry')"
              severity="secondary"
              class="mt-2"
          />
        </div>

        <div v-else-if="reservasOrdenadas.length > 0" class="reservas-container">
          <div class="reservas-grid">
            <reserve-card-component
                v-for="reserva in reservasOrdenadas"
                :key="reserva.id"
                :reserva="reserva"
            />
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-calendar" style="font-size: 2rem"></i>
          <p>{{ t('reserva.noReservations') }}</p>
          <pv-button
              :label="t('reserva.createReservation')"
              icon="pi pi-plus"
              class="mt-2"
          />
        </div>
      </template>
    </pv-card>
  </section>
</template>

<style scoped>
.reserva-list-section {
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

.reservas-container {
  padding: 1rem 0;
}

.reservas-grid {
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
  .reserva-list-section {
    padding: 1rem;
  }

  .reservas-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>