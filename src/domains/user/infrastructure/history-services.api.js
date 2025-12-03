export class HistoryServicesApi {
    constructor() {
        this.baseURL = 'https://chambapro-platform-production.up.railway.app';
    }

    /**
     * Gets services by client ID with technician information
     * @param {string} clientId - Client ID
     * @returns {Promise<Array>}
     */
    async getServicesByClientId(clientId) {
        try {
            // Use reservations API instead of services API
            const reservationsResponse = await fetch(`${this.baseURL}/api/v1/reservations?clientId=${clientId}`);
            if (!reservationsResponse.ok) {
                throw new Error(`HTTP error! status: ${reservationsResponse.status}`);
            }
            let reservations = await reservationsResponse.json();

            // Convert reservations to service format and enrich with technician data
            let services = await Promise.all(reservations.map(async (reservation) => {
                let technicianName = 'Técnico no asignado';
                let category = reservation.categoryId || reservation.category;
                let cost = null; // Use null instead of string for missing cost

                if (reservation.technicianId) {
                    try {
                        const technicianResponse = await fetch(`${this.baseURL}/api/v1/users/${reservation.technicianId}`);
                        if (technicianResponse.ok) {
                            const technician = await technicianResponse.json();
                            technicianName = technician ? `${technician.name} ${technician.lastName}`.trim() : 'Técnico no encontrado';

                            // Calculate cost if technician has hourly rate
                            // Assuming 2 hours as default if not specified
                            if (technician.hourlyRate) {
                                const estimatedHours = reservation.estimatedHours || 2;
                                cost = technician.hourlyRate * estimatedHours; // Return as number
                            }
                        }
                    } catch (techError) {
                        console.warn(`Could not fetch technician ${reservation.technicianId}:`, techError);
                        technicianName = 'Error al cargar técnico';
                    }
                }

                // Convert reservation to service format expected by frontend
                return {
                    id: reservation.id,
                    date: reservation.date ? new Date(reservation.date).toLocaleDateString() : reservation.date,
                    originalDate: reservation.date, // Keep original for sorting
                    description: reservation.description,
                    cost: cost, // Now a number or null
                    estimatedCost: cost, // Also set estimatedCost as fallback
                    status: reservation.status,
                    technicianName: technicianName,
                    category: category,
                    clientId: reservation.clientId,
                    technicianId: reservation.technicianId
                };
            }));

            return services.sort((a, b) => new Date(b.originalDate || b.date) - new Date(a.originalDate || a.date));
        } catch (error) {
            console.error('Error fetching services:', error);
            return [];
        }
    }

    /**
     * Gets all reservations as services (for development/debugging)
     * @returns {Promise<Array>}
     */
    async getAllServices() {
        try {
            // Use reservations API for debugging
            const reservationsResponse = await fetch(`${this.baseURL}/api/v1/reservations`);
            if (!reservationsResponse.ok) {
                throw new Error(`HTTP error! status: ${reservationsResponse.status}`);
            }
            let reservations = await reservationsResponse.json();

            // Convert reservations to service format
            let services = await Promise.all(reservations.map(async (reservation) => {
                let technicianName = 'Técnico no especificado';
                let cost = null;

                if (reservation.technicianId) {
                    try {
                        const technicianResponse = await fetch(`${this.baseURL}/api/v1/users/${reservation.technicianId}`);
                        if (technicianResponse.ok) {
                            const technician = await technicianResponse.json();
                            technicianName = technician ? `${technician.name} ${technician.lastName}`.trim() : 'Técnico no especificado';

                            // Calculate cost if technician has hourly rate
                            if (technician.hourlyRate) {
                                const estimatedHours = reservation.estimatedHours || 2;
                                cost = technician.hourlyRate * estimatedHours;
                            }
                        }
                    } catch (techError) {
                        console.warn(`Could not fetch technician ${reservation.technicianId}:`, techError);
                    }
                }

                return {
                    id: reservation.id,
                    date: reservation.date ? new Date(reservation.date).toLocaleDateString() : reservation.date,
                    originalDate: reservation.date,
                    description: reservation.description,
                    cost: cost,
                    estimatedCost: cost,
                    status: reservation.status,
                    technicianName: technicianName,
                    category: reservation.categoryId || reservation.category,
                    clientId: reservation.clientId,
                    technicianId: reservation.technicianId
                };
            }));

            return services.sort((a, b) => new Date(b.originalDate || b.date) - new Date(a.originalDate || a.date));
        } catch (error) {
            console.error('Error fetching all services:', error);
            return [];
        }
    }

    /**
     * Gets service by ID with technician information
     * @param {string} serviceId - Service ID
     * @returns {Promise<Object>}
     */
    async getServiceById(serviceId) {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/services/${serviceId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const service = await response.json();

            if (service.technicianId) {
                try {
                    const technicianResponse = await fetch(`${this.baseURL}/api/v1/users/${service.technicianId}`);
                    if (technicianResponse.ok) {
                        const technician = await technicianResponse.json();
                        service.technician = technician;
                        service.technicianName = `${technician.name} ${technician.lastName}`.trim();
                    }
                } catch (techError) {
                    console.warn(`Could not fetch technician for service ${serviceId}:`, techError);
                }
            }

            return service;
        } catch (error) {
            console.error('Error fetching service:', error);
            return null;
        }
    }
}
