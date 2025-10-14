<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TechnicianCardComponent from './technician-card.component.vue'
import { TechnicianApi } from '../infrastructure/technician.api.js'
import { TechnicianAssembler } from '../infrastructure/technician.assembler.js'

const { t } = useI18n()
const technicians = ref([])
const filteredTechnicians = ref([])
const loading = ref(false)
const error = ref(null)
const filtroServicio = ref('')
const searchName = ref('')
const searchLastName = ref('')
const filtersApplied = ref(false)

const api = new TechnicianApi()

async function loadTechnicians() {
  loading.value = true
  error.value = null
  try {
    const data = await api.getAll()
    technicians.value = Array.isArray(data) ? TechnicianAssembler.toEntities(data) : []
    filteredTechnicians.value = [...technicians.value]
  } catch (err) {
    console.error(t('search.loadError'), err)
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}

function aplicarFiltros() {
  filtersApplied.value = true
  filtrarTecnicos()
}

function filtrarTecnicos() {
  if (!technicians.value.length) return

  let filtered = [...technicians.value]

  if (filtroServicio.value) {
    filtered = filtered.filter(tech => {
      const specialty = tech.specialty || tech.speciality || ''
      return specialty.toLowerCase() === filtroServicio.value.toLowerCase()
    })
  }

  if (searchName.value.trim()) {
    const nameQuery = searchName.value.trim().toLowerCase()
    filtered = filtered.filter(tech =>
        tech.name?.toLowerCase().includes(nameQuery)
    )
  }

  if (searchLastName.value.trim()) {
    const lastNameQuery = searchLastName.value.trim().toLowerCase()
    filtered = filtered.filter(tech =>
        tech.lastname?.toLowerCase().includes(lastNameQuery)
    )
  }

  filteredTechnicians.value = filtered
}

function limpiarFiltros() {
  filtroServicio.value = ''
  searchName.value = ''
  searchLastName.value = ''
  filtersApplied.value = false
  filteredTechnicians.value = [...technicians.value]
}

const noResults = computed(() => {
  return filteredTechnicians.value.length === 0 && (technicians.value.length > 0 || filtersApplied.value)
})

const hasActiveFilters = computed(() => {
  return filtroServicio.value || searchName.value.trim() || searchLastName.value.trim()
})

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
          @keyup.enter="aplicarFiltros"
      />

      <input
          type="text"
          v-model="searchLastName"
          :placeholder="t('search.byLastNameFilter')"
          class="input-text"
          @keyup.enter="aplicarFiltros"
      />

      <button class="btn-buscar" @click="aplicarFiltros" :disabled="loading">
        {{ loading ? t('search.searching') : t('search.searchButton') }}
      </button>

      <button
          class="btn-limpiar"
          @click="limpiarFiltros"
          :disabled="!hasActiveFilters && !filtersApplied"
      >
        {{ t('search.clearFilters') }}
      </button>
    </div>

    <div v-if="hasActiveFilters && !filtersApplied" class="filters-pending">
      <p>{{ t('search.filtersPending') }}</p>
    </div>

    <div class="results-info" v-if="technicians.length > 0 && (filtersApplied || filteredTechnicians.length !== technicians.length)">
      <p>
        {{ t('search.showing') }} {{ filteredTechnicians.length }} {{ t('search.of') }} {{ technicians.length }} {{ t('search.technicians') }}
        <span v-if="filtersApplied" class="filters-applied">({{ t('search.filtersApplied') }})</span>
        <span v-if="noResults" class="no-results"> - {{ t('search.noResults') }}</span>
      </p>
    </div>
  </div>

  <div v-if="loading" class="loading-state">
    <p>{{ t('search.loading') }}</p>
  </div>

  <div v-else-if="error" class="error-state">
    <p>{{ t('search.error') }}: {{ error }}</p>
    <button @click="loadTechnicians" class="btn-retry">{{ t('search.retry') }}</button>
  </div>

  <div v-else class="tecnicos-grid">
    <technician-card-component
        v-for="tecnico in filteredTechnicians"
        :key="tecnico.id"
        :technician="tecnico"
    />

    <div v-if="noResults" class="no-results-message">
      <h3>{{ t('search.noTechniciansFound') }}</h3>
      <p>{{ t('search.tryDifferentFilters') }}</p>
      <button @click="limpiarFiltros" class="btn-limpiar">{{ t('search.clearAllFilters') }}</button>
    </div>

    <div v-if="!filtersApplied && filteredTechnicians.length === technicians.length && technicians.length > 0">
      <p class="initial-state">{{ t('search.allTechniciansShown') }}</p>
    </div>
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
  align-items: center;
}

.input-select, .input-text {
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  color: black;
  background-color: #fff;
  border-radius: 6px;
  font-size: 0.95rem;
  flex: 1;
  min-width: 180px;
}

.input-select:focus, .input-text:focus {
  border-color: #20b2aa;
  outline: none;
  box-shadow: 0 0 0 2px rgba(32, 178, 170, 0.2);
}

.btn-buscar {
  background-color: #20b2aa;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  min-width: 120px;
}

.btn-buscar:hover:not(:disabled) {
  background-color: #1b9a92;
  transform: translateY(-1px);
}

.btn-buscar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-limpiar {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  min-width: 120px;
}

.btn-limpiar:hover:not(:disabled) {
  background-color: #5a6268;
  transform: translateY(-1px);
}

.btn-limpiar:disabled {
  background-color: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
  transform: none;
}

.btn-retry {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 0.5rem;
}

.btn-retry:hover {
  background-color: #c82333;
}

.tecnicos-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  padding: 2rem;
}

.results-info {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #e7f3ff;
  border-radius: 6px;
  text-align: center;
  border-left: 4px solid #20b2aa;
}

.results-info p {
  margin: 0;
  color: #495057;
  font-size: 0.9rem;
}

.filters-pending {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fff3cd;
  border-radius: 6px;
  text-align: center;
  border-left: 4px solid #ffc107;
}

.filters-pending p {
  margin: 0;
  color: #856404;
  font-size: 0.9rem;
}

.filters-applied {
  color: #20b2aa;
  font-weight: 600;
}

.no-results {
  color: #dc3545;
  font-weight: 600;
}

.loading-state, .error-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.error-state {
  color: #dc3545;
}

.no-results-message {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
}

.no-results-message h3 {
  margin-bottom: 1rem;
  color: #495057;
}

.initial-state {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 1rem;
}

@media (max-width: 768px) {
  .search-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .input-select, .input-text {
    min-width: auto;
  }

  .btn-buscar, .btn-limpiar {
    width: 100%;
  }
}
</style>