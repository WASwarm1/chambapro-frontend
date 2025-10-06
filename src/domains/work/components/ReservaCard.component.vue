<<script setup>
/**
 * ReservaCard Component
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
      <h3 id="reserva-title" class="text-lg font-medium text-center">
        {{ reserva.date }}, {{ reserva.time }}: {{ reserva.description }} - Cliente: {{reserva.client}}
      </h3>
    </template>
  </Card>
</template>

<style scoped>
.reserva-card {
  max-width: 600px;
  margin: 1rem;
  border-radius: 12px;
  overflow: hidden;
}

</style>