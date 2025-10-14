<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({ service: Object })
</script>

<template>
  <tr>
    <td>{{ service.date }}</td>
    <td>{{ service.technicianName }}</td>
    <td>{{ service.cost }}</td>
    <td>{{ service.status }}</td>
  </tr>
</template>

<style scoped>

</style>