<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router'

const { t } = useI18n();
const router = useRouter()

const props = defineProps({
  technician: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const goToProfile = () => {
  if (props.technician.id) {
    router.push(`/client/profile/${props.technician.id}`);
  } else {
    console.error('Technician has no ID:', props.technician);
  }
}
</script>

<template>
  <article class="technician_card">
    <div class="technician_image">
      <img :src="technician.avatar" :alt="t('card.technicianImageAlt')"/>
    </div>
    <div class="technician_info">
      <header>
        <h3 class="technician_name">{{ technician.name }} {{ technician.lastname }}</h3>
        <h3 class="technician_speciality">{{ t('card.specialistIn') }} {{ technician.speciality }}</h3>
      </header>

      <p class="technician_description">{{ technician.description }}</p>

      <button class="profile_button" @click="goToProfile">{{ t('card.viewProfile') }}</button>
    </div>
  </article>
</template>

<style scoped>
.technician_card {
  display: flex;
  max-width: 850px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.technician_name {
  margin: 0 0 0.50rem 0;
  text-align: left;
}
.technician_speciality {
  margin: 0 0 0.50rem 0;
  color: #444;
  text-align: left;
}
.technician_description {
  color: #333;
  text-align: justify;
  font-size: 1.0rem;
  margin-bottom: 1rem;
}
.profile_button {
  background-color: #1b9a92;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s;
}
.profile_button:hover {
  background-color: #17817d;
}
</style>