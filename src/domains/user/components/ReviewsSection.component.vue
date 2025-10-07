<script setup>
import { ref } from 'vue';
defineProps({
  reviews: { type: Array, required: true }
});
const emit = defineEmits(['reviewSubmitted']);
const newReviewText = ref('');
function submitReview() {
  if (!newReviewText.value.trim()) return;
  emit('reviewSubmitted', newReviewText.value);
  newReviewText.value = '';
}
</script>

<template>
  <div>
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
        <textarea v-model="newReviewText" placeholder="Comparte tu experiencia..." rows="4" class="review-textarea"></textarea>
        <button type="submit" class="secondary-button">Enviar Reseña</button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.review-item {
  padding-bottom:1.5rem;
  margin-bottom:1.5rem;
  border-bottom:1px solid #eee
}
.review-item:last-child {
  border-bottom:none;
  margin-bottom:0
}
.review-author {
  margin:0 0 .25rem;
  font-weight:700
}
.review-rating {
  margin:.2rem 0
}
.review-text {
  margin:.5rem 0 0;
  color:#555;
  line-height:1.5;
  font-style:italic
}
.star-icon {
  color:#ffc107;
  font-size:1.2rem
}
.review-star{
  color:#ddd
}
.review-star.filled{
  color:#ffc107
}
.new-review-form{
  margin-top:1.5rem
}
.review-textarea{
  width:100%;
  box-sizing:border-box;
  padding:.8rem;
  border:1px solid #ccc;
  border-radius:4px;
  font-size:1rem;
  margin-bottom:1rem;
  resize:vertical
}
.secondary-button{
  padding:.8rem 1.5rem;
  border:none;
  border-radius:5px;
  cursor:pointer;
  font-weight:700;
  font-size:1rem;
  background-color:#16a085;
  color:#fff
}
.separator{
  border:none;
  border-top:1px solid #e0e0e0;
  margin:2rem 0
}
</style>