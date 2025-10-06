<script setup>
/**
 * TecnicoList Component
 * Displays a list of technicians.
 * Uses TecnicoApi to fetch data and TecnicoAssembler to convert DTOs to entities.
 * Includes internationalization support with vue-i18n.
 * Components:
 * - TecnicoCard: Displays individual technician details.
 */

import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import TecnicoCard from './TecnicoCard.component.vue'
import { TecnicoApi } from '../infrastructure/tecnico.api.js'
import { TecnicoAssembler } from '../infrastructure/tecnico.assembler.js'


const { t } = useI18n()
const tecnicos = ref([])
const loading = ref(false)
const error = ref(null)

const api = new TecnicoApi()

async function loadTecnicos() {
  loading.value = true
  error.value = null
  try {
    const data = await api.getAll()
    tecnicos.value = Array.isArray(data) ? TecnicoAssembler.toEntities(data) : []
  } catch (err) {
    console.error('Error cargando técnicos:', err)
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  loadTecnicos()
})
</script>


<template>
  <div class="search-container">
    <h2>{{ t('search.searchMessage')}}</h2>

    <div class="search-filters">
      <select v-model="filtroServicio" class="input-select">
        <option value="$t('search.plumbing')">{{ t('search.plumbing')}}</option>
        <option value="$t('search.electricity')">{{ t('search.electricity')}}</option>
        <option value="$t('search.carpentry')">{{ t('search.carpentry')}}</option>
        <option value="$t('search.painting')">{{ t('search.painting')}}</option>
      </select>

      <input
          type="text"
          v-model="searchName"
          :placeholder="$t('search.byNameFilter')"
          class="input-text"
      />

      <input
          type="text"
          v-model="searchLastName"
          :placeholder="$t('search.byLastNameFilter')"
          class="input-text"
      />

      <button class="btn-buscar" @click="filtrarTecnicos">{{ t('search.searchButton')}}</button>
    </div>
  </div>

  <div class="tecnicos-grid" v-for="tecnico in tecnicos" :key="tecnico.id">
      <tecnico-card :tecnico="tecnico"/>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  width: 100%;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  margin-top: 50px;
  flex-direction: column;
  text-align: left;
}

.search-container h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.search-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.input-select, .input-text {
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  color: black;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 0.95rem;
  flex: 1;
  min-width: 180px;
}

.input-select:focus, .input-text:focus {
  border-color: #20b2aa;
  outline: none;
}

/* Botón */
.btn-buscar {
  background-color: #20b2aa;
  color: black;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-buscar:hover {
  background-color: #1b9a92;
}

.tecnicos-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  padding: 2rem;
}
</style>
