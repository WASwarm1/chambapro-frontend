<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
      <h2>{{ t('reviews.clientReviews') }}</h2>
      <div class="reviews-list">
        <pv-card v-for="review in reviews" :key="review.id" class="review-item">
          <template #content>
            <p class="review-author"><strong>{{ review.author }}</strong></p>
            <div class="review-rating">
              <span v-for="n in 5" :key="n" class="star-icon review-star" :class="{ filled: n <= review.stars }">★</span>
            </div>
            <p class="review-text">"{{ review.text }}"</p>
          </template>
        </pv-card>
      </div>
    </section>
    <hr class="separator" />
    <section class="new-review-form">
      <h3>{{ t('reviews.leaveReview') }}</h3>
      <div class="form-container">
        <pv-textarea
            v-model="newReviewText"
            :placeholder="t('reviews.shareExperience')"
            rows="4"
            class="review-textarea"
        />
        <pv-button
            type="submit"
            :label="t('reviews.submitReview')"
            class="secondary-button"
            @click="submitReview"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.review-item {
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 100%;
}

.review-item:last-child {
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

.review-star{
  color:#ddd
}

.review-star.filled{
  color:#ffc107
}

.new-review-form{
  margin-top: 1.5rem;
  width: 100%;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.review-textarea {
  width: 100%;
  margin-bottom: 0;
}

.secondary-button{
  background-color: #16a085;
  border-color: #16a085;
  color: #fff;
  width: fit-content;
  align-self: flex-start;
}

.separator{
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 2rem 0;
}

.reviews-list,
.new-review-form,
.form-container {
  width: 100%;
}

:deep(.review-textarea) {
  width: 100%;
}

:deep(.review-textarea .p-inputtext) {
  width: 100%;
}

:deep(.p-textarea) {
  width: 100%;
}

:deep(.p-inputtextarea) {
  width: 100%;
}
</style>