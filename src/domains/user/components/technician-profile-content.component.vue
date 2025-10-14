<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { TechnicianApi } from '../infrastructure/technician.api.js';
import TechnicianProfileCardComponent from './technician-profile-card.component.vue';
import ReviewsSectionComponent from "./reviews-section.component.vue";

const { t } = useI18n();
const route = useRoute();
const technician = ref(null);
const reviews = computed(() => technician.value?.reviews || []);

onMounted(async () => {
  try {
    const technicianId = route.params.id;
    if (technicianId) {
      technician.value = await TechnicianApi.getById(technicianId);
    }
  } catch (error) {
    console.error(t('profile.loadError'), error);
  }
});

function handleReviewSubmitted(reviewText) {
  console.log(t('profile.newReviewReceived'), reviewText);
  alert(t('profile.thankYouReview'));
}
</script>

<template>
  <div class="page-background">
    <main class="profile-container">
      <pv-button
          icon="pi pi-arrow-left"
          :label="t('profile.backToSearch')"
          link
          @click="$router.push('/client/techsearch')"
          class="back-button"
      />
      <TechnicianProfileCardComponent v-if="technician" :technician="technician" />
      <ReviewsSectionComponent v-if="technician" :reviews="reviews" @review-submitted="handleReviewSubmitted" />
      <div v-else>
        <p>{{ t('profile.loading') }}</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-background{
  background-color:#f0f2f5;
  padding:2rem 1rem;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
  color:#333
}
.profile-container{
  max-width:900px;
  margin:0 auto;
  background-color:#fff;
  padding:2rem;
  border-radius:8px;
  box-shadow:0 4px 12px rgba(0,0,0,.1);
  text-align:left
}
.back-button{
  margin-bottom:1.5rem;
  padding: 0;
}
</style>