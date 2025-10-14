<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import TechnicianCardComponent from './technician-card.component.vue'
import { TechnicianApi } from '../infrastructure/technician.api.js'
import { TechnicianAssembler } from '../infrastructure/technician.assembler.js'

const { t } = useI18n()
const technicians = ref([])
const loading = ref(false)
const error = ref(null)
const filtroServicio = ref('')
const searchName = ref('')
const searchLastName = ref('')

const api = new TechnicianApi()

async function loadTechnicians() {
  loading.value = true
  error.value = null
  try {
    const data = await api.getAll()
    technicians.value = Array.isArray(data) ? TechnicianAssembler.toEntities(data) : []
  } catch (err) {
    console.error(t('search.loadError'), err)
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}

function filterTechnicians() {
  // TODO: Implement filtering logic based on filtroServicio, searchName, and searchLastName
  console.log('Filtering technicians...')
}

onMounted(() => {
  loadTechnicians()
})
</script>


<template>
  <div class="search-container">
    <h2>{{ t('search.searchMessage')}}</h2>

    <div class="search-filters">
      <select v-model="filtroServicio" class="input-select">
        <option value="">{{ t('search.selectSpecialty') }}</option>
        <option value="plumbing">{{ t('search.plumbing')}}</option>
        <option value="electricity">{{ t('search.electricity')}}</option>
        <option value="carpentry">{{ t('search.carpentry')}}</option>
        <option value="painting">{{ t('search.painting')}}</option>
      </select>

      <input
          type="text"
          v-model="searchName"
          :placeholder="t('search.byNameFilter')"
          class="input-text"
      />

      <input
          type="text"
          v-model="searchLastName"
          :placeholder="t('search.byLastNameFilter')"
          class="input-text"
      />

      <button class="btn-buscar" @click="filterTechnicians">{{ t('search.searchButton')}}</button>
    </div>
  </div>

  <div class="tecnicos-grid">
    <technician-card-component
        v-for="technician in technicians"
        :key="technician.id"
        :technician="technician"
    />
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
