<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { TecnicoApi } from '../infrastructure/tecnico.api.js';
import TechnicianProfileCard from '../components/TechnicianProfileCard.component.vue';

const { t } = useI18n();


const technician = ref(null);

const reviews = computed(() => {
  return technician.value && technician.value.reviews ? technician.value.reviews : [];
});

onMounted(async () => {
  try {

    technician.value = await TecnicoApi.getById(1);
  } catch (error) {
    console.error("Error al cargar los datos del técnico:", error);

  }
});

const newReviewText = ref('');
function submitReview() {
  if (!newReviewText.value.trim()) {
    alert('Por favor, escribe algo en tu reseña.');
    return;
  }
  console.log('Enviando reseña:', newReviewText.value);
  alert('¡Gracias por tu reseña!');
  newReviewText.value = '';
}
</script>

<template>
  <div class="page-background">
    <main class="profile-container">
      <a href="#" class="back-link">&larr; Volver a la búsqueda</a>

      <TechnicianProfileCard v-if="technician" :tecnico="technician" />

      <div v-if="technician">
        <hr class="separator" />
        <section class="reviews-section">
          <h2>Reseñas de Clientes:</h2>
          <div class="reviews-list">
            <article v-for="review in reviews" :key="review.id" class="review-item">
              <p class="review-author"><strong>{{ review.author }}</strong></p>
              <div class="review-rating">
                <span v-for="n in 5" :key="n" class="star-icon review-star" :class="{ filled: n <= review.stars }">★</span>
              </div>
              <p class="review-text">"{{ review.text }}"</p>
            </article>
          </div>
        </section>

        <hr class="separator" />
        <section class="new-review-form">
          <h3>Deja tu reseña:</h3>
          <form @submit.prevent="submitReview">
            <textarea
                v-model="newReviewText"
                placeholder="Comparte tu experiencia..."
                rows="4"
                class="review-textarea"
            ></textarea>
            <button type="submit" class="secondary-button">Enviar Reseña</button>
          </form>
        </section>
      </div>

      <div v-else>
        <p>Cargando perfil del técnico...</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Nota cómo esta sección de estilos ahora es mucho más pequeña y limpia */

.page-background {
  background-color: #f0f2f5;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  margin-top: 2rem;
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #ffffff;
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

/* Los estilos de la tarjeta de perfil ya no están aquí, viven en su propio componente */

.review-item {
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}
.review-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.review-author {
  margin: 0 0 .25rem;
  font-weight: 700;
}

.review-rating {
  margin: .2rem 0;
}

.review-text {
  margin: .5rem 0 0;
  color: #555;
  line-height: 1.5;
  font-style: italic;
}

.star-icon {
  color: #ffc107;
  font-size: 1.2rem;
}

.review-star {
  color: #ddd;
}

.review-star.filled {
  color: #ffc107;
}

.new-review-form {
  margin-top: 1.5rem;
}

.review-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: .8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
}

.secondary-button {
  padding: .8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  background-color: #16a085;
  color: #fff;
  transition: background-color .2s;
}

.secondary-button:hover {
  background-color: #117a65;
}

.separator {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 2rem 0;
}
</style>