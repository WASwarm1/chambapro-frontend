<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { TechnicianApi } from '../infrastructure/technician.api.js'; // Verifica esta ruta
import TechnicianProfileCardComponent from './technician-profile-card.component.vue';
import ReviewsSectionComponent from "./reviews-section.component.vue";

const { t } = useI18n();
const route = useRoute();
const technician = ref(null);
const loading = ref(false);
const error = ref(null);

const technicianApi = new TechnicianApi();

onMounted(async () => {
  await loadTechnician();
});

async function loadTechnician() {
  loading.value = true;
  error.value = null;

  try {
    const technicianId = route.params.id;
    if (technicianId) {
      console.log('Loading technician with ID:', technicianId);
      technician.value = await technicianApi.getById(technicianId);
      console.log('Technician loaded:', technician.value);
    } else {
      error.value = 'No technician ID provided';
    }
  } catch (err) {
    console.error('Error loading technician:', err);
    error.value = err.message || 'Failed to load technician';
  } finally {
    loading.value = false;
  }
}

function handleReviewSubmitted(reviewText) {
  console.log('Nueva reseña recibida:', reviewText);
  alert('¡Gracias por tu reseña!');
}
</script>

<template>
  <div class="page-background">
    <main class="profile-container">
      <a href="/client/tech-search" class="back-link">&larr; {{ t('profile.backToSearch') }}</a>

      <div v-if="loading" class="loading-state">
        <p>{{ t('profile.loading') }}</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ t('profile.loadError') }}: {{ error }}</p>
        <button @click="loadTechnician" class="retry-button">
          {{ t('search.retry') }}
        </button>
      </div>

      <template v-else-if="technician">
        <TechnicianProfileCardComponent :technician="technician" />
        <ReviewsSectionComponent
            :technician="technician"
            :reviews="technician.reviews || []"
            @review-submitted="handleReviewSubmitted"
        />
      </template>

      <div v-else class="no-technician">
        <p>{{ t('profile.notFound') }}</p>
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
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #555;
  text-decoration: none;
  font-weight: 700;
}

.back-link:hover {
  color: #333;
}

.loading-state, .error-state, .no-technician {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.error-state {
  color: #dc3545;
}

.retry-button {
  background-color: #20b2aa;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.retry-button:hover {
  background-color: #1b9a92;
}
</style>