export class TechnicianApi {
    constructor() {
        this.baseURL = 'https://wa-swarm-2025-20-d3hac9guatdxfyby.brazilsouth-01.azurewebsites.net';
    }

    async getAll() {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/users/technicians`);
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
            const response = await fetch(`${this.baseURL}/api/v1/users/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const technician = await response.json();

            if (technician.userType !== 'technician') {
                throw new Error('User is not a technician');
            }

            // Fetch reviews if needed
            try {
                const reviewsResponse = await fetch(`${this.baseURL}/api/reviews/technician/${id}`);
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
            const response = await fetch(`${this.baseURL}/api/v1/users/technicians/by-speciality/${encodeURIComponent(specialty)}`);
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
