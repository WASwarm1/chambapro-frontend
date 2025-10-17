export class ReserveApi {
    constructor() {
        this.baseURL = 'http://localhost:3000';
    }

    /**
     * Fetches all reservations from the API.
     * @returns {Promise<Array>}
     */
    async getAll() {
        try {
            const response = await fetch(`${this.baseURL}/reservations`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching reservations:', error);
            return [];
        }
    }

    /**
     * Gets reservations by client ID
     * @param {string} clientId - Client ID
     * @returns {Promise<Array>}
     */
    async getByClientId(clientId) {
        try {
            const response = await fetch(`${this.baseURL}/reservations?clientId=${clientId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching client reservations:', error);
            return [];
        }
    }

    /**
     * Gets reservations by technician ID
     * @param {string} technicianId - Technician ID
     * @returns {Promise<Array>}
     */
    async getByTechnicianId(technicianId) {
        try {
            const response = await fetch(`${this.baseURL}/reservations?technicianId=${technicianId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching technician reservations:', error);
            return [];
        }
    }

    /**
     * Creates a new reservation
     * @param {Object} reservationData - Reservation data
     * @returns {Promise<{success: boolean, reservation?: Object, message?: string}>}
     */
    async createReservation(reservationData) {
        try {
            const newReservation = {
                id: Date.now().toString(),
                ...reservationData,
                createdAt: new Date().toISOString()
            };

            const response = await fetch(`${this.baseURL}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReservation)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const createdReservation = await response.json();

            return {
                success: true,
                reservation: createdReservation,
                message: 'Reservation created successfully'
            };

        } catch (error) {
            console.error('Error creating reservation:', error);
            return {
                success: false,
                message: 'Error creating reservation: ' + error.message
            };
        }
    }

    /**
     * Updates a reservation
     * @param {string} reservationId - Reservation ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<{success: boolean, message?: string}>}
     */
    async updateReservation(reservationId, updateData) {
        try {
            const response = await fetch(`${this.baseURL}/reservations/${reservationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return {
                success: true,
                message: 'Reservation updated successfully'
            };

        } catch (error) {
            console.error('Error updating reservation:', error);
            return {
                success: false,
                message: 'Error updating reservation: ' + error.message
            };
        }
    }

    /**
     * Cancels a reservation
     * @param {string} reservationId - Reservation ID
     * @returns {Promise<{success: boolean, message?: string}>}
     */
    async cancelReservation(reservationId) {
        try {
            const response = await fetch(`${this.baseURL}/reservations/${reservationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'cancelled' })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return {
                success: true,
                message: 'Reservation cancelled successfully'
            };

        } catch (error) {
            console.error('Error cancelling reservation:', error);
            return {
                success: false,
                message: 'Error cancelling reservation: ' + error.message
            };
        }
    }
}