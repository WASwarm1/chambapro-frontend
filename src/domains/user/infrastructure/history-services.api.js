export class HistoryServicesApi {
    constructor() {
        this.baseURL = 'http://localhost:3000';
    }

    /**
     * Gets services by client ID with technician information
     * @param {string} clientId - Client ID
     * @returns {Promise<Array>}
     */
    async getServicesByClientId(clientId) {
        try {
            const servicesResponse = await fetch(`${this.baseURL}/services?clientId=${clientId}`);
            if (!servicesResponse.ok) {
                throw new Error(`HTTP error! status: ${servicesResponse.status}`);
            }
            let services = await servicesResponse.json();

            const techniciansResponse = await fetch(`${this.baseURL}/users?type=technician`);
            if (!techniciansResponse.ok) {
                throw new Error(`HTTP error! status: ${techniciansResponse.status}`);
            }
            const technicians = await techniciansResponse.json();

            services = services.map(service => {
                const technician = technicians.find(tech => tech.id == service.technicianId);
                return {
                    ...service,
                    technician: technician || null,
                    technicianName: technician ? `${technician.name} ${technician.lastname}`.trim() : 'Técnico no especificado'
                };
            });

            return services.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Error fetching services:', error);
            return [];
        }
    }

    /**
     * Gets all services with technician information (for development/debugging)
     * @returns {Promise<Array>}
     */
    async getAllServices() {
        try {
            const servicesResponse = await fetch(`${this.baseURL}/services`);
            if (!servicesResponse.ok) {
                throw new Error(`HTTP error! status: ${servicesResponse.status}`);
            }
            let services = await servicesResponse.json();

            const techniciansResponse = await fetch(`${this.baseURL}/users?type=technician`);
            if (!techniciansResponse.ok) {
                throw new Error(`HTTP error! status: ${techniciansResponse.status}`);
            }
            const technicians = await techniciansResponse.json();

            services = services.map(service => {
                const technician = technicians.find(tech => tech.id == service.technicianId);
                return {
                    ...service,
                    technician: technician || null,
                    technicianName: technician ? `${technician.name} ${technician.lastname}`.trim() : 'Técnico no especificado'
                };
            });

            return services;
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
            const response = await fetch(`${this.baseURL}/services/${serviceId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const service = await response.json();

            if (service.technicianId) {
                const technicianResponse = await fetch(`${this.baseURL}/users/${service.technicianId}`);
                if (technicianResponse.ok) {
                    const technician = await technicianResponse.json();
                    service.technician = technician;
                    service.technicianName = `${technician.name} ${technician.lastname}`.trim();
                }
            }

            return service;
        } catch (error) {
            console.error('Error fetching service:', error);
            return null;
        }
    }
}