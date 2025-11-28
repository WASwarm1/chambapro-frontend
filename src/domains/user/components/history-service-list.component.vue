<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../iam/stores/auth.store.js'
import { HistoryServicesApi } from '../infrastructure/history-services.api.js'
import { HistoryServicesAssembler } from '../infrastructure/history-services.assembler.js'

const { t } = useI18n()
const authStore = useAuthStore()
const services = ref([])
const loading = ref(false)
const error = ref(null)

const historyServicesApi = new HistoryServicesApi()

const filteredServices = computed(() => {
  return [...services.value].sort((a, b) => {
    return new Date(b.originalDate || b.date) - new Date(a.originalDate || a.date);
  });
});

onMounted(async () => {
  await loadServices()
})

async function loadServices() {
  loading.value = true
  error.value = null

  try {
    let servicesData = []

    if (authStore.isAuthenticated && authStore.isClient) {
      servicesData = await historyServicesApi.getServicesByClientId(authStore.user.id)
    } else {
      servicesData = await historyServicesApi.getAllServices()
    }

    services.value = HistoryServicesAssembler.toEntities(servicesData)

  } catch (err) {
    console.error('Error loading services:', err)
    error.value = t('history.loadError')
  } finally {
    loading.value = false
  }
}

function getStatusSeverity(status) {
  return HistoryServicesAssembler.getStatusSeverity(status)
}
</script>

<template>
  <div class="history-list">
    <div class="page-header">
      <h1>{{ t('services.title') }}</h1>
      <pv-button
          icon="pi pi-refresh"
          :label="t('history.refresh')"
          @click="loadServices"
          :disabled="loading"
          severity="secondary"
      />
    </div>

    <pv-card>
      <template #content>
        <div v-if="loading" class="loading-state">
          <i class="pi pi-spinner pi-spin"></i>
          <p>{{ t('history.loading') }}</p>
        </div>

        <div v-else-if="error" class="error-state">
          <i class="pi pi-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <pv-button
              @click="loadServices"
              :label="t('history.retry')"
              severity="secondary"
              class="mt-2"
          />
        </div>

        <div v-else-if="filteredServices.length > 0" class="services-container">
          <div class="services-summary">
            <pv-tag
                :value="t('history.totalServices', { count: filteredServices.length })"
                severity="info"
            />
            <pv-tag
                :value="t('history.completedServices', { count: filteredServices.filter(s => s.status === 'Completado').length })"
                severity="success"
                class="ml-2"
            />
          </div>

          <pv-data-table
              :value="filteredServices"
              :paginator="true"
              :rows="10"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[5,10,20]"
              currentPageReportTemplate="{first} - {last} de {totalRecords} servicios"
              class="service-table"
              responsiveLayout="scroll"
          >
            <pv-column field="date" :header="t('services.date')" style="width: 15%">
              <template #body="{ data }">
                <span class="date-cell">{{ data.date }}</span>
              </template>
            </pv-column>

            <pv-column field="technicianName" :header="t('services.technician')" style="width: 20%">
              <template #body="{ data }">
                <div class="technician-cell">
                  <span class="technician-name">{{ data.technicianName }}</span>
                  <span v-if="data.category" class="technician-category">{{ data.category }}</span>
                </div>
              </template>
            </pv-column>

            <pv-column field="description" :header="t('services.description')" style="width: 30%">
              <template #body="{ data }">
                <span class="description-cell">{{ data.description }}</span>
              </template>
            </pv-column>

            <pv-column field="cost" :header="t('services.cost')" style="width: 15%">
              <template #body="{ data }">
                <span class="cost-cell">{{ data.cost }}</span>
              </template>
            </pv-column>

            <pv-column field="status" :header="t('services.status')" style="width: 20%">
              <template #body="{ data }">
                <pv-tag
                    :value="data.status"
                    :severity="getStatusSeverity(data.status)"
                    class="status-tag"
                />
              </template>
            </pv-column>
          </pv-data-table>
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-history"></i>
          <h3>{{ t('history.noServices') }}</h3>
          <p>{{ t('history.noServicesMessage') }}</p>
          <pv-button
              :label="t('history.findTechnicians')"
              icon="pi pi-search"
              @click="$router.push('/client/tech-search')"
              class="mt-2"
          />
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.history-list {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-state {
  color: #dc3545;
}

.empty-state h3 {
  margin: 0;
  color: #2c3e50;
}

.empty-state p {
  margin: 0;
  color: #6c757d;
}

.services-container {
  padding: 1rem 0;
}

.services-summary {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.date-cell {
  font-weight: 500;
  color: #2c3e50;
}

.technician-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.technician-name {
  font-weight: 600;
  color: #2c3e50;
}

.technician-category {
  font-size: 0.8rem;
  color: #6c757d;
  background-color: #e9ecef;
  padding: 0.1rem 0.5rem;
  border-radius: 12px;
  width: fit-content;
}

.description-cell {
  color: #495057;
  line-height: 1.4;
}

.cost-cell {
  font-weight: 600;
  color: #27ae60;
}

.status-tag {
  font-weight: 600;
}


@media (max-width: 768px) {
  .history-list {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .services-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  :deep(.service-table) {
    font-size: 0.9rem;
  }

}
</style>