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
  router.push(`/client/profile/${props.technician.id}`)
}
</script>

<template>
  <pv-card class="technician-card">
    <template #content>
      <div class="flex gap-3">
        <div class="technician-info flex-1">
          <div class="flex justify-content-between align-items-start">
            <div>
              <h3 class="technician-name">{{ technician.name }} {{ technician.lastname }}</h3>
              <h4 class="technician-speciality">{{ t('card.specialistIn') }} {{ technician.speciality }}</h4>
            </div>

          </div>
          <p class="technician-description">{{ technician.description }}</p>

          <pv-button
              :label="t('card.viewProfile')"
              @click="goToProfile"
              class="profile-button"
          />
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.technician-card {
  max-width: 850px;
  width: 100%;
}


.technician-name {
  margin: 0 0 0.50rem 0;
  text-align: left;
  font-size: 1.25rem;
  font-weight: 600;
}

.technician-speciality {
  margin: 0 0 0.50rem 0;
  color: #666;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
}

.technician-description {
  color: #333;
  text-align: justify;
  font-size: 1.0rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.profile-button {
  background-color: #1b9a92;
  border-color: #1b9a92;
  color: white;
}

.profile-button:hover {
  background-color: #17817d;
  border-color: #17817d;
}
</style>