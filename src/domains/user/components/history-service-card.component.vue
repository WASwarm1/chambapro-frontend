<script setup>
import { useI18n } from 'vue-i18n';
import { HistoryServicesAssembler } from '../infrastructure/history-services.assembler.js';

const { t } = useI18n();

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
});

const getStatusSeverity = (status) => {
  return HistoryServicesAssembler.getStatusSeverity(status);
}
</script>

<template>
  <tr>
    <td>{{ service.date }}</td>
    <td>
      <div class="technician-info">
        <strong>{{ service.technicianName }}</strong>
        <span v-if="service.category" class="service-category">{{ service.category }}</span>
      </div>
    </td>
    <td>{{ service.cost }}</td>
    <td>
      <pv-tag
          :value="service.status"
          :severity="getStatusSeverity(service.status)"
      />
    </td>
  </tr>
</template>

<style scoped>
.technician-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.service-category {
  font-size: 0.8rem;
  color: #6c757d;
  background-color: #e9ecef;
  padding: 0.1rem 0.5rem;
  border-radius: 12px;
  width: fit-content;
}
</style>