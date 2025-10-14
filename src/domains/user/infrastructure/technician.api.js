export class TechnicianApi {
    constructor() {
        this.baseURL = 'http://localhost:3000';
    }

    async getAll() {
        try {
            const response = await fetch(`${this.baseURL}/users?type=technician`);
            const technicians = await response.json();
            return technicians;
        } catch (error) {
            console.error('Error fetching technicians:', error);
            return [];
        }
    }

    async getById(id) {
        try {
            const response = await fetch(`${this.baseURL}/users/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const technician = await response.json();

            if (technician.type !== 'technician') {
                throw new Error('User is not a technician');
            }

            const reviewsResponse = await fetch(`${this.baseURL}/reviews?technicianId=${id}`);
            const reviews = await reviewsResponse.json();

            return {
                ...technician,
                reviews: reviews || []
            };
        } catch (error) {
            console.error('Error fetching technician:', error);
            throw error;
        }
    }

    async getBySpecialty(specialty) {
        try {
            const response = await fetch(`${this.baseURL}/users?type=technician&speciality=${specialty}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching technicians by specialty:', error);
            return [];
        }
    }
}