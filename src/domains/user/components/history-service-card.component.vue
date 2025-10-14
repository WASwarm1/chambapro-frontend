<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({ service: Object })

function getStatusSeverity(status) {
  switch (status?.toLowerCase()) {
    case 'completado':
    case 'completed':
      return 'success';
    case 'pendiente':
    case 'pending':
      return 'warning';
    case 'cancelado':
    case 'cancelled':
      return 'danger';
    default:
      return 'info';
  }
}
</script>

<template>
  <tr>
    <td>{{ service.date }}</td>
    <td>{{ service.technicianName }}</td>
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
/* Estilos opcionales para el componente */
</style>