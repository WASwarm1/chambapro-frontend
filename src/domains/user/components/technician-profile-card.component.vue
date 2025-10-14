<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  technician: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <pv-card class="profile-card">
    <template #content>
      <div class="flex align-items-center gap-3">
        <img :src="technician.avatar" :alt="t('profile.avatarAlt')" class="profile-avatar" />
        <div class="profile-info">
          <h1 class="technician-name">{{ technician.name }} {{ technician.lastname }}</h1>
          <p class="technician-specialty">{{ technician.speciality }}</p>
          <div v-if="technician.rating" class="technician-rating">
            <span class="star-icon">★</span>
            <span>{{ technician.rating }}</span>
            <span class="reviews-count">({{ technician.reviewsCount }} {{ t('profile.reviews') }})</span>
          </div>
          <pv-button :label="t('profile.hireService')" class="primary-button" />
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.profile-card {
  margin-bottom: 2rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #eee;
}

.technician-name {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.technician-specialty {
  margin: 0.2rem 0;
  color: #666;
  font-size: 1.1rem;
}

.technician-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0 1rem;
}

.primary-button {
  background-color: #16a085;
  border-color: #16a085;
}

.primary-button:hover {
  background-color: #117a65;
  border-color: #117a65;
}

.star-icon {
  color: #ffc107;
  font-size: 1.2rem;
}
</style>