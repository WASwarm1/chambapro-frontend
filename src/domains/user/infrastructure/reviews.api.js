export class ReviewsApi {
    constructor() {
        this.baseURL = 'https://chambapro-platform-production.up.railway.app';
    }

    async getByTechnicianId(technicianId) {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/Review/technician/${technicianId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // The backend returns { message, data }, so extract the data array
            const reviews = data.data || [];
            return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    }

    async createReview(reviewData) {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/Review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });

            if (response.ok) {
                return {
                    success: true,
                    message: 'Review created successfully'
                };
            } else {
                try {
                    const errorData = await response.json();
                    return {
                        success: false,
                        message: errorData.message || 'Error al crear la reseña'
                    };
                } catch (err) {
                    return {
                        success: false,
                        message: 'Error al crear la reseña: Server error'
                    };
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error de conexión'
            };
        }
    }
}
