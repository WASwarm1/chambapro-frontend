<script setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const props = defineProps({
  reserve: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const { t } = useI18n();

const formattedDateTime = computed(() => {
  const { date, time } = props.reserve;
  if (!date && !time) return t('reserve.noDateTime');

  const dateStr = formatDate(date);
  const timeStr = formatTime(time);

  return `${dateStr}${dateStr && timeStr ? ', ' : ''}${timeStr}`;
});

const isUpcoming = computed(() => {
  if (!props.reserve.date) return false;

  const reservationDate = new Date(props.reserve.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return reservationDate >= today;
});

const isToday = computed(() => {
  if (!props.reserve.date) return false;

  const reservationDate = new Date(props.reserve.date);
  const today = new Date();

  return reservationDate.toDateString() === today.toDateString();
});

function formatDate(dateString) {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

function formatTime(timeString) {
  if (!timeString) return '';

  if (timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  return timeString;
}

function getStatusSeverity(status) {
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
</script>

<template>
  <pv-card
      class="reserve-card"
      aria-labelledby="reserve-title"
      :class="{ 'upcoming-reservation': isUpcoming, 'today-reservation': isToday }"
  >
    <template #header>
      <div class="card-header">
        <div class="date-time-container">
          <i class="pi pi-calendar mr-2" style="font-size: 1.25rem"></i>
          <span class="reservation-date">{{ formattedDateTime }}</span>
        </div>
        <div v-if="isToday" class="today-badge">
          <pv-tag :value="t('reserve.today')" severity="info" />
        </div>
        <div v-else-if="isUpcoming" class="upcoming-badge">
          <pv-tag :value="t('reserve.upcoming')" severity="success" />
        </div>
      </div>
    </template>

    <template #title>
      <h3 id="reserve-title" class="reserve-title">
        {{ reserve.description || t('reserve.noDescription') }}
      </h3>
    </template>

    <template #content>
      <div class="reserve-details">
        <div class="detail-item">
          <i class="pi pi-user mr-2"></i>
          <span><strong>{{ t('reserve.client') }}:</strong> {{ reserve.client || t('reserve.noClient') }}</span>
        </div>

        <div v-if="reserve.category" class="detail-item">
          <i class="pi pi-tag mr-2"></i>
          <span><strong>{{ t('reserve.category') }}:</strong> {{ reserve.category }}</span>
        </div>

        <div v-if="reserve.status" class="detail-item">
          <i class="pi pi-info-circle mr-2"></i>
          <span><strong>{{ t('reserve.status') }}:</strong> </span>
          <pv-tag
              :value="reserve.status"
              :severity="getStatusSeverity(reserve.status)"
              class="ml-2"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="card-footer">
        <pv-button
            v-if="reserve.infoUrl"
            :label="t('reserve.moreDetails')"
            icon="pi pi-external-link"
            severity="secondary"
            @click="$router.push(reserve.infoUrl)"
            class="details-button"
        />
        <pv-button
            v-else
            :label="t('reserve.viewDetails')"
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
.reserve-card {
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

.reserve-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
}

.today-reservation {
  border-left: 4px solid #007bff;
  background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
}

.upcoming-reservation {
  border-left: 4px solid #28a745;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem 0;
}

.date-time-container {
  display: flex;
  align-items: center;
  color: #6c757d;
  font-weight: 500;
}

.reservation-date {
  font-size: 0.9rem;
}

.today-badge,
.upcoming-badge {
  display: flex;
  align-items: center;
}

.reserve-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
  margin: 0.5rem 0;
  text-align: left;
}

.reserve-details {
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