<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const technician = reactive({
  name: 'Carlos Mendoza',
  specialty: 'Especialista en Plomeria',
  rating: 4.9,
  reviewsCount: 125,
  avatar: 'https://i.pravatar.cc/150?u=carlosmendoza',
});

const reviews = ref([
  {
    id: 1,
    author: 'Laura M.',
    stars: 5,
    text: 'Excelente servicio. Ricardo fue muy profesional y solucionó el problema rápidamente. Lo recomiendo.',
  },
  {
    id: 2,
    author: 'Carlos F.',
    stars: 3,
    text: 'Buen trabajo.',
  },
]);

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

      <section class="profile-card">
        <img :src="technician.avatar" alt="Foto de perfil del técnico" class="profile-avatar" />
        <div class="profile-info">
          <h1 class="technician-name">{{ technician.name }}</h1>
          <p class="technician-specialty">{{ technician.specialty }}</p>
          <div class="technician-rating">
            <span class="star-icon">★</span>
            <span>{{ technician.rating }}</span>
            <span class="reviews-count">({{ technician.reviewsCount }} reseñas)</span>
          </div>
          <button class="primary-button">Contratar Servicio</button>
        </div>
      </section>

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
    </main>
  </div>
</template>

<style scoped>
/* Color de fondo para toda la página (el gris clarito) */
.page-background {
  background-color: #f0f2f5;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  margin-top: 1rem;
}

/* El contenedor blanco principal con bordes redondeados y sombra */
.profile-container {
  text-align: left;
  max-width: 900px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #555;
  text-decoration: none;
  font-weight: bold;
}

.profile-card {
  display: flex;
  flex-wrap: wrap;
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
  margin: 0 0 0.25rem;
  font-weight: bold;
}

.review-rating {
  margin: 0.2rem 0;
}

.review-text {
  margin: 0.5rem 0 0;
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
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
}

.primary-button,
.secondary-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  background-color: #16a085;
  color: white;
  transition: background-color 0.2s;
}
.primary-button:hover,
.secondary-button:hover {
  background-color: #117a65;
}

.separator {
  border: none;
  border-top: 2px solid #e0e0e0;
  margin: 2rem 0;
}
</style>