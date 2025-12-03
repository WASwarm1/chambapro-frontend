<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../iam/stores/auth.store.js';
import TechnicianNavbarComponent from '../../../public/components/technician-navbar.component.vue';
import { ReserveApi } from '../infrastructure/reserve.api.js';
import { ReserveAssembler } from '../infrastructure/reserve.assembler.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const reservation = ref(null);
const loading = ref(false);
const updating = ref(false);
const error = ref(null);

const reservationApi = new ReserveApi();

const statusOptions = ref([
  { label: t('reservation.statusPending'), value: 'Pending', severity: 'warning' },
  { label: t('reservation.statusAssigned'), value: 'Assigned', severity: 'info' },
  { label: t('reservation.statusCompleted'), value: 'Completed', severity: 'success' }
]);

const canAcceptReservation = computed(() => {
  return reservation.value &&
         reservation.value.status === 'Pending' &&
         reservation.value.technicianId === null &&
         authStore.isTechnician;
});

const canConfirmReservation = computed(() => {
  return reservation.value &&
         reservation.value.status === 'Pending' &&
         reservation.value.technicianId === authStore.user?.id;
});

const canCancelReservation = computed(() => {
  return reservation.value &&
         reservation.value.status !== 'Completed' &&
         reservation.value.status !== 'Cancelled' &&
         (reservation.value.technicianId === authStore.user?.id || authStore.isTechnician);
});

const canCompleteReservation = computed(() => {
  return reservation.value &&
         reservation.value.status === 'Assigned' &&
         reservation.value.technicianId === authStore.user?.id;
});

const getStatusSeverity = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'danger';
    case 'assigned':
      return 'info';
    default:
      return 'info';
  }
};

onMounted(async () => {
  await loadReservation();
});

async function loadReservation() {
  loading.value = true;
  error.value = null;

  try {
    const reservationId = route.params.id;
    if (reservationId) {
      const dto = await reservationApi.getById(reservationId);
      if (dto) {
        reservation.value = ReserveAssembler.toEntity(dto);
      } else {
        error.value = t('reservation.notFound');
      }
    } else {
      error.value = t('reservation.noId');
    }
  } catch (err) {
    console.error('Error loading reservation:', err);
    if (err.message.includes('404')) {
      error.value = t('reservation.notFound');
    } else {
      error.value = t('reservation.loadError');
    }
  } finally {
    loading.value = false;
  }
}

async function confirmReservation() {
  if (!canConfirmReservation.value) return;

  updating.value = true;
  try {
    await reservationApi.updateReservation(reservation.value.id, {
      status: 'Assigned',
      technicianId: authStore.user.id
    });

    reservation.value.status = 'Assigned';
    reservation.value.technicianId = authStore.user.id;

    alert(t('reservation.confirmedSuccessfully'));
  } catch (err) {
    console.error('Error confirming reservation:', err);
    error.value = t('reservation.confirmError');
  } finally {
    updating.value = false;
  }
}

async function cancelReservation() {
  if (!canCancelReservation.value) return;

  if (!confirm(t('reservation.confirmCancel'))) return;

  updating.value = true;
  try {
    await reservationApi.cancelReservation(reservation.value.id);

    reservation.value.status = 'Cancelled';

    alert(t('reservation.cancelledSuccessfully'));
  } catch (err) {
    console.error('Error cancelling reservation:', err);
    error.value = t('reservation.cancelError');
  } finally {
    updating.value = false;
  }
}

async function acceptReservation() {
  if (!canAcceptReservation.value) return;

  if (!confirm(t('reservation.confirmAccept'))) return;

  updating.value = true;
  try {
    await reservationApi.updateReservation(reservation.value.id, {
      status: 'Assigned',
      technicianId: authStore.user.id
    });

    reservation.value.status = 'Assigned';
    reservation.value.technicianId = authStore.user.id;

    alert(t('reservation.acceptedSuccessfully'));
  } catch (err) {
    console.error('Error accepting reservation:', err);
    error.value = t('reservation.acceptError');
  } finally {
    updating.value = false;
  }
}

async function completeReservation() {
  if (!canCompleteReservation.value) return;

  updating.value = true;
  try {
    await reservationApi.updateReservation(reservation.value.id, {
      status: 'Completed'
    });

    reservation.value.status = 'Completed';

    alert(t('reservation.completedSuccessfully'));
  } catch (err) {
    console.error('Error completing reservation:', err);
    error.value = t('reservation.completeError');
  } finally {
    updating.value = false;
  }
}

