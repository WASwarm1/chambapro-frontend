<template>
  <div class="history-list">
    <p class="welcome">{{ t('services.welcome') }}</p>

    <h1>{{ t('services.title') }}</h1>

    <table class="service-table" v-if="services.length">
      <thead>
      <tr>
        <th>{{ t('services.date') }}</th>
        <th>{{ t('services.technician') }}</th>
        <th>{{ t('services.cost') }}</th>
        <th>{{ t('services.status') }}</th>
      </tr>
      </thead>
      <tbody>
      <HistoryServiceCard
          v-for="(service, index) in services"
          :key="index"
          :service="service"
      />
      </tbody>
    </table>

    <p v-else>Cargando historial...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import HistoryServiceCard from './HistoryServiceCard.component.vue'
import { getTechnicians, getReservations} from "../infrastructure/history-services.api.js";
import { assembleHistoryServices} from "../infrastructure/history-services.assembler.js";

const { t } = useI18n()
const services = ref([])

onMounted(async () => {
  const [technicians, reservations] = await Promise.all([
    getTechnicians(),
    getReservations()
  ])
  services.value = assembleHistoryServices(reservations, technicians)
})
</script>

<style scoped>
.history-list {
  padding: 2rem;
}
.welcome {
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}
.service-table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  text-align: left;
}
thead {
  background-color: #f3f4f6;
}
</style>