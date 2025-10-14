export class ReviewsApi {
    constructor() {
        this.baseURL = 'http://localhost:3000';
    }

    async getByTechnicianId(technicianId) {
        try {
            const response = await fetch(`${this.baseURL}/reviews?technicianId=${technicianId}`);
            const reviews = await response.json();

            return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    }

    async createReview(reviewData) {
        try {
            const newReview = {
                id: Date.now(),
                ...reviewData,
                createdAt: new Date().toISOString()
            };

            const response = await fetch(`${this.baseURL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReview)
            });

            if (response.ok) {
                await this.updateTechnicianRating(reviewData.technicianId);

                return {
                    success: true,
                    review: newReview
                };
            } else {
                return {
                    success: false,
                    message: 'Error al crear la reseña'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error de conexión'
            };
        }
    }

    async updateTechnicianRating(technicianId) {
        try {
            const reviewsResponse = await fetch(`${this.baseURL}/reviews?technicianId=${technicianId}`);
            const reviews = await reviewsResponse.json();

            if (reviews.length === 0) return;

            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;

            const technicianResponse = await fetch(`${this.baseURL}/users/${technicianId}`);
            const technician = await technicianResponse.json();

            const updatedTechnician = {
                ...technician,
                rating: parseFloat(averageRating.toFixed(1)),
                reviewsCount: reviews.length
            };

            await fetch(`${this.baseURL}/users/${technicianId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTechnician)
            });
        } catch (error) {
            console.error('Error updating technician rating:', error);
        }
    }
}