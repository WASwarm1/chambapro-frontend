<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  reserva: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const { t } = useI18n();

function formatDateTime(date, time) {
  if (!date && !time) return t('reserva.noDateTime');

  const dateStr = date || '';
  const timeStr = time || '';

  return `${dateStr}${dateStr && timeStr ? ', ' : ''}${timeStr}`;
}
</script>

<template>
  <pv-card class="reserva-card" aria-labelledby="reserva-title">
    <template #header>
      <div class="card-header">
        <i class="pi pi-calendar mr-2" style="font-size: 1.25rem"></i>
        <span class="reservation-date">{{ formatDateTime(reserva.date, reserva.time) }}</span>
      </div>
    </template>

    <template #title>
      <h3 id="reserva-title" class="reserva-title">
        {{ reserva.description }}
      </h3>
    </template>

    <template #content>
      <div class="reserva-details">
        <div class="detail-item">
          <i class="pi pi-user mr-2"></i>
          <span><strong>{{ t('reserva.client') }}:</strong> {{ reserva.client || t('reserva.noClient') }}</span>
        </div>

        <div v-if="reserva.category" class="detail-item">
          <i class="pi pi-tag mr-2"></i>
          <span><strong>{{ t('reserva.category') }}:</strong> {{ reserva.category }}</span>
        </div>

        <div v-if="reserva.status" class="detail-item">
          <i class="pi pi-info-circle mr-2"></i>
          <span><strong>{{ t('reserva.status') }}:</strong> </span>
          <pv-tag
              :value="reserva.status"
              :severity="getStatusSeverity(reserva.status)"
              class="ml-2"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="card-footer">
        <pv-button
            v-if="reserva.infoUrl"
            :label="t('reserva.moreDetails')"
            icon="pi pi-external-link"
            severity="secondary"
            @click="$router.push(reserva.infoUrl)"
            class="details-button"
        />
        <pv-button
            v-else
            :label="t('reserva.viewDetails')"
            icon="pi pi-eye"
            severity="secondary"
            outlined
            class="details-button"
        />
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.reserva-card {
  margin: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.reserva-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem 0;
  color: #6c757d;
  font-weight: 500;
}

.reservation-date {
  font-size: 0.9rem;
}

.reserva-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
  margin: 0.5rem 0;
  text-align: left;
}

.reserva-details {
  padding: 0.5rem 0;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #495057;
  font-size: 0.9rem;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.details-button {
  width: auto;
}

:deep(.p-card-header) {
  padding-bottom: 0;
}

:deep(.p-card-title) {
  margin-bottom: 0.5rem;
}

:deep(.p-card-content) {
  padding: 0 1.25rem;
  flex: 1;
}

:deep(.p-card-footer) {
  padding: 1rem 1.25rem;
}
</style>

<script>
// Separate script for helper functions
export default {
  methods: {
    getStatusSeverity(status) {
      if (!status) return 'info';

      const statusLower = status.toLowerCase();
      switch (statusLower) {
        case 'confirmed':
        case 'confirmada':
        case 'completed':
        case 'completado':
          return 'success';
        case 'pending':
        case 'pendiente':
          return 'warning';
        case 'cancelled':
        case 'cancelada':
        case 'rejected':
        case 'rechazada':
          return 'danger';
        default:
          return 'info';
      }
    }
  }
}
</script>