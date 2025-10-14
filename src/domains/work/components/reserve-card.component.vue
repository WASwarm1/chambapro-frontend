<script setup>
/**
 * ReserveCardComponent Component
 * Displays information about a reservation including image, date, time, description, client, category, and a button to see more details.
 * Props:
 * - reserva: Object containing details about the reservation (date, time, description, client, category, infoUrl, image)
 */

import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';

const props = defineProps({
  reserva: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const { t } = useI18n();
</script>

<template>
  <Card class="reserva-card" aria-labelledby="reserva-title">
    <template #title>
      <h3 id="reserva-title" class="reserva-title">
        {{ reserva.date }}, {{ reserva.time }}: {{ reserva.description }} - Cliente: {{reserva.client}}
      </h3>
    </template>
  </Card>
</template>

<style scoped>
.reserva-card {
  width: 75%;
  margin: 1rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid #e9ecef;
}

.reserva-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
}

.reserva-title {
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  color: #2c3e50;
  line-height: 1.6;
  padding: 0.5rem;
  background: black;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>