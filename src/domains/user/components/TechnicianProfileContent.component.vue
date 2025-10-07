<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { TecnicoApi } from '../infrastructure/tecnico.api.js';
import TechnicianProfileCard from '../components/TechnicianProfileCard.component.vue';
import ReviewsSection from "./ReviewsSection.component.vue";


const { t } = useI18n();
const route = useRouter();
const technician = ref(null);
const reviews = computed(() => technician.value?.reviews || []);

onMounted(async () => {
  try {
    const technicianId = route.params.id;
    if (technicianId) {
      technician.value = await TecnicoApi.getById(technicianId);
    }
  } catch (error) {
    console.error(`Error al cargar los datos del técnico:`, error);
  }
});

function handleReviewSubmitted(reviewText) {
  console.log('Nueva reseña recibida:', reviewText);
  alert('¡Gracias por tu reseña!');
}
</script>

<template>
  <div class="page-background">
    <main class="profile-container">
      <a href="#" class="back-link">&larr; Volver a la búsqueda</a>
      <TechnicianProfileCard v-if="technician" :tecnico="technician" />
      <ReviewsSection v-if="technician" :reviews="reviews" @review-submitted="handleReviewSubmitted" />
      <div v-else>
        <p>Cargando perfil del técnico...</p>
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
.back-link{display:inline-block;
  margin-bottom:1.5rem;
  color:#555;
  text-decoration:none;
  font-weight:700
}
</style>