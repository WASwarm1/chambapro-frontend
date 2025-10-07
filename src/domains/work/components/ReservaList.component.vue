<script setup>
/**
 * ReservaList Component
 * Displays a list of reservations.
 * Uses ReservaApi to fetch data and ReservaAssembler to convert DTOs to entities.
 * Includes internationalization support with vue-i18n.
 * Components:
 * - ReservaCard: Displays individual reservation details.
 */

import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ReservaCard from './ReservaCard.component.vue';
import { ReservaApi } from '../infrastructure/reserva.api.js';
import { ReservaAssembler } from '../infrastructure/reserva.assembler.js';

const { t } = useI18n();
const reservas = ref([]);
const api = new ReservaApi();

onMounted(async () => {
  const dtos = await api.getAll();
  reservas.value = ReservaAssembler.toEntities(dtos);
});
</script>

<template>
  <section aria-labelledby="my-reservations-title">
    <h2 id="my-reservations-title">{{ t('reserva.myReservationAgenda') }}</h2>
    <div class="p-grid" style="justify-content: center;">
      <div v-for="reserva in reservas" :key="reserva.id" class="p-col-12 p-md-6 p-lg-4" style="display: flex; justify-content: center;">
        <reserva-card :reserva="reserva" />
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>