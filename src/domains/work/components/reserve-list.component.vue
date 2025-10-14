<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ReserveCardComponent from './reserve-card.component.vue';
import { ReserveApi } from '../infrastructure/reserve.api.js';
import { ReserveAssembler } from '../infrastructure/reserve.assembler.js';

const { t } = useI18n();
const reservas = ref([]);
const loading = ref(false);
const error = ref(null);
const api = new ReserveApi();

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
        <h2 id="my-reservations-title" class="section-title">
          {{ t('reserva.myReservationAgenda') }}
        </h2>
      </template>
      <template #content>
        <div v-if="loading" class="loading-state">
          <p>{{ t('reserva.loading') }}</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>{{ t('reserva.error') }}: {{ error }}</p>
          <pv-button
              @click="$router.go(0)"
              :label="t('reserva.retry')"
              severity="secondary"
              class="mt-2"
          />
        </div>

        <div v-else-if="reservas.length > 0" class="reservas-grid">
          <reserve-card-component
              v-for="reserva in reservas"
              :key="reserva.id"
              :reserva="reserva"
          />
        </div>

        <div v-else class="empty-state">
          <p>{{ t('reserva.noReservations') }}</p>
        </div>
      </template>
    </pv-card>
  </section>
</template>

<style scoped>
.reserva-list-section {
  padding: 2rem;
}

.section-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.reservas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
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
}
</style>