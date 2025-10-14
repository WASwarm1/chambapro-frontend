export class ReserveApi {
    constructor() {
        this.baseURL = 'http://localhost:3000';
    }

    async createReservation(reservationData) {
        try {
            const newReservation = {
                id: Date.now(),
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

            if (response.ok) {
                return {
                    success: true,
                    reservation: newReservation,
                    message: 'Reservation created successfully'
                };
            } else {
                return {
                    success: false,
                    message: 'Error creating reservation'
                };
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            return {
                success: false,
                message: 'Connection error'
            };
        }
    }

    async getReservationsByClient(clientId) {
        try {
            const response = await fetch(`${this.baseURL}/reservations?clientId=${clientId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching reservations:', error);
            return [];
        }
    }

    async getReservationsByTechnician(technicianId) {
        try {
            const response = await fetch(`${this.baseURL}/reservations?technicianId=${technicianId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching reservations:', error);
            return [];
        }
    }
}