export class HistoryServicesApi {
    constructor() {
        this.baseURL = 'https://wa-swarm-2025-20-d3hac9guatdxfyby.brazilsouth-01.azurewebsites.net';
    }

    /**
     * Gets services by client ID with technician information
     * @param {string} clientId - Client ID
     * @returns {Promise<Array>}
     */
    async getServicesByClientId(clientId) {
        try {
            const servicesResponse = await fetch(`${this.baseURL}/api/v1/services/client/${clientId}`);
            if (!servicesResponse.ok) {
                throw new Error(`HTTP error! status: ${servicesResponse.status}`);
            }
            let services = await servicesResponse.json();

            // Enrich services with technician data
            services = await Promise.all(services.map(async (service) => {
                if (service.technicianId) {
                    try {
                        const technicianResponse = await fetch(`${this.baseURL}/api/v1/users/${service.technicianId}`);
                        if (technicianResponse.ok) {
                            const technician = await technicianResponse.json();
                            return {
                                ...service,
                                technician: technician || null,
                                technicianName: technician ? `${technician.name} ${technician.lastName}`.trim() : 'Técnico no especificado'
                            };
                        }
                    } catch (techError) {
                        console.warn(`Could not fetch technician ${service.technicianId}:`, techError);
                    }
                }

                return {
                    ...service,
                    technician: null,
                    technicianName: 'Técnico no especificado'
                };
            }));

            return services.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));
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
            const servicesResponse = await fetch(`${this.baseURL}/api/v1/services`);
            if (!servicesResponse.ok) {
                throw new Error(`HTTP error! status: ${servicesResponse.status}`);
            }
            let services = await servicesResponse.json();

            // Enrich services with technician data
            services = await Promise.all(services.map(async (service) => {
                if (service.technicianId) {
                    try {
                        const technicianResponse = await fetch(`${this.baseURL}/api/v1/users/${service.technicianId}`);
                        if (technicianResponse.ok) {
                            const technician = await technicianResponse.json();
                            return {
                                ...service,
                                technician: technician || null,
                                technicianName: technician ? `${technician.name} ${technician.lastName}`.trim() : 'Técnico no especificado'
                            };
                        }
                    } catch (techError) {
                        console.warn(`Could not fetch technician ${service.technicianId}:`, techError);
                    }
                }

                return {
                    ...service,
                    technician: null,
                    technicianName: 'Técnico no especificado'
                };
            }));

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
