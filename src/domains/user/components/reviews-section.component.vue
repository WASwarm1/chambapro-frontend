<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../iam/stores/auth.store.js';
import { ReviewsApi } from '../infrastructure/reviews.api.js';

const { t } = useI18n();
const authStore = useAuthStore();
const reviewsApi = new ReviewsApi();

const props = defineProps({
  technician: {
    type: Object,
    required: true
  },
  reviews: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['review-submitted']);

const newReviewText = ref('');
const newReviewRating = ref(5);
const loading = ref(false);
const submitting = ref(false);
const localReviews = ref([]);

const isClient = computed(() => authStore.isClient);
const currentUser = computed(() => authStore.currentUser);

onMounted(async () => {
  if (props.technician?.id) {
    await loadReviews();
  }
});

async function loadReviews() {
  loading.value = true;
  try {
    localReviews.value = await reviewsApi.getByTechnicianId(props.technician.id);
  } catch (error) {
    console.error('Error loading reviews:', error);
  } finally {
    loading.value = false;
  }
}

async function submitReview() {
  if (!newReviewText.value.trim()) {
    alert(t('reviews.emptyReview'));
    return;
  }

  if (!isClient.value) {
    alert(t('reviews.onlyClientsCanReview'));
    return;
  }

  submitting.value = true;

  try {
    const reviewData = {
      technicianId: props.technician.id,
      clientId: currentUser.value.id,
      clientName: `${currentUser.value.name} ${currentUser.value.lastname}`,
      rating: newReviewRating.value,
      comment: newReviewText.value.trim(),
      serviceId: null
    };

    const result = await reviewsApi.createReview(reviewData);

    if (result.success) {
      localReviews.value.unshift(result.review);

      newReviewText.value = '';
      newReviewRating.value = 5;

      emit('review-submitted', result.review);

      alert(t('reviews.submitSuccess'));
    } else {
      alert(result.message || t('reviews.submitError'));
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    alert(t('reviews.submitError'));
  } finally {
    submitting.value = false;
  }
}

import { watch } from 'vue';
watch(() => props.technician, async (newTechnician) => {
  if (newTechnician?.id) {
    await loadReviews();
  }
});
</script>

<template>
  <div>
    <hr class="separator" />
    <section class="reviews-section">
      <h2>{{ t('reviews.clientReviews') }}</h2>

      <div v-if="loading" class="loading-state">
        <i class="pi pi-spinner pi-spin"></i>
        <p>{{ t('reviews.loading') }}</p>
      </div>

      <div v-else class="reviews-list">
        <pv-card
            v-for="review in localReviews"
            :key="review.id"
            class="review-item"
        >
          <template #content>
            <div class="review-header">
              <div class="review-author-info">
                <p class="review-author">
                  <strong>{{ review.clientName }}</strong>
                </p>
                <p class="review-date">
                  {{ new Date(review.createdAt).toLocaleDateString() }}
                </p>
              </div>
              <div class="review-rating">
                <span
                    v-for="n in 5"
                    :key="n"
                    class="star-icon"
                    :class="{ filled: n <= review.rating }"
                >
                  ★
                </span>
              </div>
            </div>
            <p class="review-text">"{{ review.comment }}"</p>
          </template>
        </pv-card>

        <div v-if="localReviews.length === 0" class="empty-reviews">
          <p>{{ t('reviews.noReviews') }}</p>
        </div>
      </div>
    </section>

    <hr class="separator" />
    <section class="new-review-form">
      <h3>{{ t('reviews.leaveReview') }}</h3>

      <div v-if="!isClient" class="not-client-message">
        <p>{{ t('reviews.onlyClientsCanReview') }}</p>
        <router-link to="/auth/client" class="auth-link">
          {{ t('reviews.loginAsClient') }}
        </router-link>
      </div>

      <form v-else @submit.prevent="submitReview" class="review-form">
        <div class="rating-section">
          <label class="rating-label">{{ t('reviews.yourRating') }}</label>
          <div class="rating-stars">
            <span
                v-for="n in 5"
                :key="n"
                class="star-selector"
                :class="{ filled: n <= newReviewRating }"
                @click="newReviewRating = n"
            >
              ★
            </span>
          </div>
          <span class="rating-value">{{ newReviewRating }}/5</span>
        </div>

        <div class="textarea-section">
          <label for="review-text" class="textarea-label">
            {{ t('reviews.yourReview') }}
          </label>
          <pv-textarea
              id="review-text"
              v-model="newReviewText"
              :placeholder="t('reviews.shareExperience')"
              rows="4"
              class="review-textarea"
              :disabled="submitting"
          />
        </div>

        <pv-button
            type="submit"
            :label="submitting ? t('reviews.submitting') : t('reviews.submitReview')"
            :loading="submitting"
            :disabled="!newReviewText.trim() || submitting"
            class="submit-button"
        />
      </form>
    </section>
  </div>
</template>

<style scoped>
.separator {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 2rem 0;
}

.reviews-section h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.loading-state .pi-spinner {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-item {
  margin-bottom: 0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.review-author-info {
  flex: 1;
}

.review-author {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #2c3e50;
}

.review-date {
  margin: 0;
  font-size: 0.8rem;
  color: #6c757d;
}

.review-rating {
  display: flex;
  gap: 0.1rem;
}

.star-icon {
  color: #ddd;
  font-size: 1.1rem;
}

.star-icon.filled {
  color: #ffc107;
}

.review-text {
  margin: 0.5rem 0 0;
  color: #555;
  line-height: 1.5;
  font-style: italic;
}

.empty-reviews {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.new-review-form h3 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.not-client-message {
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.not-client-message p {
  margin-bottom: 1rem;
  color: #6c757d;
}

.auth-link {
  color: #16a085;
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.rating-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0;
}

.rating-stars {
  display: flex;
  gap: 0.25rem;
}

.star-selector {
  color: #ddd;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
  user-select: none;
}

.star-selector.filled {
  color: #ffc107;
}

.star-selector:hover {
  color: #ffc107;
}

.rating-value {
  font-weight: 600;
  color: #333;
}

.textarea-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.textarea-label {
  font-weight: 600;
  color: #333;
}

.review-textarea {
  width: 100%;
}

.submit-button {
  align-self: flex-start;
  background-color: #16a085;
  border-color: #16a085;
}

.submit-button:hover:not(:disabled) {
  background-color: #117a65;
  border-color: #117a65;
}

@media (max-width: 768px) {
  .rating-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .review-header {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>