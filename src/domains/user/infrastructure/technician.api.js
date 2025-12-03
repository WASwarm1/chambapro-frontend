export class TechnicianApi {
    constructor() {
        this.baseURL = 'https://chambapro-platform-production.up.railway.app';
    }

    getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    async getAll() {
        try {
            const headers = {
                ...this.getAuthHeaders()
            };
            const response = await fetch(`${this.baseURL}/api/v1/users/technicians`, {
                headers: headers
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const technicians = await response.json();
            return technicians;
        } catch (error) {
            console.error('Error fetching technicians:', error);
            return [];
        }
    }

    async getById(id) {
        try {
            const headers = {
                ...this.getAuthHeaders()
            };
            const response = await fetch(`${this.baseURL}/api/v1/users/${id}`, {
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const technician = await response.json();

            if (technician.userType !== 'Technician') {
                throw new Error('User is not a technician');
            }

            // Fetch reviews if needed
            try {
                const reviewsResponse = await fetch(`${this.baseURL}/api/v1/reviews/technician/${id}`, {
                    headers: headers
                });
                const reviews = await reviewsResponse.json();
                return {
                    ...technician,
                    reviews: reviews || []
                };
            } catch (reviewsError) {
                // Reviews might not be available, return technician data
                return technician;
            }
        } catch (error) {
            console.error('Error fetching technician:', error);
            throw error;
        }
    }

    async getBySpecialty(specialty) {
        try {
            const headers = {
                ...this.getAuthHeaders()
            };
            const response = await fetch(`${this.baseURL}/api/v1/users/technicians/by-speciality/${encodeURIComponent(specialty)}`, {
                headers: headers
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching technicians by specialty:', error);
            return [];
        }
    }
}
