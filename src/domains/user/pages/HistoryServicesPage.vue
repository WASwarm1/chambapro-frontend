<script setup>
import Header from './public/components/header-content.component.vue'
import ClienteNavbar from "./public/components/cliente-navbar.component.vue";
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Datos simulados del historial
const historial = ref([
  { fecha: '01/08/2025', tecnico: 'Carlos Mendoza', costo: 150.0, estado: 'Completado' },
  { fecha: '15/07/2025', tecnico: 'Ana Tomes', costo: 250.0, estado: 'Completado' },
  { fecha: '02/06/2025', tecnico: 'Ricardo Morales', costo: 80.0, estado: 'Completado' },
  { fecha: '22/05/2025', tecnico: 'Lucía Ramos', costo: 120.0, estado: 'Cancelado' }
])
</script>

<template>
  <div>
    <header class="header-bar">
      <h1>{{ t('services.welcome') }}</h1>
      <p class="subtext">{{ t('services.subtitle') }}</p>
    </header>
    <Header/>
    <ClienteNavbar/>
  </div>
  <div class="historial-container">

    <h2>{{ t('services.title') }}</h2>

    <div class="historial-header">
      <div>{{ t('services.date') }}</div>
      <div>{{ t('services.technician') }}</div>
      <div>{{ t('services.cost') }}</div>
      <div>{{ t('services.status') }}</div>
    </div>

    <div v-for="(servicio, index) in historial" :key="index" class="historial-row">
      <div>{{ servicio.fecha }}</div>
      <div>{{ servicio.tecnico }}</div>
      <div>S/ {{ servicio.costo.toFixed(2) }}</div>
      <div :class="['estado', servicio.estado === 'Completado' ? 'completado' : 'cancelado']">
        {{ servicio.estado }}
      </div>
    </div>
  </div>

</template>

<style scoped>
.historial-container {
  width: 85%;
  margin: 40px auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  font-family: 'Poppins', sans-serif;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.historial-header,
.historial-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
}

.historial-header {
  background: #f8f9fa;
  font-weight: bold;
  color: #34495e;
}

.historial-row {
  transition: background-color 0.3s ease;
}

.historial-row:hover {
  background-color: #f1f1f1;
}

.estado {
  font-weight: bold;
  text-align: center;
}

.completado {
  color: #28a745;
}

.cancelado {
  color: #dc3545;
}
</style>