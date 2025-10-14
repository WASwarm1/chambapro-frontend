export class HistoryServicesAssembler {
    /**
     * Converts service data to entity format
     * @param {Array} servicesData - Raw services data
     * @returns {Array} Assembled services
     */
    static toEntities(servicesData) {
        return servicesData.map(service => ({
            id: service.id,
            date: this.formatDate(service.date),
            technicianName: service.technicianName || 'Técnico no especificado',
            cost: this.formatCost(service.estimatedCost || service.cost),
            status: this.translateStatus(service.status),
            description: service.description,
            category: service.category || service.serviceType,
            address: service.address,
            duration: service.estimatedDuration || service.duration,
            technicianId: service.technicianId,
            clientId: service.clientId,
            originalDate: service.date // Mantener fecha original para ordenamiento
        }));
    }

    /**
     * Formats date to readable format
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    static formatDate(dateString) {
        if (!dateString) return 'Fecha no especificada';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Formats cost to currency format
     * @param {number} cost - Service cost
     * @returns {string} Formatted cost
     */
    static formatCost(cost) {
        if (!cost && cost !== 0) return 'No especificado';

        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(cost);
    }

    /**
     * Translates status to Spanish
     * @param {string} status - Service status
     * @returns {string} Translated status
     */
    static translateStatus(status) {
        const statusMap = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmado',
            'completed': 'Completado',
            'cancelled': 'Cancelado',
            'in_progress': 'En Progreso',
            'Pendiente': 'Pendiente',
            'Confirmado': 'Confirmado',
            'Completado': 'Completado',
            'Cancelado': 'Cancelado'
        };

        return statusMap[status] || status || 'Pendiente';
    }

    /**
     * Gets status severity for UI
     * @param {string} status - Service status
     * @returns {string} Severity level
     */
    static getStatusSeverity(status) {
        const severityMap = {
            'completed': 'success',
            'confirmed': 'info',
            'in_progress': 'warning',
            'pending': 'warning',
            'cancelled': 'danger',
            'Completado': 'success',
            'Confirmado': 'info',
            'En Progreso': 'warning',
            'Pendiente': 'warning',
            'Cancelado': 'danger'
        };

        return severityMap[status] || 'info';
    }
}