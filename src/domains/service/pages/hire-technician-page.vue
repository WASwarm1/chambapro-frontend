<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../iam/stores/auth.store.js';
import { TechnicianApi } from '../../user/infrastructure/technician.api.js';
import { ReserveApi } from '../infrastructure/reserve.api.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const technician = ref(null);
const loading = ref(false);
const submitting = ref(false);
const error = ref(null);

const formData = ref({
  serviceType: '',
  serviceDescription: '',
  serviceDate: '',
  serviceTime: '',
  address: '',
  estimatedHours: 1,
  urgency: 'normal',
  specialInstructions: ''
});

const technicianApi = new TechnicianApi();
const reserveApi = new ReserveApi();

const minDate = computed(() => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split('T')[0];
});

const urgencyOptions = ref([
  { label: t('hire.urgencyNormal'), value: 'normal' },
  { label: t('hire.urgencyHigh'), value: 'high' },
  { label: t('hire.urgencyEmergency'), value: 'emergency' }
]);

const timeSlots = computed(() => {
  const slots = [];
  for (let hour = 8; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 18) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
});

const totalCost = computed(() => {
  if (!technician.value || !formData.value.estimatedHours) return 0;
  const hourlyRate = technician.value.hourlyRate || 40;
  return hourlyRate * formData.value.estimatedHours;
});

onMounted(async () => {
  await loadTechnician();
});

async function loadTechnician() {
  loading.value = true;
  error.value = null;

  try {
    const technicianId = route.params.id;
    if (technicianId) {
      technician.value = await technicianApi.getById(technicianId);

      formData.value.serviceType = technician.value.speciality;
    } else {
      error.value = t('hire.noTechnicianId');
    }
  } catch (err) {
    console.error('Error loading technician:', err);
    error.value = t('hire.loadError');
  } finally {
    loading.value = false;
  }
}

async function submitHireRequest() {
  if (!authStore.isAuthenticated || !authStore.isClient) {
    alert(t('hire.loginRequired'));
    router.push('/client/auth');
    return;
  }

  if (!validateForm()) {
    return;
  }

  submitting.value = true;

  try {
    const reservationData = {
      clientId: authStore.user.id,
      technicianId: technician.value.id,
      date: formData.value.serviceDate,
      time: formData.value.serviceTime,
      description: formData.value.serviceDescription,
      category: formData.value.serviceType,
      status: 'pending',
      estimatedCost: totalCost.value,
      estimatedDuration: `${formData.value.estimatedHours} ${t('hire.hours')}`,
      address: formData.value.address,
      specialInstructions: formData.value.specialInstructions,
      urgency: formData.value.urgency,
      clientName: `${authStore.user.name} ${authStore.user.lastname}`,
      technicianName: `${technician.value.name} ${technician.value.lastname}`
    };

    const result = await reserveApi.createReservation(reservationData);

    if (result.success) {
      alert(t('hire.successMessage'));
      router.push('/client/history');
    } else {
      error.value = result.message || t('hire.submitError');
    }
  } catch (err) {
    console.error('Error creating reservation:', err);
    error.value = t('hire.submitError');
  } finally {
    submitting.value = false;
  }
}

function validateForm() {
  if (!formData.value.serviceDescription.trim()) {
    error.value = t('hire.descriptionRequired');
    return false;
  }

  if (!formData.value.serviceDate) {
    error.value = t('hire.dateRequired');
    return false;
  }

  if (!formData.value.serviceTime) {
    error.value = t('hire.timeRequired');
    return false;
  }

  if (!formData.value.address.trim()) {
    error.value = t('hire.addressRequired');
    return false;
  }

  if (formData.value.estimatedHours < 1) {
    error.value = t('hire.invalidHours');
    return false;
  }

  const selectedDate = new Date(formData.value.serviceDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    error.value = t('hire.pastDate');
    return false;
  }

  error.value = null;
  return true;
}

function goBack() {
  router.back();
}
</script>

