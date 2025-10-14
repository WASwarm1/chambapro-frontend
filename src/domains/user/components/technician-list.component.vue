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

const specialtyMapping = {
  'plumbing': ['plumbing', 'plomería', 'plomero', 'fontanería', 'fontanero'],
  'electricity': ['electricity', 'electricidad', 'eléctrico', 'electricista'],
  'carpentry': ['carpentry', 'carpintería', 'carpintero'],
  'painting': ['painting', 'pintura', 'pintor']
}

const specialtyOptions = [
  { label: t('search.selectSpecialty'), value: '' },
  { label: t('search.plumbing'), value: 'plumbing' },
  { label: t('search.electricity'), value: 'electricity' },
  { label: t('search.carpentry'), value: 'carpentry' },
  { label: t('search.painting'), value: 'painting' }
]

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
      const speciality = (tech.speciality || '').toLowerCase().trim()
      if (!speciality) return false
      const possibleMatches = specialtyMapping[filtroServicio.value] || []
      return possibleMatches.some(term => speciality.includes(term.toLowerCase()))
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

const availableSpecialities = computed(() => {
  const specialities = new Set()
  technicians.value.forEach(tech => {
    if (tech.speciality) {
      specialities.add(tech.speciality)
    }
  })
  return Array.from(specialities)
})

onMounted(() => {
  loadTechnicians()
})
</script>

<template>
  <div class="search-container">
    <h2>{{ t('search.searchMessage')}}</h2>

    <div class="search-filters">
      <pv-dropdown
          v-model="filtroServicio"
          :options="specialtyOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('search.selectSpecialty')"
          class="w-full md:w-14rem"
      />

      <pv-input-text
          type="text"
          v-model="searchName"
          :placeholder="t('search.byNameFilter')"
          class="w-full"
          @keyup.enter="aplicarFiltros"
      />

      <pv-input-text
          type="text"
          v-model="searchLastName"
          :placeholder="t('search.byLastNameFilter')"
          class="w-full"
          @keyup.enter="aplicarFiltros"
      />

      <pv-button
          :label="loading ? t('search.searching') : t('search.searchButton')"
          @click="aplicarFiltros"
          :disabled="loading"
          class="btn-buscar"
      />

      <pv-button
          :label="t('search.clearFilters')"
          @click="limpiarFiltros"
          :disabled="!hasActiveFilters && !filtersApplied"
          severity="secondary"
          class="btn-limpiar"
      />
    </div>

    <div v-if="availableSpecialities.length > 0" class="specialities-info">
      <p><strong>{{ t('search.availableSpecialties') }}:</strong> {{ availableSpecialities.join(', ') }}</p>
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
    <pv-button @click="loadTechnicians" :label="t('search.retry')" severity="danger" class="btn-retry" />
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
      <pv-button @click="limpiarFiltros" :label="t('search.clearAllFilters')" severity="secondary" />
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

.btn-buscar {
  background-color: #20b2aa;
  border-color: #20b2aa;
}

.btn-buscar:hover {
  background-color: #1b9a92;
  border-color: #1b9a92;
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
  border-left: 4px solid #20b2aa;
  text-align: center;
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

.specialities-info {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #e7f3ff;
  border-radius: 6px;
  border-left: 4px solid #20b2aa;
}

.specialities-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #495057;
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
}
</style>