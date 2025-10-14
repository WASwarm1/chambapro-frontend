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
  <section class="profile-card">
    <img :src="technician.avatar" :alt="t('profile.avatarAlt')" class="profile-avatar" />
    <div class="profile-info">
      <h1 class="technician-name">{{ technician.name }} {{ technician.lastname }}</h1>
      <p class="technician-specialty">{{ technician.specialty }}</p>
      <div v-if="technician.rating" class="technician-rating">
        <span class="star-icon">★</span>
        <span>{{ technician.rating }}</span>
        <span class="reviews-count">({{ technician.reviewsCount }} {{ t('profile.reviews') }})</span>
      </div>
      <button class="primary-button">{{ t('profile.hireService') }}</button>
    </div>
  </section>
</template>

<style scoped>
.profile-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
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
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  background-color: #16a085;
  color: white;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #117a65;
}

.star-icon {
  color: #ffc107;
  font-size: 1.2rem;
}
</style>