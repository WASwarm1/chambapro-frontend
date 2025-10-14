<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getTechnicians, getReservations} from "../infrastructure/history-services.api.js";
import { assembleHistoryServices} from "../infrastructure/history-services.assembler.js";

const { t } = useI18n()
const services = ref([])

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

onMounted(async () => {
  const [technicians, reservations] = await Promise.all([
    getTechnicians(),
    getReservations()
  ])
  services.value = assembleHistoryServices(reservations, technicians)
})
</script>

<template>
  <div class="history-list">
    <h1>{{ t('services.title') }}</h1>

    <pv-card v-if="services.length">
      <template #content>
        <pv-data-table
            :value="services"
            :paginator="true"
            :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5,10,20]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} servicios"
            class="service-table"
        >
          <pv-column field="date" :header="t('services.date')" style="width: 25%">
            <template #body="{ data }">
              {{ data.date }}
            </template>
          </pv-column>

          <pv-column field="technicianName" :header="t('services.technician')" style="width: 25%">
            <template #body="{ data }">
              {{ data.technicianName }}
            </template>
          </pv-column>

          <pv-column field="cost" :header="t('services.cost')" style="width: 25%">
            <template #body="{ data }">
              {{ data.cost }}
            </template>
          </pv-column>

          <pv-column field="status" :header="t('services.status')" style="width: 25%">
            <template #body="{ data }">
              <pv-tag
                  :value="data.status"
                  :severity="getStatusSeverity(data.status)"
              />
            </template>
          </pv-column>
        </pv-data-table>
      </template>
    </pv-card>

    <pv-card v-else>
      <template #content>
        <div class="empty-state">
          <p>{{ t('history.loading') }}</p>
        </div>
      </template>
    </pv-card>
  </div>
</template>


<style scoped>
.history-list {
  padding: 2rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

:deep(.service-table) {
  width: 100%;
}

:deep(.service-table .p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

:deep(.service-table .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.service-table .p-datatable-tbody > tr:hover) {
  background-color: #f8f9fa;
}
</style>