<template>
  <div class="page-background">
    <main class="hire-container">
      <div class="hire-header">
        <pv-button
            icon="pi pi-arrow-left"
            :label="t('hire.back')"
            link
            @click="goBack"
            class="back-button"
        />
        <h1>{{ t('hire.title') }}</h1>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="pi pi-spinner pi-spin"></i>
        <p>{{ t('hire.loading') }}</p>
      </div>

      <div v-else-if="error && !technician" class="error-state">
        <p>{{ error }}</p>
        <pv-button
            @click="loadTechnician"
            :label="t('search.retry')"
            class="retry-button"
        />
      </div>

      <div v-else-if="technician" class="hire-content">
        <div class="content-grid">
          <pv-card class="technician-card">
            <template #title>
              <h2>{{ t('hire.technicianInfo') }}</h2>
            </template>
            <template #content>
              <div class="technician-details">
                <div class="technician-header">
                  <img :src="technician.avatar" :alt="technician.name" class="technician-avatar" />
                  <div class="technician-info">
                    <h3>{{ technician.name }} {{ technician.lastname }}</h3>
                    <p class="specialty">{{ technician.speciality }}</p>
                    <div v-if="technician.rating" class="rating">
                      <span class="stars">★★★★★</span>
                      <span class="rating-value">{{ technician.rating }} ({{ technician.reviewsCount }} {{ t('profile.reviews') }})</span>
                    </div>
                  </div>
                </div>
                <p class="technician-description">{{ technician.description }}</p>
              </div>
            </template>
          </pv-card>

          <pv-card class="form-card">
            <template #title>
              <h2>{{ t('hire.serviceDetails') }}</h2>
            </template>
            <template #content>
              <form @submit.prevent="submitHireRequest" class="hire-form">
                <div class="form-field">
                  <label for="serviceType" class="field-label">{{ t('hire.serviceType') }}</label>
                  <pv-input-text
                      id="serviceType"
                      v-model="formData.serviceType"
                      :placeholder="t('hire.serviceTypePlaceholder')"
                      class="field-input"
                      required
                  />
                </div>

                <div class="form-field">
                  <label for="serviceDescription" class="field-label">{{ t('hire.serviceDescription') }}</label>
                  <pv-textarea
                      id="serviceDescription"
                      v-model="formData.serviceDescription"
                      :placeholder="t('hire.serviceDescriptionPlaceholder')"
                      rows="4"
                      class="field-input"
                      required
                  />
                </div>

                <div class="form-row">
                  <div class="form-field">
                    <label for="serviceDate" class="field-label">{{ t('hire.serviceDate') }}</label>
                    <pv-input-text
                        id="serviceDate"
                        v-model="formData.serviceDate"
                        type="date"
                        :min="minDate"
                        class="field-input"
                        required
                    />
                  </div>

                  <div class="form-field">
                    <label for="serviceTime" class="field-label">{{ t('hire.serviceTime') }}</label>
                    <pv-dropdown
                        id="serviceTime"
                        v-model="formData.serviceTime"
                        :options="timeSlots"
                        :placeholder="t('hire.selectTime')"
                        class="field-input"
                        required
                    />
                  </div>
                </div>

                <div class="form-field">
                  <label for="address" class="field-label">{{ t('hire.address') }}</label>
                  <pv-textarea
                      id="address"
                      v-model="formData.address"
                      :placeholder="t('hire.addressPlaceholder')"
                      rows="2"
                      class="field-input"
                      required
                  />
                </div>

                <div class="form-row">
                  <div class="form-field">
                    <label for="estimatedHours" class="field-label">{{ t('hire.estimatedHours') }}</label>
                    <pv-input-number
                        id="estimatedHours"
                        v-model="formData.estimatedHours"
                        :min="1"
                        :max="8"
                        showButtons
                        class="field-input"
                    />
                  </div>

                  <div class="form-field">
                    <label for="urgency" class="field-label">{{ t('hire.urgency') }}</label>
                    <pv-dropdown
                        id="urgency"
                        v-model="formData.urgency"
                        :options="urgencyOptions"
                        optionLabel="label"
                        optionValue="value"
                        :placeholder="t('hire.selectUrgency')"
                        class="field-input"
                    />
                  </div>
                </div>

                <div class="form-field">
                  <label for="specialInstructions" class="field-label">{{ t('hire.specialInstructions') }}</label>
                  <pv-textarea
                      id="specialInstructions"
                      v-model="formData.specialInstructions"
                      :placeholder="t('hire.specialInstructionsPlaceholder')"
                      rows="3"
                      class="field-input"
                  />
                </div>

                <div class="cost-summary">
                  <h3>{{ t('hire.costSummary') }}</h3>
                  <div class="cost-details">
                    <div class="cost-item">
                      <span>{{ t('hire.hourlyRate') }}</span>
                      <span>${{ technician.hourlyRate || 40 }}/h</span>
                    </div>
                    <div class="cost-item">
                      <span>{{ t('hire.estimatedHours') }}</span>
                      <span>{{ formData.estimatedHours }} {{ t('hire.hours') }}</span>
                    </div>
                    <div class="cost-total">
                      <span><strong>{{ t('hire.totalCost') }}</strong></span>
                      <span><strong>${{ totalCost }}</strong></span>
                    </div>
                  </div>
                </div>

                <div v-if="error" class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  <span>{{ error }}</span>
                </div>

                <pv-button
                    type="submit"
                    :label="submitting ? t('hire.submitting') : t('hire.submitRequest')"
                    :loading="submitting"
                    :disabled="submitting"
                    class="submit-button"
                />
              </form>
            </template>
          </pv-card>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-background {
  background-color: #f0f2f5;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  min-height: 100vh;
}

.hire-container {
  max-width: 1000px;
  margin: 0 auto;
}

.hire-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.hire-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
}

.back-button {
  padding: 0;
}

.loading-state, .error-state {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-state {
  color: #dc3545;
}

.retry-button {
  margin-top: 1rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.technician-card, .form-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.technician-details {
  padding: 0.5rem 0;
}

.technician-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.technician-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.technician-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.specialty {
  margin: 0 0 0.5rem 0;
  color: #16a085;
  font-weight: 600;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  color: #ffc107;
  font-size: 1rem;
}

.rating-value {
  color: #666;
  font-size: 0.9rem;
}

.technician-description {
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.hire-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.field-input {
  width: 100%;
}

.cost-summary {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.cost-summary h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.cost-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cost-item, .cost-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.cost-total {
  border-bottom: none;
  padding-top: 0.5rem;
  border-top: 2px solid #16a085;
  font-size: 1.1rem;
}

.error-message {
  background-color: #fee;
  color: #dc3545;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-button {
  background-color: #16a085;
  border-color: #16a085;
  padding: 0.75rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.submit-button:hover {
  background-color: #117a65;
  border-color: #117a65;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .hire-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .hire-header h1 {
    font-size: 1.5rem;
  }
}
</style>