function goBack() {
  router.back();
}
</script>

<template>
  <div class="page-background">
    <TechnicianNavbarComponent />

    <main class="details-container">
      <div class="header">
        <pv-button
            icon="pi pi-arrow-left"
            :label="t('common.back')"
            link
            @click="goBack"
            class="back-button"
        />
        <h1>{{ t('reservation.details') }}</h1>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="pi pi-spinner pi-spin" style="font-size: 2rem"></i>
        <p>{{ t('reservation.loading') }}</p>
      </div>

      <div v-else-if="error" class="error-state">
        <i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
        <p>{{ error }}</p>
        <pv-button
            @click="loadReservation"
            :label="t('common.retry')"
            severity="secondary"
            class="mt-3"
        />
        <pv-button
            @click="goBack"
            :label="t('common.back')"
            severity="secondary"
            class="mt-3 ml-2"
            outlined
        />
      </div>

      <div v-else-if="reservation" class="reservation-details">
        <!-- Reservation Status -->
        <pv-card class="status-card">
          <template #title>
            <h3>{{ t('reservation.status') }}</h3>
          </template>
          <template #content>
            <div class="status-content">
              <pv-tag
                  :value="reservation.status"
                  :severity="getStatusSeverity(reservation.status)"
                  class="status-badge"
              />

              <div class="action-buttons" v-if="!updating">
                <pv-button
                    v-if="canAcceptReservation"
                    :label="t('reservation.accept')"
                    icon="pi pi-check"
                    @click="acceptReservation"
                    severity="success"
                    class="action-btn"
                />

                <pv-button
                    v-if="canConfirmReservation"
                    :label="t('reservation.confirm')"
                    icon="pi pi-check"
                    @click="confirmReservation"
                    severity="success"
                    class="action-btn"
                />

                <pv-button
                    v-if="canCancelReservation"
                    :label="t('reservation.cancel')"
                    icon="pi pi-times"
                    @click="cancelReservation"
                    severity="danger"
                    class="action-btn"
                    outlined
                />

                <pv-button
                    v-if="canCompleteReservation"
                    :label="t('reservation.confirmComplete')"
                    icon="pi pi-check-circle"
                    @click="completeReservation"
                    severity="success"
                    class="action-btn"
                />
              </div>

              <div v-if="updating" class="updating-indicator">
                <i class="pi pi-spinner pi-spin mr-2"></i>
                <span>{{ t('reservation.updating') }}</span>
              </div>
            </div>
          </template>
        </pv-card>

        <!-- Client Information -->
        <pv-card class="info-card">
          <template #title>
            <h3>{{ t('reservation.clientInfo') }}</h3>
          </template>
          <template #content>
            <div class="info-grid">
              <div class="info-item">
                <label>{{ t('reservation.clientName') }}:</label>
                <span>{{ reservation.client || t('reservation.notSpecified') }}</span>
              </div>
            </div>
          </template>
        </pv-card>

        <!-- Reservation Details -->
        <pv-card class="info-card">
          <template #title>
            <h3>{{ t('reservation.details') }}</h3>
          </template>
          <template #content>
            <div class="info-grid">
              <div class="info-item">
                <label>{{ t('reservation.serviceType') }}:</label>
                <span>{{ reservation.category || t('reservation.notSpecified') }}</span>
              </div>

              <div class="info-item">
                <label>{{ t('reservation.date') }}:</label>
                <span>{{ reservation.date ? new Date(reservation.date).toLocaleDateString() : t('reservation.notSpecified') }}</span>
              </div>

              <div class="info-item">
                <label>{{ t('reservation.time') }}:</label>
                <span>{{ reservation.time || t('reservation.notSpecified') }}</span>
              </div>
            </div>

            <div class="description-section">
              <label>{{ t('reservation.description') }}:</label>
              <p class="description-text">{{ reservation.description || t('reservation.noDescription') }}</p>
            </div>
          </template>
        </pv-card>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-background {
  background-color: #f0f2f5;
  padding: 2rem 1rem;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.details-container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
}

.back-button {
  padding: 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-state {
  color: #dc3545;
}

.reservation-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.status-card,
.info-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.status-content {
  padding: 1rem 0;
}

.status-badge {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 120px;
}

.updating-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  color: #6c757d;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.info-item span {
  color: #666;
}

.description-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.description-section label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  display: block;
}

.description-text {
  color: #666;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
}

@media (min-width: 600px) {
  .info-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .action-buttons {
    flex-direction: row;
  }
}

@media (max-width: 768px) {
  .page-background {
    padding: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
